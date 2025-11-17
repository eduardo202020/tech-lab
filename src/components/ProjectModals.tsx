'use client';

import { useState } from 'react';
import { X, Target, Link as LinkIcon } from 'lucide-react';
import { TechProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContextLegacy';

// Modal para agregar proyecto
interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Omit<TechProject, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddProjectModal({
  isOpen,
  onClose,
  onAdd,
}: AddProjectModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: [] as string[],
    status: 'planning' as TechProject['status'],
    priority: 'medium' as TechProject['priority'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    teamLead: user?.name || '',
    teamMembers: [] as string[],
    budget: 0,
    progress: 0,
    objectives: [] as string[],
    challenges: [] as string[],
    gallery: [] as string[],
    demoUrl: '',
    repositoryUrl: '',
    documentation: '',
    relatedTechnologyIds: [] as string[],
    createdBy: user?.username || 'admin',
  });

  const [currentTech, setCurrentTech] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [currentMember, setCurrentMember] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.category) {
      onAdd(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        technologies: [],
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        teamLead: user?.name || '',
        teamMembers: [],
        budget: 0,
        progress: 0,
        objectives: [],
        challenges: [],
        gallery: [],
        demoUrl: '',
        repositoryUrl: '',
        documentation: '',
        relatedTechnologyIds: [],
        createdBy: user?.username || 'admin',
      });
      onClose();
    }
  };

  const addTechnology = () => {
    if (
      currentTech.trim() &&
      !formData.technologies.includes(currentTech.trim())
    ) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, currentTech.trim()],
      });
      setCurrentTech('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addObjective = () => {
    if (currentObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, currentObjective.trim()],
      });
      setCurrentObjective('');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addChallenge = () => {
    if (currentChallenge.trim()) {
      setFormData({
        ...formData,
        challenges: [...formData.challenges, currentChallenge.trim()],
      });
      setCurrentChallenge('');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeChallenge = (index: number) => {
    setFormData({
      ...formData,
      challenges: formData.challenges.filter((_, i) => i !== index),
    });
  };

  const addTeamMember = () => {
    if (
      currentMember.trim() &&
      !formData.teamMembers.includes(currentMember.trim())
    ) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, currentMember.trim()],
      });
      setCurrentMember('');
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addImage = () => {
    if (
      currentImageUrl.trim() &&
      !formData.gallery.includes(currentImageUrl.trim())
    ) {
      setFormData({
        ...formData,
        gallery: [...formData.gallery, currentImageUrl.trim()],
      });
      setCurrentImageUrl('');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-sm modal-container modal-dark-bg">
        <div className="p-6 border-b modal-header flex justify-between items-center">
          <h2 className="text-xl font-semibold modal-text">
            Crear Nuevo Proyecto
          </h2>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 modal-content">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-theme-text">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="ej. Sistema de IA Avanzado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="ej. Artificial Intelligence, IoT, Blockchain"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Descripción *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text h-24"
                placeholder="Describe el objetivo y alcance del proyecto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as TechProject['status'],
                    })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                >
                  <option value="planning">Planificación</option>
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Completado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as TechProject['priority'],
                    })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Progreso (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progress: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                />
              </div>
            </div>
          </div>

          {/* Fechas y Equipo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-theme-text">
              Fechas y Equipo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Fecha de Fin (opcional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Presupuesto (opcional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Team Lead
              </label>
              <input
                type="text"
                value={formData.teamLead}
                onChange={(e) =>
                  setFormData({ ...formData, teamLead: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                placeholder="Nombre del líder del proyecto"
              />
            </div>

            {/* Miembros del Equipo */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Miembros del Equipo
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentMember}
                  onChange={(e) => setCurrentMember(e.target.value)}
                  className="flex-1 px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="Nombre del miembro"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addTeamMember())
                  }
                />
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:opacity-90"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.teamMembers.map((member, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-theme-accent/10 text-theme-accent rounded-full text-sm"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-theme-accent hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tecnologías */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-theme-text">Tecnologías</h3>

            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  className="flex-1 px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="ej. React, Python, Arduino"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addTechnology())
                  }
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:opacity-90"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="text-blue-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-theme-text">
              Enlaces y Recursos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  URL de Demo
                </label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, demoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="https://demo.ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Repositorio
                </label>
                <input
                  type="url"
                  value={formData.repositoryUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, repositoryUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="https://github.com/usuario/proyecto"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Documentación
              </label>
              <textarea
                value={formData.documentation}
                onChange={(e) =>
                  setFormData({ ...formData, documentation: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text h-20"
                placeholder="Enlaces a documentación, papers, etc..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-theme-secondary hover:text-theme-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-neon-pink to-bright-blue text-white rounded-lg hover:opacity-90 transition-opacity gradient-button"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal para ver detalles del proyecto
interface ViewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: TechProject | null;
}

export function ViewProjectModal({
  isOpen,
  onClose,
  project,
}: ViewProjectModalProps) {
  if (!isOpen || !project) return null;

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
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-sm modal-container modal-dark-bg">
        <div className="p-6 border-b modal-header flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold modal-text">
              {project.title}
            </h2>
            <p className="text-theme-secondary text-sm">{project.category}</p>
          </div>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 modal-content">
          {/* Información Principal */}
          <div>
            <h3 className="text-lg font-medium text-theme-text mb-3">
              Descripción
            </h3>
            <p className="text-theme-secondary">{project.description}</p>
          </div>

          {/* Estado y Progreso */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-theme-secondary text-sm">Estado:</span>
              <div className="text-theme-text font-medium">
                {statusLabels[project.status]}
              </div>
            </div>
            <div>
              <span className="text-theme-secondary text-sm">Prioridad:</span>
              <div className="text-theme-text font-medium">
                {priorityLabels[project.priority]}
              </div>
            </div>
            <div>
              <span className="text-theme-secondary text-sm">Progreso:</span>
              <div className="text-theme-text font-medium">
                {project.progress}%
              </div>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-theme-secondary">
                Progreso del Proyecto
              </span>
              <span className="text-sm text-theme-text">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-theme-background rounded-full h-3">
              <div
                className="bg-gradient-to-r from-neon-pink to-bright-blue h-3 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Equipo */}
          <div>
            <h3 className="text-lg font-medium text-theme-text mb-3">Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-theme-secondary text-sm">Team Lead:</span>
                <div className="text-theme-text font-medium">
                  {project.teamLead}
                </div>
              </div>
              <div>
                <span className="text-theme-secondary text-sm">Miembros:</span>
                <div className="text-theme-text">
                  {project.teamMembers.join(', ') || 'Sin miembros asignados'}
                </div>
              </div>
            </div>
          </div>

          {/* Tecnologías */}
          {project.technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-theme-text mb-3">
                Tecnologías
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Objetivos */}
          {project.objectives.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-theme-text mb-3">
                Objetivos
              </h3>
              <ul className="space-y-2">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-theme-accent mt-0.5 flex-shrink-0" />
                    <span className="text-theme-secondary">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Enlaces */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                Ver Demo
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                Ver Repositorio
              </a>
            )}
          </div>

          {/* Documentación */}
          {project.documentation && (
            <div>
              <h3 className="text-lg font-medium text-theme-text mb-3">
                Documentación
              </h3>
              <p className="text-theme-secondary">{project.documentation}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-theme-border">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity gradient-button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
