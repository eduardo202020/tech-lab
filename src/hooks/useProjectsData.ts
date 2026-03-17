"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ProjectRecord {
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
  status?: ProjectRecord['status'];
  category?: string;
  priority?: ProjectRecord['priority'];
  technology?: string;
  search?: string;
}

interface UseProjectRecordsOptions {
  /** Si true, el hook hará una carga inicial al montar (con guard para StrictMode). */
  autoFetch?: boolean;
}

export function useProjectsData(options?: UseProjectRecordsOptions) {
  const autoFetch = options?.autoFetch ?? true;
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAutoFetched = useRef(false);

  // Cargar todos los proyectos desde PostgreSQL vía API interna
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('No se pudo cargar proyectos desde PostgreSQL');
      const json = await res.json();
      setProjects((json.projects || []) as ProjectRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener proyecto por ID desde el estado local
  const getProject = useCallback(
    (id: string): ProjectRecord | null => {
      return projects.find((project) => project.id === id) || null;
    },
    [projects]
  );

  // Filtrar proyectos según filtros
  const filterProjects = useCallback(
    (filters: ProjectFilters): ProjectRecord[] => {
      return projects.filter((project) => {
        if (filters.status && project.status !== filters.status) return false;
        if (filters.category && project.category !== filters.category) return false;
        if (filters.priority && project.priority !== filters.priority) return false;
        if (
          filters.technology &&
          !project.related_technology_ids.includes(filters.technology)
        ) return false;
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return (
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.category.toLowerCase().includes(searchTerm) ||
            project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm))
          );
        }
        return true;
      });
    },
    [projects]
  );

  // Obtener proyectos por tecnología
  const getProjectsByTechnology = useCallback(
    (technologyId: string): ProjectRecord[] => {
      return projects.filter((project) =>
        project.related_technology_ids.includes(technologyId)
      );
    },
    [projects]
  );

  // Crear proyecto
  const createProject = useCallback(
    async (
      projectData: Omit<ProjectRecord, 'id' | 'created_at' | 'updated_at'>
    ): Promise<ProjectRecord | null> => {
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });

        if (!res.ok) {
          throw new Error('No se pudo crear proyecto en PostgreSQL');
        }

        const json = await res.json();
        const created = json.project as ProjectRecord;
        setProjects((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creando proyecto');
        console.error('Error creating project:', err);
        return null;
      }
    },
    []
  );

  // Actualizar proyecto
  const updateProject = useCallback(
    async (id: string, updates: Partial<ProjectRecord>): Promise<boolean> => {
      try {
        const res = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates }),
        });

        if (!res.ok) {
          throw new Error('No se pudo actualizar proyecto en PostgreSQL');
        }

        const json = await res.json();
        const updated = json.project as ProjectRecord;
        setProjects((prev) =>
          prev.map((project) => (project.id === id ? updated : project))
        );
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error actualizando proyecto'
        );
        console.error('Error updating project:', err);
        return false;
      }
    },
    []
  );

  // Eliminar proyecto
  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('No se pudo eliminar proyecto en PostgreSQL');
        }

        setProjects((prev) => prev.filter((project) => project.id !== id));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error eliminando proyecto'
        );
        console.error('Error deleting project:', err);
        return false;
      }
    },
    []
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

  // Cargar datos al montar el componente (una sola vez, protegido ante StrictMode)
  useEffect(() => {
    if (!autoFetch) return;
    if (hasAutoFetched.current) return;
    hasAutoFetched.current = true;
    fetchProjects();
  }, [autoFetch, fetchProjects]);

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
