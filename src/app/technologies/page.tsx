'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Zap, Plus, Edit3, Trash2 } from 'lucide-react';
import { useTechnologies, Technology, TechnologyRecord } from '@/hooks/useTechnologies';
import { useAuth } from '@/contexts/SessionAuthContext';
import Modal from '@/components/Modal';

type TechnologyFormState = {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  primary_color: string;
  description: string;
  about_title: string;
  about_content_text: string;
  features_title: string;
  features_items_text: string;
  example_projects_text: string;
  has_direct_links: boolean;
  direct_links_text: string;
};

const createEmptyTechnologyForm = (): TechnologyFormState => ({
  id: '',
  name: '',
  icon: 'Zap',
  gradient: 'from-cyan-500 to-blue-600',
  primary_color: 'cyan',
  description: '',
  about_title: 'Acerca de la tecnologia',
  about_content_text: '',
  features_title: 'Caracteristicas',
  features_items_text: '',
  example_projects_text: '',
  has_direct_links: false,
  direct_links_text: '',
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function TechnologyAdminModal({
  isOpen,
  mode,
  technology,
  saving,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  mode: 'create' | 'edit';
  technology: TechnologyRecord | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: Omit<TechnologyRecord, 'created_at' | 'updated_at'>) => Promise<void>;
}) {
  const [form, setForm] = useState<TechnologyFormState>(createEmptyTechnologyForm());

  useEffect(() => {
    if (!isOpen) return;
    if (!technology || mode === 'create') {
      setForm(createEmptyTechnologyForm());
      return;
    }

    setForm({
      id: technology.id,
      name: technology.name,
      icon: technology.icon,
      gradient: technology.gradient,
      primary_color: technology.primary_color,
      description: technology.description,
      about_title: technology.about_title,
      about_content_text: (technology.about_content || []).join('\n'),
      features_title: technology.features_title,
      features_items_text: (technology.features_items || [])
        .map((item) => `${item.text}|${item.color}`)
        .join('\n'),
      example_projects_text: (technology.example_projects || [])
        .map((item) => `${item.title}|${item.description}`)
        .join('\n'),
      has_direct_links: technology.has_direct_links,
      direct_links_text: (technology.direct_links || [])
        .map((item) => `${item.text}|${item.href}|${item.primary ? 'true' : 'false'}`)
        .join('\n'),
    });
  }, [isOpen, mode, technology]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const features_items = form.features_items_text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [text, color = 'text-cyan-400'] = line.split('|').map((part) => part.trim());
        return { text, color };
      });

    const example_projects = form.example_projects_text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, description = ''] = line.split('|').map((part) => part.trim());
        return { title, description };
      });

    const direct_links = form.direct_links_text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [text, href, primary = 'false'] = line.split('|').map((part) => part.trim());
        return { text, href, primary: primary === 'true' };
      });

    await onSave({
      id: form.id.trim() || slugify(form.name),
      name: form.name.trim(),
      icon: form.icon.trim(),
      gradient: form.gradient.trim(),
      primary_color: form.primary_color.trim(),
      description: form.description.trim(),
      about_title: form.about_title.trim(),
      about_content: form.about_content_text.split('\n').map((item) => item.trim()).filter(Boolean),
      features_title: form.features_title.trim(),
      features_items,
      example_projects,
      has_direct_links: form.has_direct_links,
      direct_links,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nueva Tecnologia' : 'Editar Tecnologia'}
      size="lg"
      className="bg-theme-card border border-theme-border text-theme-text"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg" placeholder="id-slug" />
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg" placeholder="Nombre" />
          <input required value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg" placeholder="Icono" />
          <input required value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg" placeholder="from-cyan-500 to-blue-600" />
          <input required value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg" placeholder="cyan" />
          <input required value={form.about_title} onChange={(e) => setForm({ ...form, about_title: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg" placeholder="Titulo seccion" />
          <input required value={form.features_title} onChange={(e) => setForm({ ...form, features_title: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg md:col-span-2" placeholder="Titulo caracteristicas" />
        </div>
        <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg h-24" placeholder="Descripcion" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea value={form.about_content_text} onChange={(e) => setForm({ ...form, about_content_text: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg h-32" placeholder="About content, una linea por parrafo" />
          <textarea value={form.features_items_text} onChange={(e) => setForm({ ...form, features_items_text: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg h-32" placeholder="Caracteristica|color, una por linea" />
          <textarea value={form.example_projects_text} onChange={(e) => setForm({ ...form, example_projects_text: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg h-32" placeholder="Proyecto|Descripcion, uno por linea" />
          <textarea value={form.direct_links_text} onChange={(e) => setForm({ ...form, direct_links_text: e.target.value })} className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg h-32" placeholder="Texto|URL|true, uno por linea" />
        </div>
        <label className="flex items-center gap-2 text-sm text-theme-text">
          <input type="checkbox" checked={form.has_direct_links} onChange={(e) => setForm({ ...form, has_direct_links: e.target.checked })} />
          Tiene enlaces directos
        </label>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-theme-border hover:bg-theme-accent/10">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-theme-accent text-white disabled:opacity-60">
            {saving ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function TechnologiesPage() {
  const { technologies, technologyRecords, loading, error, createTechnology, updateTechnology, deleteTechnology } = useTechnologies();
  const { user, profile } = useAuth();
  const isAdmin = !!user && profile?.role === 'admin';
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTechnology, setSelectedTechnology] = useState<TechnologyRecord | null>(null);
  const [savingTechnology, setSavingTechnology] = useState(false);
  const recordsById = useMemo(
    () => new Map(technologyRecords.map((item) => [item.id, item])),
    [technologyRecords]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Cargando tecnologías...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-theme-card border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver al Inicio</span>
            </Link>
            <div className="text-sm text-theme-secondary">
              TechLab • Catálogo de Tecnologías
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4">
            Tecnologías Implementadas
          </h1>
          <p className="text-lg text-theme-secondary max-w-3xl mx-auto">
            Explora nuestro catálogo completo de tecnologías de vanguardia
            implementadas en el Tech Lab. Desde IoT y Blockchain hasta IA y
            sistemas 3D interactivos.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-theme-accent">
            <Zap size={20} />
            <span className="font-medium">
              {technologies.length} tecnologías disponibles
            </span>
          </div>
          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setModalMode('create');
                  setSelectedTechnology(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-pink to-bright-blue text-white hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Nueva tecnología
              </button>
            </div>
          )}
        </div>

        {/* Grid de Tecnologías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-theme-card rounded-xl p-6 border border-theme-border hover:border-theme-accent/50 transition-all duration-300 group"
            >
              {/* Header con Icono */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`text-3xl p-3 rounded-lg bg-gradient-to-r ${tech.gradient} text-white`}
                  >
                    {tech.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                      {tech.name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-theme-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                {tech.description}
              </p>

              {/* Características destacadas */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-theme-text mb-2">
                  Características:
                </h3>
                <div className="space-y-1">
                  {tech.features.items.slice(0, 3).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs text-theme-secondary"
                    >
                      <div className="w-1.5 h-1.5 bg-theme-accent rounded-full"></div>
                      {feature.text}
                    </div>
                  ))}
                  {tech.features.items.length > 3 && (
                    <div className="text-xs text-theme-accent">
                      +{tech.features.items.length - 3} más características
                    </div>
                  )}
                </div>
              </div>

              {/* Proyectos Vinculados */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-theme-text">
                    Proyectos Vinculados:
                  </h3>
                  <div className="text-xs text-theme-accent font-medium">
                    {tech.relatedProjects?.length || 0}
                  </div>
                </div>

                {tech.relatedProjects && tech.relatedProjects.length > 0 ? (
                  <div className="space-y-2">
                    {tech.relatedProjects
                      .slice(0, 2)
                      .map(
                        (project: {
                          id: string;
                          title: string;
                          status: string;
                          progress: number;
                        }) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="block p-2 bg-theme-background rounded-md hover:bg-theme-accent/10 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-theme-text truncate">
                                {project.title}
                              </span>
                              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    project.status === 'completed'
                                      ? 'bg-green-500'
                                      : project.status === 'active'
                                        ? 'bg-blue-500'
                                        : project.status === 'paused'
                                          ? 'bg-yellow-500'
                                          : 'bg-gray-500'
                                  }`}
                                />
                                <span className="text-xs text-theme-secondary">
                                  {project.progress}%
                                </span>
                              </div>
                            </div>
                          </Link>
                        )
                      )}
                    {tech.relatedProjects.length > 2 && (
                      <div className="text-xs text-theme-secondary text-center py-1">
                        +{tech.relatedProjects.length - 2} proyecto
                        {tech.relatedProjects.length > 3 ? 's' : ''} más
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-theme-secondary/70 italic text-center py-2">
                    No hay proyectos vinculados
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                {/* Enlace principal */}
                <Link
                  href={`/technologies/${tech.id}`}
                  className={`flex-1 bg-gradient-to-r ${tech.gradient} text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                >
                  Ver Detalles
                  <ExternalLink size={14} />
                </Link>

                {/* Enlace directo para tecnologías con sistemas */}
                {tech.hasDirectLinks && tech.directLinks && (
                  <Link
                    href={
                      tech.directLinks.find((link) => link.primary)?.href || '#'
                    }
                    className="px-3 py-2 border border-theme-border text-theme-text rounded-lg hover:bg-theme-card transition-colors text-sm"
                  >
                    Sistema
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setModalMode('edit');
                        setSelectedTechnology(recordsById.get(tech.id) || null);
                        setShowModal(true);
                      }}
                      className="px-3 py-2 border border-theme-border text-theme-text rounded-lg hover:bg-theme-card transition-colors text-sm"
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm(`Eliminar ${tech.name}?`)) return;
                        await deleteTechnology(tech.id);
                      }}
                      className="px-3 py-2 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {error && (
          <div className="mt-6 text-center text-red-400">{error}</div>
        )}

        {/* Sección de estadísticas */}
        <div className="mt-16 bg-gradient-to-r from-theme-accent/10 via-theme-secondary/5 to-theme-accent/10 rounded-xl p-8 border border-theme-border/50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-theme-text mb-4">
              Ecosistema Tecnológico
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-theme-accent mb-2">
                  {technologies.length}
                </div>
                <div className="text-sm text-theme-secondary">
                  Tecnologías Implementadas
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-theme-accent mb-2">
                  {technologies.reduce(
                    (acc: number, tech: Technology) =>
                      acc + (tech.relatedProjects?.length || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-theme-secondary">
                  Proyectos Vinculados
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-theme-accent mb-2">
                  {technologies.filter((tech) => tech.hasDirectLinks).length}
                </div>
                <div className="text-sm text-theme-secondary">
                  Sistemas Disponibles
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-theme-text mb-4">
            ¿Interesado en alguna tecnología específica?
          </h3>
          <p className="text-theme-secondary mb-6 max-w-2xl mx-auto">
            Cada tecnología representa horas de investigación e implementación.
            Explora los detalles técnicos y proyectos de cada una.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-theme-accent text-white rounded-lg hover:bg-theme-accent/80 transition-colors font-medium"
            >
              Contactar Equipo
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-theme-border text-theme-text rounded-lg hover:bg-theme-card transition-colors font-medium"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </main>
      <TechnologyAdminModal
        isOpen={showModal}
        mode={modalMode}
        technology={selectedTechnology}
        saving={savingTechnology}
        onClose={() => {
          setShowModal(false);
          setSelectedTechnology(null);
        }}
        onSave={async (payload) => {
          setSavingTechnology(true);
          if (modalMode === 'create') {
            const created = await createTechnology(payload);
            if (created) {
              setShowModal(false);
            }
          } else if (selectedTechnology) {
            const ok = await updateTechnology(selectedTechnology.id, payload);
            if (ok) {
              setShowModal(false);
              setSelectedTechnology(null);
            }
          }
          setSavingTechnology(false);
        }}
      />
    </div>
  );
}
