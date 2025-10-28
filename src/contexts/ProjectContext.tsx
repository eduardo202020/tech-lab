'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

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
  ) => void;
  updateProject: (id: string, updates: Partial<TechProject>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => TechProject | undefined;
  searchProjects: (query: string) => TechProject[];
  filterByCategory: (category: string) => TechProject[];
  filterByStatus: (status: TechProject['status']) => TechProject[];
  filterByPriority: (priority: TechProject['priority']) => TechProject[];
  getProjectsByTechnology: (technologyId: string) => TechProject[];
  getTechnologiesForProject: (projectId: string) => string[];
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Proyectos de demostración
const INITIAL_PROJECTS: TechProject[] = [
  {
    id: '1',
    title: 'Smart Parking System',
    description:
      'Sistema inteligente de gestión de estacionamientos con sensores IoT y visualización en tiempo real',
    category: 'IoT & Smart Cities',
    technologies: [
      'React',
      'Node.js',
      'Arduino',
      'Sensores Ultrasónicos',
      'MongoDB',
      'WebSocket',
    ],
    relatedTechnologyIds: [
      'esp32',
      'ai',
      'image-recognition',
      'cloud-computing',
    ],
    status: 'active',
    priority: 'high',
    startDate: '2024-09-01',
    teamLead: 'Eduardo Guevara Lázaro',
    teamMembers: ['Ana García', 'Carlos López', 'María Rodríguez'],
    budget: 15000,
    progress: 85,
    objectives: [
      'Implementar sistema de detección de espacios libres',
      'Crear dashboard web en tiempo real',
      'Desarrollar app móvil para usuarios',
      'Integrar sistema de pagos digitales',
    ],
    challenges: [
      'Precisión de sensores en diferentes condiciones climáticas',
      'Optimización del consumo energético',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    repositoryUrl: 'https://github.com/techlab/smart-parking',
    documentation: 'Documentación completa disponible en el repositorio',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-12-20T15:30:00Z',
    createdBy: 'admin',
  },
  {
    id: '2',
    title: 'AI Image Recognition Lab',
    description:
      'Laboratorio de reconocimiento de imágenes usando deep learning para clasificación automática',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'TensorFlow', 'OpenCV', 'Flask', 'Docker', 'CUDA'],
    relatedTechnologyIds: [
      'ai',
      'image-recognition',
      'machine-learning',
      'cloud-computing',
    ],
    status: 'completed',
    priority: 'high',
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    teamLead: 'Dr. Ana Silva',
    teamMembers: ['Pedro Morales', 'Lucía Fernández', 'Roberto Chen'],
    budget: 25000,
    progress: 100,
    objectives: [
      'Desarrollar modelo CNN para clasificación de imágenes',
      'Crear API REST para procesamiento',
      'Implementar interfaz web de demostración',
      'Optimizar modelo para dispositivos móviles',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    repositoryUrl: 'https://github.com/techlab/ai-image-recognition',
    documentation: 'Paper publicado en conferencia internacional de AI',
    createdAt: '2024-06-01T08:00:00Z',
    updatedAt: '2024-11-30T17:45:00Z',
    createdBy: 'eduardo',
  },
  {
    id: '3',
    title: 'Blockchain Supply Chain',
    description:
      'Sistema de trazabilidad de cadena de suministro usando blockchain para garantizar autenticidad',
    category: 'Blockchain & Fintech',
    technologies: [
      'Solidity',
      'Web3.js',
      'React',
      'Ethereum',
      'IPFS',
      'Metamask',
    ],
    relatedTechnologyIds: ['blockchain', 'cloud-computing'],
    status: 'planning',
    priority: 'medium',
    startDate: '2025-01-15',
    teamLead: 'Carlos Blockchain',
    teamMembers: ['Sofia Crypto', 'Miguel Smart'],
    budget: 30000,
    progress: 15,
    objectives: [
      'Diseñar smart contracts para trazabilidad',
      'Crear interfaz web descentralizada',
      'Implementar sistema de tokens de recompensa',
      'Desarrollar scanner QR para productos',
    ],
    challenges: [
      'Costos de transacción en Ethereum',
      'Adopción por parte de proveedores tradicionales',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    repositoryUrl: 'https://github.com/techlab/blockchain-supply',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-20T11:20:00Z',
    createdBy: 'admin',
  },
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<TechProject[]>(INITIAL_PROJECTS);
  const [isLoading, setIsLoading] = useState(false);

  const addProject = useCallback(
    (newProject: Omit<TechProject, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setTimeout(() => {
        const id = Date.now().toString();
        const now = new Date().toISOString();
        setProjects((prev) => [
          ...prev,
          {
            ...newProject,
            id,
            createdAt: now,
            updatedAt: now,
          },
        ]);
        setIsLoading(false);
      }, 500);
    },
    []
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<TechProject>) => {
      setIsLoading(true);
      setTimeout(() => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          )
        );
        setIsLoading(false);
      }, 300);
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setProjects((prev) => prev.filter((project) => project.id !== id));
      setIsLoading(false);
    }, 200);
  }, []);

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
    isLoading,
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
