'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import {
  useProjectsData,
  ProjectRecord,
} from '@/hooks/useProjectsData';

// Interfaz legacy para mantener compatibilidad
export interface TechProject {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  relatedTechnologyIds: string[]; // IDs de tecnologías vinculadas
  status: 'active' | 'completed' | 'paused' | 'planning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate?: string;
  teamLead: string;
  teamMembers: string[];
  budget?: number;
  progress: number; // 0-100
  objectives: string[];
  challenges?: string[];
  gallery: string[]; // URLs de imágenes
  demoUrl?: string;
  repositoryUrl?: string;
  documentation?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ProjectContextType {
  projects: TechProject[];
  addProject: (
    project: Omit<TechProject, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<boolean>;
  updateProject: (
    id: string,
    updates: Partial<TechProject>
  ) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  getProject: (id: string) => TechProject | undefined;
  searchProjects: (query: string) => TechProject[];
  filterByCategory: (category: string) => TechProject[];
  filterByStatus: (status: TechProject['status']) => TechProject[];
  filterByPriority: (priority: TechProject['priority']) => TechProject[];
  getProjectsByTechnology: (technologyId: string) => TechProject[];
  getTechnologiesForProject: (projectId: string) => string[];
  isLoading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
}

// Función para convertir ProjectRecord a TechProject
function convertProjectRecordToLegacy(
  projectRecord: ProjectRecord
): TechProject {
  return {
    id: projectRecord.id,
    title: projectRecord.title,
    description: projectRecord.description,
    category: projectRecord.category,
    technologies: projectRecord.technologies,
    relatedTechnologyIds: projectRecord.related_technology_ids,
    status: projectRecord.status,
    priority: projectRecord.priority,
    startDate: projectRecord.start_date,
    endDate: projectRecord.end_date,
    teamLead: projectRecord.team_lead,
    teamMembers: projectRecord.team_members,
    budget: projectRecord.budget,
    progress: projectRecord.progress,
    objectives: projectRecord.objectives,
    challenges: projectRecord.challenges,
    gallery: projectRecord.gallery,
    demoUrl: projectRecord.demo_url,
    repositoryUrl: projectRecord.repository_url,
    documentation: projectRecord.documentation,
    createdAt: projectRecord.created_at,
    updatedAt: projectRecord.updated_at,
    createdBy: projectRecord.created_by || 'unknown',
  };
}

// Función para convertir TechProject a datos de almacenamiento
function convertLegacyProjectToRecord(
  legacyProject: Omit<TechProject, 'id' | 'createdAt' | 'updatedAt'>
): Omit<
  ProjectRecord,
  'id' | 'created_at' | 'updated_at' | 'researchers' | 'related_technologies'
> {
  return {
    title: legacyProject.title,
    description: legacyProject.description,
    category: legacyProject.category,
    technologies: legacyProject.technologies,
    related_technology_ids: legacyProject.relatedTechnologyIds,
    status: legacyProject.status,
    priority: legacyProject.priority,
    start_date: legacyProject.startDate,
    end_date: legacyProject.endDate,
    team_lead: legacyProject.teamLead,
    team_members: legacyProject.teamMembers,
    budget: legacyProject.budget,
    progress: legacyProject.progress,
    objectives: legacyProject.objectives,
    challenges: legacyProject.challenges || [],
    gallery: legacyProject.gallery,
    demo_url: legacyProject.demoUrl,
    repository_url: legacyProject.repositoryUrl,
    documentation: legacyProject.documentation,
    created_by: legacyProject.createdBy,
  };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const {
    projects: projectRecords,
    loading,
    error,
    createProject,
    updateProject: updateProjectRecord,
    deleteProject: deleteProjectRecord,
    fetchProjects,
  } = useProjectsData({ autoFetch: true });

  // Convertir proyectos del API al formato legacy
  const projects = useMemo(() => {
    return projectRecords.map(convertProjectRecordToLegacy);
  }, [projectRecords]);

  const addProject = useCallback(
    async (
      newProject: Omit<TechProject, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<boolean> => {
      try {
        const projectData = convertLegacyProjectToRecord(newProject);
        const result = await createProject(projectData);
        return result !== null;
      } catch (err) {
        console.error('Error adding project:', err);
        return false;
      }
    },
    [createProject]
  );

  const updateProject = useCallback(
    async (id: string, updates: Partial<TechProject>): Promise<boolean> => {
      try {
        // Convertir updates al formato de almacenamiento
        const projectUpdates: Partial<ProjectRecord> = {};

        if (updates.title) projectUpdates.title = updates.title;
        if (updates.description)
          projectUpdates.description = updates.description;
        if (updates.category) projectUpdates.category = updates.category;
        if (updates.technologies)
          projectUpdates.technologies = updates.technologies;
        if (updates.relatedTechnologyIds)
          projectUpdates.related_technology_ids = updates.relatedTechnologyIds;
        if (updates.status) projectUpdates.status = updates.status;
        if (updates.priority) projectUpdates.priority = updates.priority;
        if (updates.startDate) projectUpdates.start_date = updates.startDate;
        if (updates.endDate) projectUpdates.end_date = updates.endDate;
        if (updates.teamLead) projectUpdates.team_lead = updates.teamLead;
        if (updates.teamMembers)
          projectUpdates.team_members = updates.teamMembers;
        if (updates.budget !== undefined)
          projectUpdates.budget = updates.budget;
        if (updates.progress !== undefined)
          projectUpdates.progress = updates.progress;
        if (updates.objectives) projectUpdates.objectives = updates.objectives;
        if (updates.challenges) projectUpdates.challenges = updates.challenges;
        if (updates.gallery) projectUpdates.gallery = updates.gallery;
        if (updates.demoUrl) projectUpdates.demo_url = updates.demoUrl;
        if (updates.repositoryUrl)
          projectUpdates.repository_url = updates.repositoryUrl;
        if (updates.documentation)
          projectUpdates.documentation = updates.documentation;

        const result = await updateProjectRecord(id, projectUpdates);
        return result !== null;
      } catch (err) {
        console.error('Error updating project:', err);
        return false;
      }
    },
    [updateProjectRecord]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        return await deleteProjectRecord(id);
      } catch (err) {
        console.error('Error deleting project:', err);
        return false;
      }
    },
    [deleteProjectRecord]
  );

  const getProject = useCallback(
    (id: string) => {
      return projects.find((project) => project.id === id);
    },
    [projects]
  );

  const searchProjects = useCallback(
    (query: string) => {
      if (!query.trim()) return projects;

      const lowerQuery = query.toLowerCase();
      return projects.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerQuery) ||
          project.description.toLowerCase().includes(lowerQuery) ||
          project.category.toLowerCase().includes(lowerQuery) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(lowerQuery)
          ) ||
          project.teamLead.toLowerCase().includes(lowerQuery)
      );
    },
    [projects]
  );

  const filterByCategory = useCallback(
    (category: string) => {
      if (!category) return projects;
      return projects.filter((project) => project.category === category);
    },
    [projects]
  );

  const filterByStatus = useCallback(
    (status: TechProject['status']) => {
      return projects.filter((project) => project.status === status);
    },
    [projects]
  );

  const filterByPriority = useCallback(
    (priority: TechProject['priority']) => {
      return projects.filter((project) => project.priority === priority);
    },
    [projects]
  );

  const getProjectsByTechnology = useCallback(
    (technologyId: string) => {
      return projects.filter((project) =>
        project.relatedTechnologyIds.includes(technologyId)
      );
    },
    [projects]
  );

  const getTechnologiesForProject = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      return project ? project.relatedTechnologyIds : [];
    },
    [projects]
  );

  const value: ProjectContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    searchProjects,
    filterByCategory,
    filterByStatus,
    filterByPriority,
    getProjectsByTechnology,
    getTechnologiesForProject,
    isLoading: loading,
    error,
    refreshProjects: fetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
