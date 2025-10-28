'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  TrendingUp,
  ExternalLink,
  GitBranch,
  FileText,
  Monitor,
} from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import RelatedTechnologies from '@/components/RelatedTechnologies';
import SmartParkingViewer from '@/components/SmartParkingViewer';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { getProject } = useProjects();

  const project = getProject(projectId);

  if (!project) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-500/20';
      case 'active':
        return 'text-blue-500 bg-blue-500/20';
      case 'paused':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'planning':
        return 'text-purple-500 bg-purple-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500 bg-red-500/20';
      case 'high':
        return 'text-orange-500 bg-orange-500/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'low':
        return 'text-green-500 bg-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Header */}
      <header className="bg-theme-card border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver a Proyectos</span>
            </Link>
            <div className="text-sm text-theme-secondary">
              TechLab • {project.category}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-theme-text mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-theme-secondary mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Status y Priority */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
                >
                  {project.status.charAt(0).toUpperCase() +
                    project.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}
                >
                  Prioridad{' '}
                  {project.priority.charAt(0).toUpperCase() +
                    project.priority.slice(1)}
                </span>
                <div className="flex items-center gap-2 text-theme-secondary">
                  <TrendingUp size={16} />
                  <span className="text-sm">
                    {project.progress}% completado
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-theme-border"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - project.progress / 100)}`}
                    className="text-theme-accent transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-theme-text">
                    {project.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Objetivos */}
            <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
              <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
                <Target className="text-theme-accent" size={24} />
                Objetivos del Proyecto
              </h2>
              <ul className="space-y-3">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-theme-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-theme-accent"></div>
                    </div>
                    <span className="text-theme-secondary">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Simulación 3D - Solo para Smart Parking System */}
            {project.id === '1' && (
              <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
                <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
                  <Monitor className="text-theme-accent" size={24} />
                  Simulación 3D en Tiempo Real
                </h2>
                <p className="text-theme-secondary mb-6">
                  Visualización interactiva del sistema de estacionamiento inteligente que muestra 
                  la ocupación de espacios en tiempo real utilizando tecnología IoT y sensores.
                </p>
                <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
                  <SmartParkingViewer />
                </div>
                <div className="mt-4 text-sm text-theme-secondary">
                  <p>
                    <strong>Características de la simulación:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>12 espacios de estacionamiento (A0-A11)</li>
                    <li>Estado de ocupación en tiempo real</li>
                    <li>Visualización 3D interactiva</li>
                    <li>Colores diferenciados por disponibilidad</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tecnologías Vinculadas */}
            <RelatedTechnologies projectId={projectId} />

            {/* Desafíos */}
            {project.challenges && project.challenges.length > 0 && (
              <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
                <h2 className="text-xl font-bold text-theme-text mb-4">
                  Desafíos y Consideraciones
                </h2>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      </div>
                      <span className="text-theme-secondary">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del Proyecto */}
            <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
              <h3 className="text-lg font-bold text-theme-text mb-4">
                Información del Proyecto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar
                    className="text-theme-accent flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <div className="text-sm text-theme-secondary">Inicio</div>
                    <div className="text-theme-text font-medium">
                      {new Date(project.startDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                {project.endDate && (
                  <div className="flex items-center gap-3">
                    <Calendar
                      className="text-theme-accent flex-shrink-0"
                      size={18}
                    />
                    <div>
                      <div className="text-sm text-theme-secondary">
                        Finalización
                      </div>
                      <div className="text-theme-text font-medium">
                        {new Date(project.endDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Users
                    className="text-theme-accent flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <div className="text-sm text-theme-secondary">
                      Líder del Equipo
                    </div>
                    <div className="text-theme-text font-medium">
                      {project.teamLead}
                    </div>
                  </div>
                </div>

                {project.budget && (
                  <div className="flex items-center gap-3">
                    <Target
                      className="text-theme-accent flex-shrink-0"
                      size={18}
                    />
                    <div>
                      <div className="text-sm text-theme-secondary">
                        Presupuesto
                      </div>
                      <div className="text-theme-text font-medium">
                        ${project.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Equipo */}
            <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
              <h3 className="text-lg font-bold text-theme-text mb-4 flex items-center gap-2">
                <Users className="text-theme-accent" size={20} />
                Equipo de Trabajo
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-theme-accent/10 rounded-lg">
                  <div className="font-medium text-theme-text">
                    {project.teamLead}
                  </div>
                  <div className="text-sm text-theme-secondary">
                    Líder del Proyecto
                  </div>
                </div>
                {project.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="p-3 bg-theme-background rounded-lg"
                  >
                    <div className="font-medium text-theme-text">{member}</div>
                    <div className="text-sm text-theme-secondary">
                      Miembro del Equipo
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tecnologías Utilizadas */}
            <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
              <h3 className="text-lg font-bold text-theme-text mb-4">
                Tecnologías Utilizadas
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-theme-accent/20 text-theme-accent rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Enlaces */}
            <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
              <h3 className="text-lg font-bold text-theme-text mb-4">
                Enlaces del Proyecto
              </h3>
              <div className="space-y-3">
                {project.demoUrl && (
                  <Link
                    href={project.demoUrl}
                    className="flex items-center gap-2 p-3 bg-theme-background rounded-lg hover:bg-theme-accent/10 transition-colors group"
                  >
                    <ExternalLink
                      className="text-theme-accent group-hover:text-theme-text"
                      size={18}
                    />
                    <span className="text-theme-text group-hover:text-theme-accent">
                      Ver Demo
                    </span>
                  </Link>
                )}

                {project.repositoryUrl && (
                  <Link
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-theme-background rounded-lg hover:bg-theme-accent/10 transition-colors group"
                  >
                    <GitBranch
                      className="text-theme-accent group-hover:text-theme-text"
                      size={18}
                    />
                    <span className="text-theme-text group-hover:text-theme-accent">
                      Repositorio
                    </span>
                  </Link>
                )}

                {project.documentation && (
                  <div className="flex items-start gap-2 p-3 bg-theme-background rounded-lg">
                    <FileText
                      className="text-theme-accent flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <div className="text-theme-text font-medium">
                        Documentación
                      </div>
                      <div className="text-sm text-theme-secondary">
                        {project.documentation}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
