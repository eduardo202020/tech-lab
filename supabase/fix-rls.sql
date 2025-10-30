-- =============================================
-- FIX PARA POLÍTICAS RLS
-- =============================================
-- Ejecuta este script para arreglar el problema de recursión infinita

-- Primero, eliminar todas las políticas problemáticas
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can do everything" ON public.user_profiles;
DROP POLICY IF EXISTS "Everyone can view technologies" ON public.technologies;
DROP POLICY IF EXISTS "Admins can manage technologies" ON public.technologies;
DROP POLICY IF EXISTS "Everyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Researchers and admins can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Everyone can view researchers" ON public.researchers;
DROP POLICY IF EXISTS "Admins can manage researchers" ON public.researchers;
DROP POLICY IF EXISTS "Authenticated users can view inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Users can view own loans" ON public.loans;
DROP POLICY IF EXISTS "Admins can view all loans" ON public.loans;
DROP POLICY IF EXISTS "Admins can manage loans" ON public.loans;
DROP POLICY IF EXISTS "Everyone can view project relationships" ON public.project_researchers;
DROP POLICY IF EXISTS "Everyone can view technology relationships" ON public.project_technologies;
DROP POLICY IF EXISTS "Admins can manage relationships" ON public.project_researchers;
DROP POLICY IF EXISTS "Admins can manage tech relationships" ON public.project_technologies;

-- Deshabilitar RLS temporalmente para development
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.researchers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_researchers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies DISABLE ROW LEVEL SECURITY;

-- Crear políticas simples para lectura pública (sin recursión)
CREATE POLICY "Allow public read access" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.researchers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.project_researchers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.project_technologies FOR SELECT USING (true);

-- Habilitar RLS solo para las tablas públicas
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;