-- =============================================
-- TECH LAB DATABASE SCHEMA
-- =============================================
-- Este archivo contiene el esquema completo de la base de datos
-- para el Tech Lab Platform migrado a Supabase

-- =============================================
-- 1. CONFIGURACIÓN INICIAL
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 2. TABLA DE USUARIOS (AUTH + PROFILES)
-- =============================================

-- Tabla de perfiles de usuario (complementa auth.users de Supabase)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'visitor' CHECK (role IN ('visitor', 'student', 'researcher', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. TABLA DE TECNOLOGÍAS
-- =============================================

CREATE TABLE public.technologies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon TEXT NOT NULL,
    gradient VARCHAR(255) NOT NULL,
    primary_color VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    about_title VARCHAR(255) NOT NULL,
    about_content TEXT[] NOT NULL,
    features_title VARCHAR(255) NOT NULL,
    features_items JSONB NOT NULL, -- [{text: string, color: string}]
    projects JSONB NOT NULL, -- [{title: string, description: string}]
    has_direct_links BOOLEAN DEFAULT FALSE,
    direct_links JSONB, -- [{href: string, text: string, primary: boolean}]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. TABLA DE PROYECTOS
-- =============================================

CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    technologies TEXT[] NOT NULL, -- Array de strings con tecnologías
    related_technology_ids TEXT[] NOT NULL, -- IDs de tecnologías vinculadas
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('active', 'completed', 'paused', 'planning')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    start_date DATE NOT NULL,
    end_date DATE,
    team_lead VARCHAR(255) NOT NULL,
    team_members TEXT[] DEFAULT '{}',
    budget DECIMAL(10,2),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    objectives TEXT[] NOT NULL,
    challenges TEXT[] DEFAULT '{}',
    gallery TEXT[] DEFAULT '{}', -- URLs de imágenes
    demo_url TEXT,
    repository_url TEXT,
    documentation TEXT,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. TABLA DE INVESTIGADORES
-- =============================================

CREATE TABLE public.researchers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, -- Vinculado a usuario si tiene cuenta
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    specializations TEXT[] NOT NULL,
    biography TEXT NOT NULL,
    academic_level VARCHAR(20) NOT NULL CHECK (academic_level IN ('undergraduate', 'bachelor', 'master', 'phd', 'postdoc', 'professor')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'alumni', 'visiting')),
    join_date DATE NOT NULL,
    end_date DATE,
    
    -- Información de contacto
    phone VARCHAR(20),
    linkedin_url TEXT,
    research_gate_url TEXT,
    orcid TEXT,
    personal_website TEXT,
    
    -- Información académica
    university VARCHAR(255),
    degree VARCHAR(255),
    research_interests TEXT[] DEFAULT '{}',
    publications TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    
    -- Estadísticas
    projects_completed INTEGER DEFAULT 0,
    publications_count INTEGER DEFAULT 0,
    years_experience INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. TABLA DE RELACIONES PROYECTO-INVESTIGADOR
-- =============================================

CREATE TABLE public.project_researchers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    researcher_id UUID REFERENCES public.researchers(id) ON DELETE CASCADE,
    role VARCHAR(255) NOT NULL, -- Rol en el proyecto
    is_current BOOLEAN DEFAULT TRUE, -- Si es proyecto actual o pasado
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    
    UNIQUE(project_id, researcher_id)
);

-- =============================================
-- 7. TABLA DE INVENTARIO
-- =============================================

CREATE TABLE public.inventory_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'broken')),
    location VARCHAR(255),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    serial_number VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    specifications JSONB,
    image_url TEXT,
    notes TEXT,
    is_loanable BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. TABLA DE PRÉSTAMOS
-- =============================================

CREATE TABLE public.loans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    borrower_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    loan_date TIMESTAMPTZ DEFAULT NOW(),
    expected_return_date DATE NOT NULL,
    actual_return_date TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue', 'lost', 'damaged')),
    condition_on_loan VARCHAR(20) DEFAULT 'good',
    condition_on_return VARCHAR(20),
    notes TEXT,
    approved_by UUID REFERENCES public.user_profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. TABLA DE RELACIONES PROYECTO-TECNOLOGÍA
-- =============================================

CREATE TABLE public.project_technologies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    technology_id VARCHAR(50) REFERENCES public.technologies(id) ON DELETE CASCADE,
    usage_type VARCHAR(50), -- 'primary', 'secondary', 'tool', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(project_id, technology_id)
);

-- =============================================
-- 10. TRIGGERS PARA UPDATED_AT
-- =============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON public.technologies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_researchers_updated_at BEFORE UPDATE ON public.researchers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON public.loans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 11. POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can do everything" ON public.user_profiles FOR ALL USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- Políticas para technologies (lectura pública)
CREATE POLICY "Everyone can view technologies" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Admins can manage technologies" ON public.technologies FOR ALL USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- Políticas para projects (lectura pública, escritura para investigadores y admins)
CREATE POLICY "Everyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Researchers and admins can manage projects" ON public.projects FOR ALL USING (
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()) IN ('researcher', 'admin')
);

-- Políticas para researchers (lectura pública, escritura para admins)
CREATE POLICY "Everyone can view researchers" ON public.researchers FOR SELECT USING (true);
CREATE POLICY "Admins can manage researchers" ON public.researchers FOR ALL USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- Políticas para inventario (lectura para autenticados, escritura para admins)
CREATE POLICY "Authenticated users can view inventory" ON public.inventory_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage inventory" ON public.inventory_items FOR ALL USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- Políticas para préstamos (usuarios ven sus préstamos, admins ven todos)
CREATE POLICY "Users can view own loans" ON public.loans FOR SELECT USING (borrower_id = auth.uid());
CREATE POLICY "Admins can view all loans" ON public.loans FOR SELECT USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage loans" ON public.loans FOR ALL USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- Políticas para relaciones (lectura pública)
CREATE POLICY "Everyone can view project relationships" ON public.project_researchers FOR SELECT USING (true);
CREATE POLICY "Everyone can view technology relationships" ON public.project_technologies FOR SELECT USING (true);
CREATE POLICY "Admins can manage relationships" ON public.project_researchers FOR ALL USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage tech relationships" ON public.project_technologies FOR ALL USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin');

-- =============================================
-- 12. ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_researchers_department ON public.researchers(department);
CREATE INDEX idx_researchers_status ON public.researchers(status);
CREATE INDEX idx_inventory_category ON public.inventory_items(category);
CREATE INDEX idx_loans_status ON public.loans(status);
CREATE INDEX idx_loans_borrower ON public.loans(borrower_id);

-- Índices para arrays y JSONB
CREATE INDEX idx_projects_technologies ON public.projects USING GIN(technologies);
CREATE INDEX idx_researchers_specializations ON public.researchers USING GIN(specializations);

-- =============================================
-- 13. COMENTARIOS EN TABLAS
-- =============================================

COMMENT ON TABLE public.user_profiles IS 'Perfiles de usuario complementarios al auth de Supabase';
COMMENT ON TABLE public.technologies IS 'Catálogo de tecnologías disponibles en el Tech Lab';
COMMENT ON TABLE public.projects IS 'Proyectos de investigación y desarrollo';
COMMENT ON TABLE public.researchers IS 'Investigadores y trabajadores del Tech Lab';
COMMENT ON TABLE public.project_researchers IS 'Relación many-to-many entre proyectos e investigadores';
COMMENT ON TABLE public.inventory_items IS 'Inventario de equipos y materiales del laboratorio';
COMMENT ON TABLE public.loans IS 'Registro de préstamos de equipos';
COMMENT ON TABLE public.project_technologies IS 'Relación many-to-many entre proyectos y tecnologías';