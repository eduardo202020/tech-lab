'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProjects, TechProject } from '../contexts/ProjectContext';

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

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const { projects, getProjectsByTechnology } = useProjects();

  const loadTechnologies = useCallback(async () => {
    try {
      const response = await fetch('/data/technologies.json');
      const data = await response.json();
      
      // Enriquecer tecnologías con proyectos reales
      const enrichedTechnologies = data.technologies.map((tech: Technology) => {
        const relatedProjects = getProjectsByTechnology(tech.id);
        
        return {
          ...tech,
          relatedProjects: relatedProjects.map((project: TechProject) => ({
            id: project.id,
            title: project.title,
            status: project.status,
            progress: project.progress
          }))
        };
      });
      
      setTechnologies(enrichedTechnologies);
    } catch (error) {
      console.error('Error loading technologies:', error);
      setTechnologies([]);
    } finally {
      setLoading(false);
    }
  }, [getProjectsByTechnology]);

  useEffect(() => {
    loadTechnologies();
  }, [loadTechnologies, projects]); // Recargar cuando cambien los proyectos

  const getTechnology = useCallback(
    (id: string) => {
      return technologies.find(tech => tech.id === id);
    },
    [technologies]
  );

  const getTechnologiesByProject = useCallback(
    (projectId: string) => {
      return technologies.filter(tech => 
        tech.relatedProjects?.some(proj => proj.id === projectId)
      );
    },
    [technologies]
  );

  const searchTechnologies = useCallback(
    (query: string) => {
      if (!query.trim()) return technologies;

      const lowerQuery = query.toLowerCase();
      return technologies.filter(tech =>
        tech.name.toLowerCase().includes(lowerQuery) ||
        tech.description.toLowerCase().includes(lowerQuery) ||
        tech.about.content.some(content => 
          content.toLowerCase().includes(lowerQuery)
        )
      );
    },
    [technologies]
  );

  return {
    technologies,
    loading,
    getTechnology,
    getTechnologiesByProject,
    searchTechnologies,
    refreshTechnologies: loadTechnologies
  };
}