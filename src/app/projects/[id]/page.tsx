'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  DollarSign,
  Play,
  Pause,
  CheckCircle,
  Clock,
  FolderOpen,
  User,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProjects, TechProject } from '@/contexts/ProjectContext';
import { useResearchers } from '@/contexts/ResearcherContext';
import Header from '@/components/Header';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, isLoading } = useProjects();
  const { researchers } = useResearchers();

  const [project, setProject] = useState<TechProject | null>(null);

  const projectId = params.id as string;

  // Encontrar el proyecto por ID
  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const foundProject = projects.find((p) => p.id === projectId);
      setProject(foundProject || null);
    }
  }, [projects, projectId]);

  // Obtener investigadores del proyecto
  const projectResearchers = researchers.filter(
    (researcher) =>
      researcher.currentProjects.includes(projectId) ||
      researcher.pastProjects.includes(projectId)
  );

  // Etiquetas de estado
  const statusLabels = {
    planning: 'Planificación',
    active: 'En Progreso',
    paused: 'Pausado',
    completed: 'Completado',
  };

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica',
  };

  // Colores para estados
  const getStatusColor = (status: TechProject['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'planning':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'completed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: TechProject['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: TechProject['status']) => {
    switch (status) {
      case 'active':
        return <Play className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'planning':
        return <Clock className="w-3 h-3" />;
      default:
        return <FolderOpen className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-theme-text">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-theme-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 text-theme-secondary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-theme-text mb-2">
              Proyecto no encontrado
            </h1>
            <p className="text-theme-secondary mb-6">
              No se pudo encontrar el proyecto solicitado.
            </p>
            <button
              onClick={() => router.push('/projects')}
              className="flex items-center gap-2 bg-gradient-to-r from-neon-pink to-bright-blue text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Proyectos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Navegación de regreso */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Proyectos
          </button>
        </div>

        {/* Cabecera del Proyecto */}
        <div className="bg-theme-card rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <FolderOpen className="w-8 h-8 text-theme-accent" />
                <div>
                  <h1 className="text-3xl font-bold text-theme-text">
                    {project.title}
                  </h1>
                  <p className="text-theme-secondary">{project.category}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(project.status)}`}
                >
                  {getStatusIcon(project.status)}
                  {statusLabels[project.status]}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getPriorityColor(project.priority)}`}
                >
                  {priorityLabels[project.priority]}
                </span>
              </div>

              <p className="text-theme-secondary text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="ml-8">
              <div className="text-center p-6 bg-theme-background rounded-lg">
                <div className="text-4xl font-bold text-theme-text mb-2">
                  {project.progress}%
                </div>
                <div className="text-sm text-theme-secondary">Completado</div>
                <div className="w-24 bg-theme-border rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-neon-pink to-bright-blue h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Proyecto */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-theme-background p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-theme-accent" />
                <span className="text-sm font-medium text-theme-text">
                  Inicio
                </span>
              </div>
              <div className="text-theme-secondary">
                {new Date(project.startDate).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-theme-background p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-theme-accent" />
                <span className="text-sm font-medium text-theme-text">
                  Líder
                </span>
              </div>
              <div className="text-theme-secondary">{project.teamLead}</div>
            </div>

            <div className="bg-theme-background p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-theme-accent" />
                <span className="text-sm font-medium text-theme-text">
                  Presupuesto
                </span>
              </div>
              <div className="text-theme-secondary">
                ${project.budget?.toLocaleString()}
              </div>
            </div>

            <div className="bg-theme-background p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-theme-accent" />
                <span className="text-sm font-medium text-theme-text">
                  Objetivos
                </span>
              </div>
              <div className="text-theme-secondary">
                {project.objectives?.length || 0} metas
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Objetivos */}
            {project.objectives && project.objectives.length > 0 && (
              <div className="bg-theme-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivos del Proyecto
                </h2>
                <ul className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-theme-accent rounded-full mt-2"></div>
                      <span className="text-theme-secondary">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tecnologías */}
            <div className="bg-theme-card rounded-lg p-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4">
                Tecnologías Utilizadas
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-theme-accent/10 text-theme-accent rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Desafíos */}
            {project.challenges && project.challenges.length > 0 && (
              <div className="bg-theme-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-theme-text mb-4">
                  Desafíos
                </h2>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <span className="text-theme-secondary">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Equipo de Trabajo */}
            <div className="bg-theme-card rounded-lg p-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Equipo ({projectResearchers.length})
              </h2>
              {projectResearchers.length > 0 ? (
                <div className="space-y-4">
                  {projectResearchers.map((researcher) => {
                    const role =
                      researcher.projectRoles[projectId] || 'Participante';
                    return (
                      <Link
                        key={researcher.id}
                        href={`/researchers/${researcher.id}`}
                        className="flex items-center gap-3 p-3 bg-theme-background rounded-lg hover:bg-theme-accent/5 transition-colors"
                      >
                        {researcher.avatar ? (
                          <Image
                            src={researcher.avatar}
                            alt={researcher.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-theme-accent/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-theme-accent" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-theme-text">
                            {researcher.name}
                          </h3>
                          <p className="text-sm text-theme-secondary">{role}</p>
                          <p className="text-xs text-theme-secondary">
                            {researcher.position}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-theme-secondary" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-theme-secondary text-sm">
                  No hay investigadores asignados
                </p>
              )}
            </div>

            {/* Miembros del Equipo (si existen) */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="bg-theme-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-theme-text mb-4">
                  Otros Miembros
                </h2>
                <ul className="space-y-2">
                  {project.teamMembers.map((member, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <User className="w-4 h-4 text-theme-secondary" />
                      <span className="text-theme-secondary">{member}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
