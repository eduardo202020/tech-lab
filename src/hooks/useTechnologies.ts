'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProjectsData, ProjectRecord } from './useProjectsData';
import { createMockAuthHeaders } from '@/lib/mockAuthClient';

export interface TechnologyRecord {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  primary_color: string;
  description: string;
  about_title: string;
  about_content: string[];
  features_title: string;
  features_items: Array<{
    text: string;
    color: string;
  }>;
  example_projects: Array<{
    title: string;
    description: string;
  }>;
  has_direct_links: boolean;
  direct_links?: Array<{
    href: string;
    text: string;
    primary: boolean;
  }>;
  created_at: string;
  updated_at: string;
}

interface UseTechnologyRecordsOptions {
  autoFetch?: boolean;
}

// Interfaz legacy para compatibilidad
export interface Technology {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  primaryColor: string;
  description: string;
  about: {
    title: string;
    content: string[];
  };
  features: {
    title: string;
    items: {
      text: string;
      color: string;
    }[];
  };
  projects: {
    title: string;
    description: string;
  }[];
  relatedProjects?: {
    id: string;
    title: string;
    status: string;
    progress: number;
  }[];
  hasDirectLinks?: boolean;
  directLinks?: {
    href: string;
    text: string;
    primary: boolean;
  }[];
}

// Convierte el registro de API a estructura legacy usada por la UI
function convertTechnologyRecordToLegacy(
  technology: TechnologyRecord,
  relatedProjects: ProjectRecord[]
): Technology {
  return {
    id: technology.id,
    name: technology.name,
    icon: technology.icon,
    gradient: technology.gradient,
    primaryColor: technology.primary_color,
    description: technology.description,
    about: {
      title: technology.about_title,
      content: technology.about_content,
    },
    features: {
      title: technology.features_title,
      items: technology.features_items,
    },
    projects: technology.example_projects,
    relatedProjects: relatedProjects.map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      progress: project.progress,
    })),
    hasDirectLinks: technology.has_direct_links,
    directLinks: technology.direct_links,
  };
}

export function useTechnologies(options?: UseTechnologyRecordsOptions) {
  const autoFetch = options?.autoFetch ?? true;
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [technologyRecords, setTechnologyRecords] = useState<TechnologyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projects } = useProjectsData();

  const loadTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/technologies');
      if (!response.ok) {
        throw new Error('No se pudo cargar tecnologías desde PostgreSQL');
      }
      const json = await response.json();
      const technologiesData = (json.technologies || []) as TechnologyRecord[];
      setTechnologyRecords(technologiesData);

      // Convertir y enriquecer con proyectos relacionados
      const enrichedTechnologies = technologiesData.map(
        (technology: TechnologyRecord) => {
          // Encontrar proyectos relacionados por technology IDs
          const relatedProjects = projects.filter((project) =>
            project.related_technology_ids?.includes(technology.id)
          );

          return convertTechnologyRecordToLegacy(
            technology,
            relatedProjects
          );
        }
      );

      setTechnologies(enrichedTechnologies);
    } catch (err) {
      console.error('Error in loadTechnologies:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    if (!autoFetch) return;
    loadTechnologies();
  }, [autoFetch, loadTechnologies]);

  const createTechnology = useCallback(
    async (
      technologyData: Omit<TechnologyRecord, 'created_at' | 'updated_at'>
    ): Promise<TechnologyRecord | null> => {
      try {
        const response = await fetch('/api/technologies', {
          method: 'POST',
          headers: createMockAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(technologyData),
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(
            json.error || 'No se pudo crear tecnología en PostgreSQL'
          );
        }

        const json = await response.json();
        const created = json.technology as TechnologyRecord;
        await loadTechnologies();
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        return null;
      }
    },
    [loadTechnologies]
  );

  const updateTechnology = useCallback(
    async (id: string, updates: Partial<TechnologyRecord>): Promise<boolean> => {
      try {
        const response = await fetch('/api/technologies', {
          method: 'PUT',
          headers: createMockAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ id, updates }),
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(
            json.error || 'No se pudo actualizar tecnología en PostgreSQL'
          );
        }

        await loadTechnologies();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        return false;
      }
    },
    [loadTechnologies]
  );

  const deleteTechnology = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/technologies?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: createMockAuthHeaders(),
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(
            json.error || 'No se pudo eliminar tecnología en PostgreSQL'
          );
        }

        await loadTechnologies();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        return false;
      }
    },
    [loadTechnologies]
  );

  const getTechnology = useCallback(
    (id: string) => {
      return technologies.find((tech) => tech.id === id);
    },
    [technologies]
  );

  const getTechnologiesByProject = useCallback(
    (projectId: string) => {
      return technologies.filter((tech) =>
        tech.relatedProjects?.some((proj) => proj.id === projectId)
      );
    },
    [technologies]
  );

  const searchTechnologies = useCallback(
    (query: string) => {
      if (!query.trim()) return technologies;

      const lowerQuery = query.toLowerCase();
      return technologies.filter(
        (tech) =>
          tech.name.toLowerCase().includes(lowerQuery) ||
          tech.description.toLowerCase().includes(lowerQuery) ||
          tech.about.content.some((content) =>
            content.toLowerCase().includes(lowerQuery)
          )
      );
    },
    [technologies]
  );

  return {
    technologies,
    technologyRecords,
    loading,
    error,
    createTechnology,
    updateTechnology,
    deleteTechnology,
    getTechnology,
    getTechnologiesByProject,
    searchTechnologies,
    refreshTechnologies: loadTechnologies,
    clearError: () => setError(null),
  };
}
