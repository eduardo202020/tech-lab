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
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth as useAuthSession } from '@/contexts/SessionAuthContext';
import { useResearchers } from '@/hooks/useResearchers';

// Usar la interfaz del registro de investigadores
import type { ResearcherRecord } from '@/hooks/useResearchers';

type Researcher = ResearcherRecord;
import { useProjects } from '@/contexts/ProjectContext';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import { useRef } from 'react';

export default function ResearchersPage() {
  const { user: sbUser, profile } = useAuthSession();
  const isAuthenticated = !!sbUser;
  const user = { role: profile?.role } as { role?: string };
  const {
    researchers,
    // createResearcher: addResearcher,  // Commented out for build
    // updateResearcher,  // Commented out for build
    deleteResearcher,
    filterResearchers,
    loading: isLoading,
    fetchResearchers,
  } = useResearchers({ autoFetch: false });

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

  const getResearcherProjects = useCallback(
    (researcher: Researcher) => {
      return [
        ...(researcher.current_projects || []),
        ...((researcher.past_projects || []).map((project) => ({
          ...project,
          progress: 0,
        })) as Array<{
          id: string;
          title: string;
          role: string;
          status: string;
          progress: number;
        }>),
      ].filter(
        (project, index, array) =>
          array.findIndex((item) => item.id === project.id) === index
      );
    },
    []
  );

  const projectOptions = useMemo(() => {
    const allProjects = researchers.flatMap((researcher) =>
      getResearcherProjects(researcher)
    );

    return allProjects
      .filter(
        (project, index, array) =>
          array.findIndex((item) => item.id === project.id) === index
      )
      .sort((a, b) => a.title.localeCompare(b.title, 'es'));
  }, [researchers, getResearcherProjects]);

  const { projects } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    Researcher['status'] | ''
  >('');
  const [selectedProject, setSelectedProject] = useState('');
  const [showWhatsAppInfoModal, setShowWhatsAppInfoModal] = useState(false);
  const [whatsAppTargetName, setWhatsAppTargetName] = useState('');
  // Modal states commented out for build
  // const [showAddModal, setShowAddModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [showViewModal, setShowViewModal] = useState(false);
  // const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [filteredResearchers, setFilteredResearchers] =
    useState<Researcher[]>(researchers);
  const lastFetchKey = useRef<string | null>(null);

  useEffect(() => {
    let result = researchers;

    if (searchQuery) {
      result = searchResearchers(searchQuery);
    }

    if (selectedStatus) {
      result = result.filter(
        (researcher) => researcher.status === selectedStatus
      );
    }

    if (selectedProject) {
      result = result.filter((researcher) =>
        getResearcherProjects(researcher).some(
          (project) => project.id === selectedProject
        )
      );
    }

    setFilteredResearchers(result);
  }, [
    searchQuery,
    selectedStatus,
    selectedProject,
    researchers,
    searchResearchers,
    getResearcherProjects,
  ]);

  // Carga inicial controlada para evitar múltiples fetches (StrictMode / nuevas pestañas)
  useEffect(() => {
    const key = 'initial';
    if (lastFetchKey.current === key) return;
    lastFetchKey.current = key;
    fetchResearchers();
  }, [fetchResearchers]);

  const statuses: Researcher['status'][] = [
    'active',
    'inactive',
    'alumni',
    'visiting',
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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
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
        <div className="bg-theme-card rounded-lg p-4 sm:p-6 border border-theme-border mb-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full lg:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as Researcher['status'] | '')
                }
                className="w-full min-w-0 px-3 sm:px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text text-sm sm:text-base"
              >
                <option value="">Todos los estados</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>

              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full min-w-0 px-3 sm:px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text text-sm sm:text-base"
              >
                <option value="">Todos los proyectos</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Agregar - Solo para administradores */}
            {isAdmin && (
              <button
                onClick={() =>
                  alert('Funcionalidad de agregar investigador próximamente')
                }
                className="flex items-center justify-center gap-2 w-full lg:w-auto bg-gradient-to-r from-neon-pink to-bright-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
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
          {filteredResearchers.map((researcher) => {
            const displayedProjects = getResearcherProjects(researcher);
            const phoneDigits = (researcher.phone || '').replace(/\D/g, '');
            const whatsappMessage = encodeURIComponent(
              `Hola ${researcher.name}, te contacto desde la plataforma Tech Lab.`
            );
            const whatsappLink = phoneDigits
              ? `https://wa.me/${phoneDigits}?text=${whatsappMessage}`
              : '';

            return (
              <div
                key={researcher.id}
                className="group bg-theme-card border border-theme-border/40 rounded-2xl p-4 sm:p-5 hover:border-theme-accent/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
              >
                <div className="h-1.5 w-14 rounded-full bg-theme-accent/40 mb-4" />

                {/* Cabecera del Perfil */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative">
                    {researcher.avatar_url ? (
                      <Image
                        src={researcher.avatar_url}
                        alt={researcher.name}
                        width={60}
                        height={60}
                        className="w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full object-cover border-2 border-theme-border group-hover:border-theme-accent/50 transition-colors"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full bg-theme-accent/10 border-2 border-theme-border group-hover:border-theme-accent/50 flex items-center justify-center transition-colors">
                        <User className="w-6 h-6 sm:w-7 sm:h-7 text-theme-accent" />
                      </div>
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(researcher.status)}`}
                    >
                      {statusLabels[researcher.status]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/researchers/${researcher.id}`}
                      className="block text-lg sm:text-[22px] leading-tight font-bold text-theme-text hover:text-theme-accent truncate transition-colors"
                    >
                      {researcher.name}
                    </Link>
                    <p className="text-theme-secondary text-sm font-semibold mb-0.5">
                      {researcher.position}
                    </p>
                    <p className="text-theme-secondary text-xs truncate">
                      {researcher.department}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border mt-2 ${getAcademicLevelColor(researcher.academic_level)}`}
                    >
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {academicLevelLabels[researcher.academic_level]}
                    </span>
                  </div>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center bg-theme-background/30 border border-theme-border/50 rounded-xl p-2.5">
                  <div className="rounded-lg py-1.5 bg-theme-card border border-theme-border/40">
                    <div className="text-lg font-bold text-theme-text leading-tight">
                      {displayedProjects.length}
                    </div>
                    <div className="text-xs text-theme-secondary">Proyectos</div>
                  </div>
                  <div className="rounded-lg py-1.5 bg-theme-card border border-theme-border/40">
                    <div className="text-lg font-bold text-theme-text leading-tight">
                      {researcher.publications_count}
                    </div>
                    <div className="text-xs text-theme-secondary">
                      Publicaciones
                    </div>
                  </div>
                  <div className="rounded-lg py-1.5 bg-theme-card border border-theme-border/40">
                    <div className="text-lg font-bold text-theme-text leading-tight">
                      {researcher.years_experience}
                    </div>
                    <div className="text-xs text-theme-secondary">Años Exp.</div>
                  </div>
                </div>

                {/* Proyectos Actuales */}
                <div className="mb-4 min-h-[96px] bg-theme-background/20 border border-theme-border/50 rounded-xl p-3.5">
                  <p className="text-xs font-semibold text-theme-secondary mb-2">
                    Proyectos:
                  </p>
                  {displayedProjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {displayedProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-theme-border/60 bg-theme-card hover:border-theme-accent/50 hover:text-theme-accent transition-colors max-w-full"
                          title={project.title}
                        >
                          <Target className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-theme-text truncate">
                            {project.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-theme-secondary/70 italic">
                      Sin proyectos actuales
                    </p>
                  )}
                </div>

                {/* Botones de Acción */}
                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3.5 border-t border-theme-border/60">
                  <div className="flex flex-wrap gap-2">
                    {/* Botón Ver Página Completa - Todos los usuarios */}
                    <Link
                      href={`/researchers/${researcher.id}`}
                      className="p-2.5 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 border border-theme-border/60 rounded-lg transition-colors"
                      title="Ver página completa del perfil"
                    >
                      <User className="w-4 h-4" />
                    </Link>

                    {/* Botón Ver Modal - Todos los usuarios */}
                    <button
                      onClick={() => alert('Vista detallada próximamente')}
                      className="p-2.5 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 border border-theme-border/60 rounded-lg transition-colors"
                      title="Vista rápida del perfil"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Enlaces externos - Solo usuarios autenticados */}
                    {isAuthenticated && researcher.email && (
                      <a
                        href={`mailto:${researcher.email}`}
                        className="p-2.5 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 border border-theme-border/60 rounded-lg transition-colors"
                        title="Enviar email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}

                    {phoneDigits ? (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 text-green-500 hover:text-green-600 hover:bg-green-500/10 border border-theme-border/60 rounded-lg transition-colors"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setWhatsAppTargetName(researcher.name);
                          setShowWhatsAppInfoModal(true);
                        }}
                        className="p-2.5 text-green-500 hover:text-green-600 hover:bg-green-500/10 border border-theme-border/60 rounded-lg transition-colors"
                        title="Sin número de WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
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
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => alert('Edición próximamente')}
                        className="p-2.5 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 border border-theme-border/60 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteResearcher(researcher.id)}
                        className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-theme-border/60 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredResearchers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-theme-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-theme-text mb-2">
                No se encontraron investigadores
              </h3>
              <p className="text-theme-secondary">
                {searchQuery ||
                  selectedStatus ||
                  selectedProject
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Agrega el primer investigador al directorio'}
              </p>
            </div>
          )}
        </div>

        {/* Loading State (inline, no overlay) */}
        {isLoading && (
          <div className="text-center text-theme-secondary py-6">
            Cargando investigadores...
          </div>
        )}

        {/* Modales */}
        <Modal
          isOpen={showWhatsAppInfoModal}
          onClose={() => setShowWhatsAppInfoModal(false)}
          title="Contacto no disponible"
          size="sm"
          className="bg-theme-card border border-theme-border text-theme-text"
          footer={
            <div className="flex justify-end">
              <button
                onClick={() => setShowWhatsAppInfoModal(false)}
                className="px-4 py-2 rounded-lg border border-theme-border text-theme-text hover:bg-theme-accent/10 transition-colors"
              >
                Entendido
              </button>
            </div>
          }
        >
          <p className="text-theme-secondary">
            {whatsAppTargetName
              ? `${whatsAppTargetName} no tiene número de WhatsApp registrado por el momento.`
              : 'Este investigador no tiene número de WhatsApp registrado por el momento.'}
          </p>
        </Modal>

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
