-- =============================================
-- CONFIGURACIÓN DE AUTENTICACIÓN SUPABASE
-- =============================================
-- Este script configura las políticas RLS y triggers necesarios
-- para la autenticación con Supabase

-- =============================================
-- 1. FUNCIÓN PARA CREAR PERFILES AUTOMÁTICAMENTE
-- =============================================

-- Función que se ejecuta cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY definer SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name, email, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuario'),
    NEW.email,
    'student'::text,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  RETURN NEW;
END;
$$;

-- =============================================
-- 2. TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
-- =============================================

-- Trigger que se ejecuta al crear usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR each ROW execute PROCEDURE public.handle_new_user();

-- =============================================
-- 3. POLÍTICAS RLS ACTUALIZADAS
-- =============================================

-- Eliminar políticas existentes para user_profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can do everything" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;

-- Nuevas políticas más específicas
CREATE POLICY "Enable read access for all users" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable delete for admins only" ON public.user_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- 4. POLÍTICAS PARA OTRAS TABLAS
-- =============================================

-- Actualizar políticas para inventory_items
DROP POLICY IF EXISTS "Authenticated users can view inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory_items;

CREATE POLICY "Everyone can view inventory items" ON public.inventory_items
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage inventory items" ON public.inventory_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para préstamos
DROP POLICY IF EXISTS "Users can view own loans" ON public.loans;
DROP POLICY IF EXISTS "Admins can view all loans" ON public.loans;
DROP POLICY IF EXISTS "Admins can manage loans" ON public.loans;

CREATE POLICY "Users can view own loans" ON public.loans
  FOR SELECT USING (
    borrower_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create loans" ON public.loans
  FOR INSERT WITH CHECK (borrower_id = auth.uid());

CREATE POLICY "Only admins can manage loans" ON public.loans
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete loans" ON public.loans
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- 5. CREAR USUARIO ADMIN INICIAL
-- =============================================

-- Insertar un perfil admin de ejemplo (necesitarás el UUID real del usuario después del registro)
-- Este comando se debe ejecutar después de que el primer admin se registre
-- UPDATE public.user_profiles SET role = 'admin' WHERE email = 'admin@techlab.com';

-- =============================================
-- 6. VERIFICACIÓN
-- =============================================

-- Verificar que las tablas y políticas están configuradas
SELECT schemaname, tablename, policyname, permissive, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Verificar que el trigger está activo
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public' AND trigger_name = 'on_auth_user_created';