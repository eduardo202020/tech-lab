'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ResearcherRecord {
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
  status?: ResearcherRecord['status'];
  academic_level?: ResearcherRecord['academic_level'];
  specialization?: string;
  search?: string;
}

interface UseResearcherRecordsOptions {
  /** Si true, el hook hará una carga inicial al montar (con guard para StrictMode). */
  autoFetch?: boolean;
}

export function useResearchers(options?: UseResearcherRecordsOptions) {
  const autoFetch = options?.autoFetch ?? true;
  const [researchers, setResearchers] = useState<ResearcherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAutoFetched = useRef(false);

  // Cargar todos los investigadores desde PostgreSQL vía API interna
  const fetchResearchers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/researchers');
      if (!res.ok) throw new Error('No se pudo cargar investigadores desde PostgreSQL');

      const json = await res.json();
      setResearchers((json.researchers || []) as ResearcherRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching researchers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener investigador por ID
  const getResearcher = useCallback(async (id: string): Promise<ResearcherRecord | null> => {
    return researchers.find((researcher) => researcher.id === id) || null;
  }, [researchers]);

  // Filtrar investigadores
  const filterResearchers = useCallback((filters: ResearcherFilters): ResearcherRecord[] => {
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
  const getResearchersByProject = useCallback(async (projectId: string): Promise<ResearcherRecord[]> => {
    return researchers.filter(
      (researcher) =>
        researcher.current_projects?.some((project) => project.id === projectId) ||
        researcher.past_projects?.some((project) => project.id === projectId)
    );
  }, [researchers]);

  // Crear investigador
  const createResearcher = useCallback(async (
    researcherData: Omit<ResearcherRecord, 'id' | 'created_at' | 'updated_at' | 'current_projects' | 'past_projects'>
  ): Promise<ResearcherRecord | null> => {
    try {
      const res = await fetch('/api/researchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(researcherData),
      });

      if (!res.ok) {
        throw new Error('No se pudo crear investigador en PostgreSQL');
      }

      const json = await res.json();
      const created = json.researcher as ResearcherRecord;
      setResearchers((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando investigador');
      console.error('Error creating researcher:', err);
      return null;
    }
  }, []);

  // Actualizar investigador
  const updateResearcher = useCallback(async (
    id: string,
    updates: Partial<ResearcherRecord>
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/researchers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });

      if (!res.ok) {
        throw new Error('No se pudo actualizar investigador en PostgreSQL');
      }

      const json = await res.json();
      const updated = json.researcher as ResearcherRecord;
      setResearchers((prev) =>
        prev.map((researcher) => (researcher.id === id ? updated : researcher))
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando investigador');
      console.error('Error updating researcher:', err);
      return false;
    }
  }, []);

  // Eliminar investigador
  const deleteResearcher = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/researchers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar investigador en PostgreSQL');
      }

      setResearchers((prev) => prev.filter((researcher) => researcher.id !== id));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando investigador');
      console.error('Error deleting researcher:', err);
      return false;
    }
  }, []);

  // Asignar investigador a proyecto
  const assignToProject = useCallback(async (
    researcherId: string,
    projectId: string,
    role: string
  ): Promise<boolean> => {
    try {
      setResearchers((prev) =>
        prev.map((researcher) => {
          if (researcher.id !== researcherId) return researcher;

          const currentProjects = researcher.current_projects || [];
          if (currentProjects.some((project) => project.id === projectId)) return researcher;

          return {
            ...researcher,
            current_projects: [
              ...currentProjects,
              {
                id: projectId,
                title: `Proyecto ${projectId}`,
                role,
                status: 'active',
                progress: 0,
              },
            ],
            updated_at: new Date().toISOString(),
          };
        })
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error asignando investigador');
      console.error('Error assigning researcher:', err);
      return false;
    }
  }, []);

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

  // Cargar datos al montar el componente (una sola vez, protegido ante StrictMode)
  useEffect(() => {
    if (!autoFetch) return;
    if (hasAutoFetched.current) return;
    hasAutoFetched.current = true;
    fetchResearchers();
  }, [autoFetch, fetchResearchers]);

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