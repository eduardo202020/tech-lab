'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { SupabaseProject } from './useSupabaseProjects';

export interface SupabaseTechnology {
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

// Función para convertir datos de Supabase al formato legacy
function convertSupabaseTechnologyToLegacy(
  supabaseTech: SupabaseTechnology,
  relatedProjects: SupabaseProject[]
): Technology {
  return {
    id: supabaseTech.id,
    name: supabaseTech.name,
    icon: supabaseTech.icon,
    gradient: supabaseTech.gradient,
    primaryColor: supabaseTech.primary_color,
    description: supabaseTech.description,
    about: {
      title: supabaseTech.about_title,
      content: supabaseTech.about_content,
    },
    features: {
      title: supabaseTech.features_title,
      items: supabaseTech.features_items,
    },
    projects: supabaseTech.example_projects,
    relatedProjects: relatedProjects.map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      progress: project.progress,
    })),
    hasDirectLinks: supabaseTech.has_direct_links,
    directLinks: supabaseTech.direct_links,
  };
}

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar tecnologías desde Supabase
      const { data: technologiesData, error: techError } = await supabase
        .from('technologies')
        .select('*')
        .order('name', { ascending: true });

      if (techError) {
        console.error('Error loading technologies:', techError);
        setError(techError.message);
        return;
      }

      // Convertir tecnologías sin cargar proyectos relacionados (se cargarán bajo demanda)
      const enrichedTechnologies = technologiesData.map(
        (supabaseTech: SupabaseTechnology) =>
          convertSupabaseTechnologyToLegacy(supabaseTech, [])
      );

      setTechnologies(enrichedTechnologies);
    } catch (err) {
      console.error('Error in loadTechnologies:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTechnologies();
  }, [loadTechnologies]);

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

  // Cargar proyectos relacionados para una tecnología específica (bajo demanda)
  const fetchRelatedProjectsForTechnology = useCallback(
    async (technologyId: string) => {
      try {
        const { data, error: projError } = await supabase
          .from('projects')
          .select('id, title, status, progress, related_technology_ids')
          .contains('related_technology_ids', [technologyId]);

        if (projError) {
          console.error('Error loading related projects:', projError);
          return [] as {
            id: string;
            title: string;
            status: string;
            progress: number;
          }[];
        }

        const simplified = (data || []).map((project: any) => ({
          id: project.id as string,
          title: project.title as string,
          status: project.status as string,
          progress: (project.progress ?? 0) as number,
        }));

        // Actualizar el estado de tecnologías con los proyectos relacionados
        setTechnologies((prev) =>
          prev.map((tech) =>
            tech.id === technologyId
              ? { ...tech, relatedProjects: simplified }
              : tech
          )
        );

        return simplified;
      } catch (err) {
        console.error('Error fetching related projects:', err);
        return [] as {
          id: string;
          title: string;
          status: string;
          progress: number;
        }[];
      }
    },
    []
  );

  return {
    technologies,
    loading,
    error,
    getTechnology,
    getTechnologiesByProject,
    searchTechnologies,
    refreshTechnologies: loadTechnologies,
    clearError: () => setError(null),
    fetchRelatedProjectsForTechnology,
  };
}
