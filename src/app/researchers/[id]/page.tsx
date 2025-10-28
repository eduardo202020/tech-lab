'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  ExternalLink,
  User,
  Edit3,
  Share2,
  Download,
  GraduationCap,
  Trophy,
  Target,
  Users,
  Briefcase,
  Link as LinkIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useResearchers, Researcher } from '@/contexts/ResearcherContext';
import { useProjects } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { EditResearcherModal } from '@/components/index';

export default function ResearcherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { researchers, updateResearcher, isLoading } = useResearchers();
  const { projects } = useProjects();

  const [researcher, setResearcher] = useState<Researcher | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'projects' | 'publications' | 'achievements'
  >('profile');

  const researcherId = params.id as string;
  const isAdmin = user?.role === 'admin';

  // Encontrar el investigador por ID
  useEffect(() => {
    if (researchers.length > 0 && researcherId) {
      const foundResearcher = researchers.find((r) => r.id === researcherId);
      setResearcher(foundResearcher || null);
    }
  }, [researchers, researcherId]);

  // Obtener proyectos del investigador
  const researcherProjects = researcher
    ? projects.filter(
        (project) =>
          researcher.currentProjects.includes(project.id) ||
          researcher.pastProjects.includes(project.id)
      )
    : [];

  // Etiquetas de estado y nivel académico
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

  // Colores para estados
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
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getLevelColor = (level: Researcher['academicLevel']) => {
    switch (level) {
      case 'undergraduate':
        return 'bg-orange-500/10 text-orange-400';
      case 'bachelor':
        return 'bg-blue-500/10 text-blue-400';
      case 'master':
        return 'bg-purple-500/10 text-purple-400';
      case 'phd':
        return 'bg-red-500/10 text-red-400';
      case 'postdoc':
        return 'bg-indigo-500/10 text-indigo-400';
      case 'professor':
        return 'bg-emerald-500/10 text-emerald-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-theme-text">
              Cargando perfil del investigador...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!researcher) {
    return (
      <div className="min-h-screen bg-theme-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-theme-secondary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-theme-text mb-2">
              Investigador no encontrado
            </h1>
            <p className="text-theme-secondary mb-6">
              No se pudo encontrar el perfil del investigador solicitado.
            </p>
            <button
              onClick={() => router.push('/researchers')}
              className="flex items-center gap-2 bg-gradient-to-r from-neon-pink to-bright-blue text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Directorio
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
            onClick={() => router.push('/researchers')}
            className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Directorio
          </button>
        </div>

        {/* Cabecera del Perfil */}
        <div className="bg-theme-card rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Información Principal */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  {researcher.avatar ? (
                    <Image
                      src={researcher.avatar}
                      alt={researcher.name}
                      width={120}
                      height={120}
                      className="w-24 h-24 lg:w-30 lg:h-30 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 lg:w-30 lg:h-30 rounded-full bg-theme-accent/10 flex items-center justify-center">
                      <User className="w-12 h-12 lg:w-16 lg:h-16 text-theme-accent" />
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(researcher.status)}`}
                  >
                    {statusLabels[researcher.status]}
                  </span>
                </div>

                {/* Información Básica */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-theme-text mb-2">
                    {researcher.name}
                  </h1>
                  <p className="text-xl text-theme-secondary mb-3">
                    {researcher.position}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(researcher.academicLevel)}`}
                    >
                      <GraduationCap className="w-4 h-4 inline mr-1" />
                      {academicLevelLabels[researcher.academicLevel]}
                    </span>
                    <span className="px-3 py-1 bg-theme-accent/10 text-theme-accent rounded-full text-sm font-medium">
                      {researcher.department}
                    </span>
                  </div>

                  {/* Información de Contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {researcher.email && (
                      <a
                        href={`mailto:${researcher.email}`}
                        className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {researcher.email}
                      </a>
                    )}
                    {researcher.phone && (
                      <a
                        href={`tel:${researcher.phone}`}
                        className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {researcher.phone}
                      </a>
                    )}
                    <div className="flex items-center gap-2 text-theme-secondary">
                      <Calendar className="w-4 h-4" />
                      Desde {new Date(researcher.joinDate).getFullYear()}
                    </div>
                    <div className="flex items-center gap-2 text-theme-secondary">
                      <Briefcase className="w-4 h-4" />
                      {researcher.yearsExperience} años experiencia
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas y Acciones */}
            <div className="lg:w-80">
              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-theme-background rounded-lg">
                  <div className="text-2xl font-bold text-theme-text">
                    {researcher.projectsCompleted}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    Proyectos Completados
                  </div>
                </div>
                <div className="text-center p-4 bg-theme-background rounded-lg">
                  <div className="text-2xl font-bold text-theme-text">
                    {researcher.publicationsCount}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    Publicaciones
                  </div>
                </div>
                <div className="text-center p-4 bg-theme-background rounded-lg">
                  <div className="text-2xl font-bold text-theme-text">
                    {researcher.currentProjects.length}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    Proyectos Actuales
                  </div>
                </div>
                <div className="text-center p-4 bg-theme-background rounded-lg">
                  <div className="text-2xl font-bold text-theme-text">
                    {researcher.achievements.length}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    Reconocimientos
                  </div>
                </div>
              </div>

              {/* Enlaces Sociales */}
              <div className="space-y-2 mb-6">
                {researcher.linkedIn && (
                  <a
                    href={researcher.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full p-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                {researcher.researchGate && (
                  <a
                    href={researcher.researchGate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full p-3 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    ResearchGate
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                {researcher.personalWebsite && (
                  <a
                    href={researcher.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full p-3 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Sitio Web
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="space-y-2">
                {isAdmin && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 w-full bg-gradient-to-r from-neon-pink to-bright-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar Perfil
                  </button>
                )}
                <button className="flex items-center gap-2 w-full bg-theme-background text-theme-text px-4 py-2 rounded-lg hover:bg-theme-accent/10 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Compartir Perfil
                </button>
                <button className="flex items-center gap-2 w-full bg-theme-background text-theme-text px-4 py-2 rounded-lg hover:bg-theme-accent/10 transition-colors">
                  <Download className="w-4 h-4" />
                  Descargar CV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-theme-border">
            {[
              { key: 'profile', label: 'Perfil', icon: User },
              { key: 'projects', label: 'Proyectos', icon: Briefcase },
              { key: 'publications', label: 'Publicaciones', icon: BookOpen },
              { key: 'achievements', label: 'Logros', icon: Trophy },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-theme-accent text-theme-accent'
                    : 'border-transparent text-theme-secondary hover:text-theme-text hover:border-theme-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {key === 'projects' && researcherProjects.length > 0 && (
                  <span className="bg-theme-accent/10 text-theme-accent px-2 py-0.5 rounded-full text-xs">
                    {researcherProjects.length}
                  </span>
                )}
                {key === 'publications' &&
                  researcher.publications.length > 0 && (
                    <span className="bg-theme-accent/10 text-theme-accent px-2 py-0.5 rounded-full text-xs">
                      {researcher.publications.length}
                    </span>
                  )}
                {key === 'achievements' &&
                  researcher.achievements.length > 0 && (
                    <span className="bg-theme-accent/10 text-theme-accent px-2 py-0.5 rounded-full text-xs">
                      {researcher.achievements.length}
                    </span>
                  )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de los Tabs */}
        <div className="space-y-8">
          {/* Tab: Perfil */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Biografía */}
              <div className="bg-theme-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Biografía
                </h2>
                {researcher.biography ? (
                  <p className="text-theme-secondary leading-relaxed">
                    {researcher.biography}
                  </p>
                ) : (
                  <p className="text-theme-secondary italic">
                    No hay biografía disponible.
                  </p>
                )}
              </div>

              {/* Especializaciones */}
              <div className="bg-theme-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Especializaciones
                </h2>
                {researcher.specializations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {researcher.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-theme-secondary italic">
                    No hay especializaciones definidas.
                  </p>
                )}
              </div>

              {/* Intereses de Investigación */}
              {researcher.researchInterests.length > 0 && (
                <div className="bg-theme-card rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Intereses de Investigación
                  </h2>
                  <div className="space-y-2">
                    {researcher.researchInterests.map((interest, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-theme-accent rounded-full"></div>
                        <span className="text-theme-secondary">{interest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Información Académica */}
              <div className="bg-theme-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Información Académica
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-theme-secondary text-sm">
                      Nivel Académico:
                    </span>
                    <div className="text-theme-text font-medium">
                      {academicLevelLabels[researcher.academicLevel]}
                    </div>
                  </div>
                  {researcher.university && (
                    <div>
                      <span className="text-theme-secondary text-sm">
                        Universidad:
                      </span>
                      <div className="text-theme-text">
                        {researcher.university}
                      </div>
                    </div>
                  )}
                  {researcher.degree && (
                    <div>
                      <span className="text-theme-secondary text-sm">
                        Título:
                      </span>
                      <div className="text-theme-text">{researcher.degree}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-theme-secondary text-sm">
                      Departamento:
                    </span>
                    <div className="text-theme-text">
                      {researcher.department}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Proyectos */}
          {activeTab === 'projects' && (
            <div className="bg-theme-card rounded-lg p-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Proyectos ({researcherProjects.length})
              </h2>
              {researcherProjects.length > 0 ? (
                <div className="space-y-4">
                  {researcherProjects.map((project) => {
                    const isCurrentProject =
                      researcher.currentProjects.includes(project.id);
                    const role =
                      researcher.projectRoles[project.id] || 'Participante';

                    return (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="block p-4 bg-theme-background rounded-lg border border-theme-border hover:border-theme-accent/50 hover:bg-theme-accent/5 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-theme-text group-hover:text-theme-accent transition-colors">
                              {project.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-theme-secondary group-hover:text-theme-accent transition-colors" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-theme-secondary bg-theme-accent/10 px-2 py-1 rounded">
                              {role}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                isCurrentProject
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-gray-500/10 text-gray-400'
                              }`}
                            >
                              {isCurrentProject ? 'Actual' : 'Completado'}
                            </span>
                          </div>
                        </div>
                        <p className="text-theme-secondary text-sm mb-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-theme-secondary">
                          <span>Estado: {project.status}</span>
                          <span>
                            {new Date(project.startDate).getFullYear()}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-theme-secondary mx-auto mb-4" />
                  <p className="text-theme-secondary">
                    No hay proyectos registrados.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Publicaciones */}
          {activeTab === 'publications' && (
            <div className="bg-theme-card rounded-lg p-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Publicaciones ({researcher.publications.length})
              </h2>
              {researcher.publications.length > 0 ? (
                <div className="space-y-4">
                  {researcher.publications.map((publication, index) => (
                    <div
                      key={index}
                      className="p-4 bg-theme-background rounded-lg border-l-4 border-blue-500"
                    >
                      <p className="text-theme-text">{publication}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-theme-secondary mx-auto mb-4" />
                  <p className="text-theme-secondary">
                    No hay publicaciones registradas.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Logros */}
          {activeTab === 'achievements' && (
            <div className="bg-theme-card rounded-lg p-6">
              <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Logros y Reconocimientos ({researcher.achievements.length})
              </h2>
              {researcher.achievements.length > 0 ? (
                <div className="space-y-4">
                  {researcher.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="p-4 bg-theme-background rounded-lg border-l-4 border-yellow-500"
                    >
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-yellow-500 mt-1" />
                        <p className="text-theme-text">{achievement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-theme-secondary mx-auto mb-4" />
                  <p className="text-theme-secondary">
                    No hay logros registrados.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de Edición */}
        {isAdmin && (
          <EditResearcherModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onEdit={(updatedResearcher) => {
              updateResearcher(updatedResearcher.id, updatedResearcher);
              setResearcher(updatedResearcher);
              setShowEditModal(false);
            }}
            researcher={researcher}
          />
        )}
      </main>
    </div>
  );
}
