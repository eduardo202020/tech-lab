'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface SupabaseProject {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  related_technology_ids: string[];
  status: 'active' | 'completed' | 'paused' | 'planning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date?: string;
  team_lead: string;
  team_members: string[];
  budget?: number;
  progress: number;
  objectives: string[];
  challenges: string[];
  gallery: string[];
  demo_url?: string;
  repository_url?: string;
  documentation?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;

  // Relaciones populadas
  researchers?: Array<{
    id: string;
    name: string;
    role: string;
    is_current: boolean;
  }>;

  related_technologies?: Array<{
    id: string;
    name: string;
    icon: string;
    usage_type: string;
  }>;
}

interface ProjectFilters {
  status?: SupabaseProject['status'];
  category?: string;
  priority?: SupabaseProject['priority'];
  technology?: string;
  search?: string;
}

export function useSupabaseProjects() {
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los proyectos con relaciones
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(
          `
          *,
          project_researchers (
            researcher_id,
            role,
            is_current,
            researchers (
              id,
              name
            )
          ),
          project_technologies (
            technology_id,
            usage_type,
            technologies (
              id,
              name,
              icon
            )
          )
        `
        )
        .order('created_at', { ascending: false });

      if (projectsError) {
        throw new Error(projectsError.message);
      }

      // Tipos intermedios para las relaciones devueltas por supabase
      type ProjectResearchRow = {
        researcher_id?: string;
        role?: string;
        is_current?: boolean;
        researchers?: { id?: string; name?: string } | null;
      };

      type ProjectTechRow = {
        technology_id?: string;
        usage_type?: string;
        technologies?: { id?: string; name?: string; icon?: string } | null;
      };

      // Transformar datos para que coincidan con la interfaz
      type RawProjectRow = Record<string, unknown> & {
        project_researchers?: ProjectResearchRow[];
        project_technologies?: ProjectTechRow[];
      };

      const transformedProjects: SupabaseProject[] =
        (projectsData as RawProjectRow[] | undefined)?.map((project) => ({
          // spread safely from a generic record
          ...(project as Record<string, unknown>),
          researchers:
            (project.project_researchers as ProjectResearchRow[])
              ?.map((pr) => ({
                id: pr.researchers?.id || '',
                name: pr.researchers?.name || '',
                role: pr.role || '',
                is_current: !!pr.is_current,
              })) || [],
          related_technologies:
            (project.project_technologies as ProjectTechRow[])
              ?.map((pt) => ({
                id: pt.technologies?.id || '',
                name: pt.technologies?.name || '',
                icon: pt.technologies?.icon || '',
                usage_type: pt.usage_type || '',
              })) || [],
        } as unknown as SupabaseProject)) || [];

      setProjects(transformedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener proyecto por ID
  const getProject = useCallback(
    async (id: string): Promise<SupabaseProject | null> => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(
            `
          *,
          project_researchers (
            researcher_id,
            role,
            is_current,
            researchers (
              id,
              name,
              email,
              avatar_url,
              position
            )
          ),
          project_technologies (
            technology_id,
            usage_type,
            technologies (
              id,
              name,
              icon,
              primary_color
            )
          )
        `
          )
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) return null;

        type ProjectResearchRow = {
          researcher_id?: string;
          role?: string;
          is_current?: boolean;
          researchers?: { id?: string; name?: string } | null;
        };

        type ProjectTechRow = {
          technology_id?: string;
          usage_type?: string;
          technologies?: { id?: string; name?: string; icon?: string } | null;
        };

        return {
          ...data,
          researchers:
            (data.project_researchers as ProjectResearchRow[])
              ?.map((pr) => ({
                id: pr.researchers?.id || '',
                name: pr.researchers?.name || '',
                role: pr.role || '',
                is_current: !!pr.is_current,
              })) || [],
          related_technologies:
            (data.project_technologies as ProjectTechRow[])
              ?.map((pt) => ({
                id: pt.technologies?.id || '',
                name: pt.technologies?.name || '',
                icon: pt.technologies?.icon || '',
                usage_type: pt.usage_type || '',
              })) || [],
        };
      } catch (err) {
        console.error('Error fetching project:', err);
        return null;
      }
    },
    []
  );

  // Filtrar proyectos
  const filterProjects = useCallback(
    (filters: ProjectFilters): SupabaseProject[] => {
      return projects.filter((project) => {
        if (filters.status && project.status !== filters.status) return false;
        if (filters.category && project.category !== filters.category)
          return false;
        if (filters.priority && project.priority !== filters.priority)
          return false;
        if (
          filters.technology &&
          !project.related_technology_ids.includes(filters.technology)
        )
          return false;
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return (
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.category.toLowerCase().includes(searchTerm) ||
            project.technologies.some((tech) =>
              tech.toLowerCase().includes(searchTerm)
            )
          );
        }
        return true;
      });
    },
    [projects]
  );

  // Obtener proyectos por tecnología
  const getProjectsByTechnology = useCallback(
    (technologyId: string): SupabaseProject[] => {
      return projects.filter((project) =>
        project.related_technology_ids.includes(technologyId)
      );
    },
    [projects]
  );

  // Crear proyecto
  const createProject = useCallback(
    async (
      projectData: Omit<SupabaseProject, 'id' | 'created_at' | 'updated_at'>
    ): Promise<SupabaseProject | null> => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        // Recargar la lista
        await fetchProjects();

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creando proyecto');
        console.error('Error creating project:', err);
        return null;
      }
    },
    [fetchProjects]
  );

  // Actualizar proyecto
  const updateProject = useCallback(
    async (id: string, updates: Partial<SupabaseProject>): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        // Recargar la lista
        await fetchProjects();

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error actualizando proyecto'
        );
        console.error('Error updating project:', err);
        return false;
      }
    },
    [fetchProjects]
  );

  // Eliminar proyecto
  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        // Recargar la lista
        await fetchProjects();

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error eliminando proyecto'
        );
        console.error('Error deleting project:', err);
        return false;
      }
    },
    [fetchProjects]
  );

  // Obtener estadísticas
  const getProjectStats = useCallback(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === 'active').length;
    const completed = projects.filter((p) => p.status === 'completed').length;
    const avgProgress =
      projects.reduce((sum, p) => sum + p.progress, 0) / total || 0;

    return {
      total,
      active,
      completed,
      paused: projects.filter((p) => p.status === 'paused').length,
      planning: projects.filter((p) => p.status === 'planning').length,
      avgProgress: Math.round(avgProgress),
      categories: [...new Set(projects.map((p) => p.category))].length,
      technologies: [...new Set(projects.flatMap((p) => p.technologies))]
        .length,
    };
  }, [projects]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    filterProjects,
    getProjectsByTechnology,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
  };
}
