'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  User,
  Mail,
  GraduationCap,
  Target,
  Users,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth as useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseResearchers } from '@/hooks/useSupabaseResearchers';

// Usar la interfaz de Supabase directamente
import type { SupabaseResearcher } from '@/hooks/useSupabaseResearchers';

type Researcher = SupabaseResearcher;
import { useProjects } from '@/contexts/ProjectContext';
import Header from '@/components/Header';

export default function ResearchersPage() {
  const { user: sbUser, profile } = useSupabaseAuth();
  const isAuthenticated = !!sbUser;
  const user = { role: profile?.role } as { role?: string };
  const {
    researchers,
    // createResearcher: addResearcher,  // Commented out for build
    // updateResearcher,  // Commented out for build
    deleteResearcher,
    filterResearchers,
    loading: isLoading,
  } = useSupabaseResearchers();

  // Función de búsqueda simulada
  const searchResearchers = useCallback(
    (query: string) => {
      return filterResearchers({ search: query });
    },
    [filterResearchers]
  );

  // Funciones de filtro auxiliares
  const filterByStatus = useCallback(
    (status: string) => {
      return researchers.filter((researcher) => researcher.status === status);
    },
    [researchers]
  );

  const filterByAcademicLevel = useCallback(
    (level: string) => {
      return researchers.filter(
        (researcher) => researcher.academic_level === level
      );
    },
    [researchers]
  );

  // Calcular departamentos únicos
  const departments = useMemo(() => {
    return [
      ...new Set(researchers.map((researcher) => researcher.department)),
    ].filter(Boolean);
  }, [researchers]);

  const { projects } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    Researcher['status'] | ''
  >('');
  const [selectedLevel, setSelectedLevel] = useState<
    Researcher['academic_level'] | ''
  >('');
  // Modal states commented out for build
  // const [showAddModal, setShowAddModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [showViewModal, setShowViewModal] = useState(false);
  // const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [filteredResearchers, setFilteredResearchers] =
    useState<Researcher[]>(researchers);

  useEffect(() => {
    let result = researchers;

    if (searchQuery) {
      result = searchResearchers(searchQuery);
    }

    if (selectedDepartment) {
      result = result.filter(
        (researcher) => researcher.department === selectedDepartment
      );
    }

    if (selectedStatus) {
      result = result.filter(
        (researcher) => researcher.status === selectedStatus
      );
    }

    if (selectedLevel) {
      result = result.filter(
        (researcher) => researcher.academic_level === selectedLevel
      );
    }

    setFilteredResearchers(result);
  }, [
    searchQuery,
    selectedDepartment,
    selectedStatus,
    selectedLevel,
    researchers,
    searchResearchers,
  ]);

  const statuses: Researcher['status'][] = [
    'active',
    'inactive',
    'alumni',
    'visiting',
  ];
  const academicLevels: Researcher['academic_level'][] = [
    'undergraduate',
    'bachelor',
    'master',
    'phd',
    'postdoc',
    'professor',
  ];

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const getStatusColor = (status: Researcher['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'alumni':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'visiting':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const getAcademicLevelColor = (level: Researcher['academic_level']) => {
    switch (level) {
      case 'undergraduate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'bachelor':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'master':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'phd':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'postdoc':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'professor':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const statusLabels = {
    active: 'Activo',
    inactive: 'Inactivo',
    alumni: 'Alumni',
    visiting: 'Visitante',
  };

  const academicLevelLabels = {
    undergraduate: 'Pregrado',
    bachelor: 'Licenciado',
    master: 'Magíster',
    phd: 'Doctor',
    postdoc: 'Postdoc',
    professor: 'Profesor',
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.title : `Proyecto ${projectId}`;
  };

  return (
    <div className="min-h-screen bg-theme-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-2">
            {isAdmin
              ? 'Gestión de Investigadores y Trabajadores'
              : 'Equipo del Tech Lab'}
          </h1>
          <p className="text-theme-secondary">
            {isAuthenticated
              ? isAdmin
                ? 'Administra el equipo de investigadores y trabajadores del laboratorio'
                : 'Conoce al equipo de investigación y desarrollo del Tech Lab'
              : 'Descubre el talento humano detrás de la innovación del Tech Lab'}
          </p>

          {/* Mensaje para usuarios no autenticados */}
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Directorio Público:</strong> Explora los perfiles de
                nuestro equipo de investigación.
                <a href="/login" className="ml-1 underline hover:text-blue-300">
                  Inicia sesión
                </a>{' '}
                para acceder a información de contacto completa.
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
                  placeholder="Buscar investigadores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todos los departamentos</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as Researcher['status'] | '')
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
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(
                    e.target.value as Researcher['academic_level'] | ''
                  )
                }
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todos los niveles</option>
                {academicLevels.map((level) => (
                  <option key={level} value={level}>
                    {academicLevelLabels[level]}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Agregar - Solo para administradores */}
            {isAdmin && (
              <button
                onClick={() => alert('Funcionalidad de agregar investigador próximamente')}
                className="flex items-center gap-2 bg-gradient-to-r from-neon-pink to-bright-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Nuevo Investigador
              </button>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-text">
                {researchers.length}
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
              <div className="text-2xl font-bold text-purple-400">
                {filterByAcademicLevel('phd').length +
                  filterByAcademicLevel('professor').length}
              </div>
              <div className="text-sm text-theme-secondary">PhD+</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {departments.length}
              </div>
              <div className="text-sm text-theme-secondary">Departamentos</div>
            </div>
          </div>
        </div>

        {/* Grid de Investigadores */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResearchers.map((researcher) => (
            <div
              key={researcher.id}
              className="bg-theme-card border border-theme-border rounded-lg p-6 hover:border-theme-accent/50 transition-colors"
            >
              {/* Cabecera del Perfil */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  {researcher.avatar_url ? (
                    <Image
                      src={researcher.avatar_url}
                      alt={researcher.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-theme-accent/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-theme-accent" />
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs border ${getStatusColor(researcher.status)}`}
                  >
                    {statusLabels[researcher.status]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/researchers/${researcher.id}`}
                    className="text-lg font-bold text-theme-text hover:text-theme-accent truncate transition-colors"
                  >
                    {researcher.name}
                  </Link>
                  <p className="text-theme-secondary text-sm mb-1">
                    {researcher.position}
                  </p>
                  <p className="text-theme-secondary text-xs">
                    {researcher.department}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs border mt-2 ${getAcademicLevelColor(researcher.academic_level)}`}
                  >
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {academicLevelLabels[researcher.academic_level]}
                  </span>
                </div>
              </div>

              {/* Especializaciones */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {researcher.specializations.slice(0, 3).map((spec, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-theme-accent/10 text-theme-accent rounded-md text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                  {researcher.specializations.length > 3 && (
                    <span className="px-2 py-1 bg-theme-secondary/10 text-theme-secondary rounded-md text-xs">
                      +{researcher.specializations.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div>
                  <div className="text-sm font-bold text-theme-text">
                    {researcher.projects_completed}
                  </div>
                  <div className="text-xs text-theme-secondary">Proyectos</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-theme-text">
                    {researcher.publications_count}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    Publicaciones
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-theme-text">
                    {researcher.years_experience}
                  </div>
                  <div className="text-xs text-theme-secondary">Años Exp.</div>
                </div>
              </div>

              {/* Proyectos Actuales */}
              {researcher.current_projects &&
                researcher.current_projects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-theme-secondary mb-2">
                      Proyectos Actuales:
                    </p>
                    <div className="space-y-1">
                      {researcher.current_projects
                        .slice(0, 2)
                        .map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center gap-2"
                          >
                            <Target className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-theme-text truncate">
                              {project.title}
                            </span>
                          </div>
                        ))}
                      {researcher.current_projects.length > 2 && (
                        <p className="text-xs text-theme-secondary">
                          +{researcher.current_projects.length - 2} más
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {/* Botones de Acción */}
              <div className="flex items-center justify-between pt-4 border-t border-theme-border">
                <div className="flex gap-2">
                  {/* Botón Ver Página Completa - Todos los usuarios */}
                  <Link
                    href={`/researchers/${researcher.id}`}
                    className="p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                    title="Ver página completa del perfil"
                  >
                    <User className="w-4 h-4" />
                  </Link>

                  {/* Botón Ver Modal - Todos los usuarios */}
                  <button
                    onClick={() => alert('Vista detallada próximamente')}
                    className="p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                    title="Vista rápida del perfil"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Enlaces externos - Solo usuarios autenticados */}
                  {isAuthenticated && researcher.email && (
                    <a
                      href={`mailto:${researcher.email}`}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Enviar email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}

                  {/* LinkedIn link temporarily disabled for build 
                  {isAuthenticated && researcher.linkedIn && (
                    <a
                      href={researcher.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Ver LinkedIn"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  */}
                </div>

                {/* Botones Admin */}
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert('Edición próximamente')}
                      className="p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteResearcher(researcher.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredResearchers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-theme-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-theme-text mb-2">
                No se encontraron investigadores
              </h3>
              <p className="text-theme-secondary">
                {searchQuery ||
                selectedDepartment ||
                selectedStatus ||
                selectedLevel
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Agrega el primer investigador al directorio'}
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
        {/* Temporarily disabled for build 
        <AddResearcherModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={(researcherData) => {
            addResearcher(researcherData);
            setShowAddModal(false);
          }}
        />
        */}

        {/* Temporarily disabled for build 
        <EditResearcherModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedResearcher(null);
          }}
          onEdit={(researcher) => {
            updateResearcher(researcher.id, researcher);
            setShowEditModal(false);
            setSelectedResearcher(null);
          }}
          researcher={selectedResearcher}
        />

        <ViewResearcherModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedResearcher(null);
          }}
          researcher={selectedResearcher}
        />
        */}
      </main>
    </div>
  );
}
