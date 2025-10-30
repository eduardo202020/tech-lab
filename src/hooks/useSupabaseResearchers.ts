'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface SupabaseResearcher {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  avatar_url?: string;
  position: string;
  department: string;
  specializations: string[];
  biography: string;
  academic_level: 'undergraduate' | 'bachelor' | 'master' | 'phd' | 'postdoc' | 'professor';
  status: 'active' | 'inactive' | 'alumni' | 'visiting';
  join_date: string;
  end_date?: string;

  // Información de contacto
  phone?: string;
  linkedin_url?: string;
  research_gate_url?: string;
  orcid?: string;
  personal_website?: string;

  // Información académica
  university?: string;
  degree?: string;
  research_interests: string[];
  publications: string[];
  achievements: string[];

  // Estadísticas
  projects_completed: number;
  publications_count: number;
  years_experience: number;

  created_by?: string;
  created_at: string;
  updated_at: string;

  // Proyectos relacionados (populados)
  current_projects?: Array<{
    id: string;
    title: string;
    role: string;
    status: string;
    progress: number;
  }>;
  
  past_projects?: Array<{
    id: string;
    title: string;
    role: string;
    status: string;
  }>;
}

interface ResearcherFilters {
  department?: string;
  status?: SupabaseResearcher['status'];
  academic_level?: SupabaseResearcher['academic_level'];
  specialization?: string;
  search?: string;
}

export function useSupabaseResearchers() {
  const [researchers, setResearchers] = useState<SupabaseResearcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los investigadores con sus proyectos
  const fetchResearchers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: researchersData, error: researchersError } = await supabase
        .from('researchers')
        .select(`
          *,
          project_researchers (
            project_id,
            role,
            is_current,
            projects (
              id,
              title,
              status,
              progress
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (researchersError) {
        throw new Error(researchersError.message);
      }

      // Transformar datos para incluir proyectos actuales y pasados
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedResearchers: SupabaseResearcher[] = researchersData?.map((researcher: any) => {
        const projectRelations = researcher.project_researchers || [];
        
        return {
          ...researcher,
          current_projects: projectRelations
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((pr: any) => pr.is_current)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((pr: any) => ({
              id: pr.projects?.id || '',
              title: pr.projects?.title || '',
              role: pr.role,
              status: pr.projects?.status || '',
              progress: pr.projects?.progress || 0
            })),
          past_projects: projectRelations
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((pr: any) => !pr.is_current)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((pr: any) => ({
              id: pr.projects?.id || '',
              title: pr.projects?.title || '',
              role: pr.role,
              status: pr.projects?.status || ''
            }))
        };
      }) || [];

      setResearchers(transformedResearchers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching researchers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener investigador por ID
  const getResearcher = useCallback(async (id: string): Promise<SupabaseResearcher | null> => {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .select(`
          *,
          project_researchers (
            project_id,
            role,
            is_current,
            joined_at,
            left_at,
            projects (
              id,
              title,
              status,
              progress,
              category,
              description
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) return null;

      const projectRelations = data.project_researchers || [];
      
      return {
        ...data,
        current_projects: projectRelations
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((pr: any) => pr.is_current)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((pr: any) => ({
            id: pr.projects?.id || '',
            title: pr.projects?.title || '',
            role: pr.role,
            status: pr.projects?.status || '',
            progress: pr.projects?.progress || 0
          })),
        past_projects: projectRelations
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((pr: any) => !pr.is_current)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((pr: any) => ({
            id: pr.projects?.id || '',
            title: pr.projects?.title || '',
            role: pr.role,
            status: pr.projects?.status || ''
          }))
      };
    } catch (err) {
      console.error('Error fetching researcher:', err);
      return null;
    }
  }, []);

  // Filtrar investigadores
  const filterResearchers = useCallback((filters: ResearcherFilters): SupabaseResearcher[] => {
    return researchers.filter(researcher => {
      if (filters.department && researcher.department !== filters.department) return false;
      if (filters.status && researcher.status !== filters.status) return false;
      if (filters.academic_level && researcher.academic_level !== filters.academic_level) return false;
      if (filters.specialization && !researcher.specializations.includes(filters.specialization)) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          researcher.name.toLowerCase().includes(searchTerm) ||
          researcher.position.toLowerCase().includes(searchTerm) ||
          researcher.department.toLowerCase().includes(searchTerm) ||
          researcher.specializations.some(spec => spec.toLowerCase().includes(searchTerm)) ||
          researcher.research_interests.some(interest => interest.toLowerCase().includes(searchTerm))
        );
      }
      return true;
    });
  }, [researchers]);

  // Obtener investigadores por proyecto
  const getResearchersByProject = useCallback(async (projectId: string): Promise<SupabaseResearcher[]> => {
    try {
      const { data, error } = await supabase
        .from('project_researchers')
        .select(`
          role,
          is_current,
          researchers (*)
        `)
        .eq('project_id', projectId);

      if (error) {
        throw new Error(error.message);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data?.map((pr: any) => pr.researchers).filter(Boolean) as SupabaseResearcher[] || [];
    } catch (err) {
      console.error('Error fetching researchers by project:', err);
      return [];
    }
  }, []);

  // Crear investigador
  const createResearcher = useCallback(async (
    researcherData: Omit<SupabaseResearcher, 'id' | 'created_at' | 'updated_at' | 'current_projects' | 'past_projects'>
  ): Promise<SupabaseResearcher | null> => {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .insert([researcherData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Recargar la lista
      await fetchResearchers();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando investigador');
      console.error('Error creating researcher:', err);
      return null;
    }
  }, [fetchResearchers]);

  // Actualizar investigador
  const updateResearcher = useCallback(async (
    id: string, 
    updates: Partial<SupabaseResearcher>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('researchers')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Recargar la lista
      await fetchResearchers();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando investigador');
      console.error('Error updating researcher:', err);
      return false;
    }
  }, [fetchResearchers]);

  // Eliminar investigador
  const deleteResearcher = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('researchers')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Recargar la lista
      await fetchResearchers();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando investigador');
      console.error('Error deleting researcher:', err);
      return false;
    }
  }, [fetchResearchers]);

  // Asignar investigador a proyecto
  const assignToProject = useCallback(async (
    researcherId: string,
    projectId: string,
    role: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('project_researchers')
        .insert([{
          researcher_id: researcherId,
          project_id: projectId,
          role,
          is_current: true
        }]);

      if (error) {
        throw new Error(error.message);
      }

      // Recargar la lista
      await fetchResearchers();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error asignando investigador');
      console.error('Error assigning researcher:', err);
      return false;
    }
  }, [fetchResearchers]);

  // Obtener estadísticas
  const getResearcherStats = useCallback(() => {
    const total = researchers.length;
    const active = researchers.filter(r => r.status === 'active').length;
    const departments = [...new Set(researchers.map(r => r.department))];
    const avgPublications = researchers.reduce((sum, r) => sum + r.publications_count, 0) / total || 0;
    const totalProjects = researchers.reduce((sum, r) => sum + r.projects_completed, 0);

    return {
      total,
      active,
      inactive: researchers.filter(r => r.status === 'inactive').length,
      alumni: researchers.filter(r => r.status === 'alumni').length,
      visiting: researchers.filter(r => r.status === 'visiting').length,
      departments: departments.length,
      avgPublications: Math.round(avgPublications),
      totalProjects,
      academicLevels: {
        undergraduate: researchers.filter(r => r.academic_level === 'undergraduate').length,
        bachelor: researchers.filter(r => r.academic_level === 'bachelor').length,
        master: researchers.filter(r => r.academic_level === 'master').length,
        phd: researchers.filter(r => r.academic_level === 'phd').length,
        postdoc: researchers.filter(r => r.academic_level === 'postdoc').length,
        professor: researchers.filter(r => r.academic_level === 'professor').length
      }
    };
  }, [researchers]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  return {
    researchers,
    loading,
    error,
    fetchResearchers,
    getResearcher,
    filterResearchers,
    getResearchersByProject,
    createResearcher,
    updateResearcher,
    deleteResearcher,
    assignToProject,
    getResearcherStats
  };
}