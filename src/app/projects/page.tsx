'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Filter,
  FolderOpen,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Eye,
  ExternalLink,
  GitBranch,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects, TechProject } from '@/contexts/ProjectContext';
import { useTechnologies } from '@/hooks/useTechnologies';
import Header from '@/components/Header';
import { AddProjectModal, ViewProjectModal } from '@/components/ProjectModals';

export default function ProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    searchProjects,
    filterByCategory,
    filterByStatus,
    filterByPriority,
    isLoading,
  } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    TechProject['status'] | ''
  >('');
  const [selectedPriority, setSelectedPriority] = useState<
    TechProject['priority'] | ''
  >('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TechProject | null>(
    null
  );
  const [filteredProjects, setFilteredProjects] =
    useState<TechProject[]>(projects);

  // Permitir acceso sin autenticación pero con funcionalidades limitadas
  // No redirigir automáticamente al login

  useEffect(() => {
    let result = projects;

    if (searchQuery) {
      result = searchProjects(searchQuery);
    }

    if (selectedCategory) {
      result = result.filter(
        (project) => project.category === selectedCategory
      );
    }

    if (selectedStatus) {
      result = result.filter((project) => project.status === selectedStatus);
    }

    if (selectedPriority) {
      result = result.filter(
        (project) => project.priority === selectedPriority
      );
    }

    setFilteredProjects(result);
  }, [
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedPriority,
    projects,
    searchProjects,
  ]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Verificando autenticación...</div>
      </div>
    );
  }

  const categories = [...new Set(projects.map((project) => project.category))];
  const statuses: TechProject['status'][] = [
    'active',
    'completed',
    'paused',
    'planning',
  ];
  const priorities: TechProject['priority'][] = [
    'low',
    'medium',
    'high',
    'critical',
  ];

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const getStatusIcon = (status: TechProject['status']) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'planning':
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TechProject['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'planning':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: TechProject['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const statusLabels = {
    active: 'Activo',
    completed: 'Completado',
    paused: 'Pausado',
    planning: 'Planificación',
  };

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica',
  };

  return (
    <div className="min-h-screen bg-theme-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-2">
            {isAdmin
              ? 'Gestión de Proyectos Tecnológicos'
              : 'Proyectos del Tech Lab'}
          </h1>
          <p className="text-theme-secondary">
            {isAuthenticated
              ? isAdmin
                ? 'Administra y crea nuevos proyectos de innovación tecnológica'
                : 'Explora los proyectos de investigación y desarrollo en curso'
              : 'Descubre los proyectos de investigación y desarrollo del Tech Lab'}
          </p>

          {/* Mensaje para usuarios no autenticados */}
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Modo Público:</strong> Estás viendo los proyectos en
                modo de solo lectura.
                <a href="/login" className="ml-1 underline hover:text-blue-300">
                  Inicia sesión
                </a>{' '}
                para acceder a funciones avanzadas.
              </p>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="bg-theme-card rounded-lg p-6 border border-theme-border mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value as TechProject['status'] | ''
                  )
                }
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todos los estados</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(
                    e.target.value as TechProject['priority'] | ''
                  )
                }
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todas las prioridades</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabels[priority]}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Agregar - Solo para administradores */}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-neon-pink to-bright-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Nuevo Proyecto
              </button>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-text">
                {projects.length}
              </div>
              <div className="text-sm text-theme-secondary">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {filterByStatus('active').length}
              </div>
              <div className="text-sm text-theme-secondary">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {filterByStatus('completed').length}
              </div>
              <div className="text-sm text-theme-secondary">Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filterByStatus('planning').length}
              </div>
              <div className="text-sm text-theme-secondary">
                En Planificación
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Proyectos */}
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-theme-card border border-theme-border rounded-lg p-6 hover:border-theme-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderOpen className="w-5 h-5 text-theme-accent" />
                    <h3 className="text-xl font-bold text-theme-text">
                      {project.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}
                    >
                      {getStatusIcon(project.status)}
                      {statusLabels[project.status]}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getPriorityColor(project.priority)}`}
                    >
                      {priorityLabels[project.priority]}
                    </span>
                  </div>
                  <p className="text-theme-secondary mb-4">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-theme-secondary" />
                      <div>
                        <span className="text-xs text-theme-secondary">
                          Team Lead:
                        </span>
                        <div className="text-sm font-medium text-theme-text">
                          {project.teamLead}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-theme-secondary" />
                      <div>
                        <span className="text-xs text-theme-secondary">
                          Inicio:
                        </span>
                        <div className="text-sm font-medium text-theme-text">
                          {new Date(project.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-theme-secondary" />
                      <div>
                        <span className="text-xs text-theme-secondary">
                          Progreso:
                        </span>
                        <div className="text-sm font-medium text-theme-text">
                          {project.progress}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-theme-secondary">
                        Progreso del Proyecto
                      </span>
                      <span className="text-xs text-theme-text">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-theme-background rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-neon-pink to-bright-blue h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tecnologías */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 5).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-theme-accent/10 text-theme-accent rounded-md text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="px-2 py-1 bg-theme-secondary/10 text-theme-secondary rounded-md text-xs">
                        +{project.technologies.length - 5} más
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Botón Ver - Todos los usuarios */}
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowViewModal(true);
                    }}
                    className="p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                    title="Ver modal"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Enlace a página individual */}
                  <Link
                    href={`/projects/${project.id}`}
                    className="p-2 text-theme-accent hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                    title="Ver detalles completos"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Enlaces externos */}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Ver demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Ver repositorio"
                    >
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}

                  {/* Botones Admin */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-theme-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-theme-text mb-2">
                No se encontraron proyectos
              </h3>
              <p className="text-theme-secondary">
                {searchQuery ||
                selectedCategory ||
                selectedStatus ||
                selectedPriority
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Crea tu primer proyecto tecnológico'}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="bg-theme-card rounded-lg p-6 text-center">
              <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-theme-text">Procesando...</p>
            </div>
          </div>
        )}

        {/* Modales */}
        {/* Modal Agregar - Solo para administradores */}
        {isAdmin && (
          <AddProjectModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={addProject}
          />
        )}

        <ViewProjectModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          project={selectedProject}
        />
      </main>
    </div>
  );
}
