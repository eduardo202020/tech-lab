'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, Plus, Edit3, Trash2, Search, Camera, Wifi } from 'lucide-react';
import Modal from '@/components/Modal';
import { useAuth } from '@/contexts/SessionAuthContext';
import { useProjectDevices } from '@/hooks/useProjectDevices';
import { useProjectsData } from '@/hooks/useProjectsData';
import type { DeviceType, ProjectDeviceRecord } from '@/lib/projectDevices';

type DeviceFormState = {
  project_id: string;
  name: string;
  device_type: DeviceType;
  identifier: string;
  secondary_identifier: string;
  refresh_ms: string;
  enabled: boolean;
  notes: string;
};

const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  smart_parking: 'Smart Parking',
  people_counter: 'Conteo de Personas',
  lora: 'Sensor LoRa',
};

const createEmptyForm = (): DeviceFormState => ({
  project_id: '',
  name: '',
  device_type: 'people_counter',
  identifier: '',
  secondary_identifier: '',
  refresh_ms: '10000',
  enabled: true,
  notes: '',
});

function DeviceAdminModal({
  isOpen,
  mode,
  device,
  projects,
  saving,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  mode: 'create' | 'edit';
  device: ProjectDeviceRecord | null;
  projects: Array<{ id: string; title: string }>;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: Omit<ProjectDeviceRecord, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}) {
  const [form, setForm] = useState<DeviceFormState>(createEmptyForm());

  useEffect(() => {
    if (!isOpen) return;
    if (!device || mode === 'create') {
      setForm((prev) => ({
        ...createEmptyForm(),
        project_id: projects[0]?.id || prev.project_id,
      }));
      return;
    }

    setForm({
      project_id: device.project_id,
      name: device.name,
      device_type: device.device_type,
      identifier: device.identifier,
      secondary_identifier: device.secondary_identifier || '',
      refresh_ms: String(device.refresh_ms ?? 10000),
      enabled: device.enabled,
      notes: device.notes || '',
    });
  }, [device, isOpen, mode, projects]);

  const showSecondaryField = form.device_type === 'smart_parking';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave({
      project_id: form.project_id,
      device_type: form.device_type,
      name: form.name.trim(),
      identifier: form.identifier.trim(),
      secondary_identifier: showSecondaryField ? form.secondary_identifier.trim() || null : null,
      refresh_ms: Number.isFinite(Number(form.refresh_ms)) ? Number(form.refresh_ms) : 10000,
      enabled: form.enabled,
      notes: form.notes.trim() || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nuevo dispositivo' : 'Editar dispositivo'}
      size="lg"
      className="bg-theme-card border border-theme-border text-theme-text"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-theme-secondary mb-2">Proyecto</label>
            <select
              value={form.project_id}
              onChange={(e) => setForm({ ...form, project_id: e.target.value })}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
              required
            >
              <option value="">Selecciona un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
            placeholder="Nombre visible"
          />
          <select
            value={form.device_type}
            onChange={(e) => setForm({ ...form, device_type: e.target.value as DeviceType })}
            className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
          >
            {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            required
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
            placeholder="ID principal"
          />
          <input
            type="number"
            min="1000"
            step="1000"
            value={form.refresh_ms}
            onChange={(e) => setForm({ ...form, refresh_ms: e.target.value })}
            className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
            placeholder="Refresh ms"
          />
          {form.device_type === 'smart_parking' && (
            <input
              value={form.secondary_identifier}
              onChange={(e) => setForm({ ...form, secondary_identifier: e.target.value })}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg md:col-span-2"
              placeholder="ID secundario"
            />
          )}
        </div>

        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg h-28"
          placeholder="Notas"
        />

        <label className="flex items-center gap-2 text-sm text-theme-text">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          />
          Dispositivo habilitado
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-theme-border hover:bg-theme-accent/10">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-theme-accent text-white disabled:opacity-60">
            {saving ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function DevicesAdminPage() {
  const { user, profile } = useAuth();
  const isAdmin = !!user && profile?.role === 'admin';
  const { devices, loading, createDevice, updateDevice, deleteDevice } = useProjectDevices();
  const { projects, loading: loadingProjects } = useProjectsData();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | ''>('');
  const [projectFilter, setProjectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDevice, setSelectedDevice] = useState<ProjectDeviceRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const projectOptions = useMemo(
    () => projects.map((project) => ({ id: project.id, title: project.title })),
    [projects]
  );

  const projectTitles = useMemo(
    () => new Map(projects.map((project) => [project.id, project.title])),
    [projects]
  );

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      if (typeFilter && device.device_type !== typeFilter) return false;
      if (projectFilter && device.project_id !== projectFilter) return false;
      if (!query.trim()) return true;

      const haystack = [
        device.name,
        device.identifier,
        device.secondary_identifier || '',
        device.notes || '',
        projectTitles.get(device.project_id) || '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query.toLowerCase());
    });
  }, [devices, projectFilter, projectTitles, query, typeFilter]);

  const handleSave = async (
    payload: Omit<ProjectDeviceRecord, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setSaving(true);
    const ok =
      modalMode === 'create'
        ? await createDevice(payload)
        : selectedDevice
          ? await updateDevice(selectedDevice.id, payload)
          : false;
    setSaving(false);
    if (ok) {
      setShowModal(false);
      setSelectedDevice(null);
    }
  };

  const handleDelete = async (device: ProjectDeviceRecord) => {
    if (!window.confirm(`¿Eliminar el dispositivo "${device.name}"?`)) return;
    await deleteDevice(device.id);
  };

  return (
    <div className="min-h-screen bg-theme-background transition-colors duration-300">
      <header className="bg-theme-card border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors">
              <ArrowLeft size={20} />
              <span>Volver al Inicio</span>
            </Link>
            <div className="text-sm text-theme-secondary">TechLab • Dispositivos</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4">
            Dispositivos del Lab
          </h1>
          <p className="text-lg text-theme-secondary max-w-3xl">
            Administra desde un solo lugar los identificadores de Smart Parking, conteo de personas y sensores LoRa asociados a los proyectos.
          </p>
          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setModalMode('create');
                  setSelectedDevice(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-pink to-bright-blue text-white hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Nuevo dispositivo
              </button>
            </div>
          )}
        </div>

        {!isAdmin && (
          <div className="mb-6 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-300">
            Esta vista es de solo lectura para roles no administradores.
          </div>
        )}

        <div className="bg-theme-card rounded-lg p-6 border border-theme-border mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, ID o proyecto..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DeviceType | '')}
              className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
            >
              <option value="">Todos los tipos</option>
              {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
            >
              <option value="">Todos los proyectos</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {(loading || loadingProjects) && (
            <div className="text-theme-secondary">Cargando dispositivos...</div>
          )}

          {!loading && filteredDevices.map((device) => (
            <div key={device.id} className="bg-theme-card rounded-xl border border-theme-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-theme-text font-semibold text-lg">
                    {device.device_type === 'smart_parking' ? <Camera size={18} /> : <Wifi size={18} />}
                    <span>{device.name}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-theme-background border border-theme-border text-theme-secondary">
                      {DEVICE_TYPE_LABELS[device.device_type]}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${device.enabled ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                      {device.enabled ? 'Activo' : 'Deshabilitado'}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setModalMode('edit');
                        setSelectedDevice(device);
                        setShowModal(true);
                      }}
                      className="p-2 rounded-lg border border-theme-border hover:bg-theme-accent/10"
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(device)}
                      className="p-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm text-theme-secondary">
                <div>
                  Proyecto:
                  <span className="ml-2 text-theme-text font-medium">
                    {projectTitles.get(device.project_id) || device.project_id}
                  </span>
                </div>
                <div>
                  ID principal:
                  <span className="ml-2 font-mono text-theme-text">{device.identifier}</span>
                </div>
                {device.secondary_identifier && (
                  <div>
                    ID secundario:
                    <span className="ml-2 font-mono text-theme-text">{device.secondary_identifier}</span>
                  </div>
                )}
                <div>
                  Refresh:
                  <span className="ml-2 text-theme-text">{device.refresh_ms ?? 10000} ms</span>
                </div>
                {device.notes && <p>{device.notes}</p>}
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredDevices.length === 0 && (
          <div className="bg-theme-card rounded-xl border border-theme-border p-8 text-center text-theme-secondary mt-6">
            <Cpu className="mx-auto mb-4 text-theme-accent" size={32} />
            No hay dispositivos que coincidan con los filtros actuales.
          </div>
        )}
      </main>

      <DeviceAdminModal
        isOpen={showModal}
        mode={modalMode}
        device={selectedDevice}
        projects={projectOptions}
        saving={saving}
        onClose={() => {
          setShowModal(false);
          setSelectedDevice(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
