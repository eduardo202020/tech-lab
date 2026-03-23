'use client';

import { useEffect, useMemo, useState } from 'react';
import { Monitor, Plus, Edit3, Trash2, Cpu, Wifi, Camera } from 'lucide-react';
import type { TechProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/SessionAuthContext';
import SmartParkingViewer from '@/components/SmartParkingViewer';
import PeopleCounterViewer from '@/components/PeopleCounterViewer';
import LoRaSensorViewer from '@/components/LoRaSensorViewer';
import BlockchainViewer from '@/components/BlockchainViewer';
import TechLabPlatformViewer from '@/components/TechLabPlatformViewer';
import AirQualityViewer from '@/components/AirQualityViewer';
import Modal from '@/components/Modal';
import {
  useProjectDevices,
} from '@/hooks/useProjectDevices';
import type { DeviceType, ProjectDeviceRecord } from '@/lib/projectDevices';

type DeviceFormState = {
  name: string;
  device_type: DeviceType;
  identifier: string;
  secondary_identifier: string;
  refresh_ms: string;
  enabled: boolean;
  notes: string;
};

const createEmptyForm = (): DeviceFormState => ({
  name: '',
  device_type: 'people_counter',
  identifier: '',
  secondary_identifier: '',
  refresh_ms: '10000',
  enabled: true,
  notes: '',
});

const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  smart_parking: 'Smart Parking',
  people_counter: 'Conteo de Personas',
  lora: 'Sensor LoRa',
};

const DEVICE_TYPE_HELPERS: Record<DeviceType, string> = {
  smart_parking: 'Ejemplo de ID: smart_parking:A1',
  people_counter: 'Ejemplo de ID: cuenta_personas:A1',
  lora: 'Ejemplo de ID: 1102',
};

function DeviceModal({
  isOpen,
  mode,
  projectId,
  device,
  saving,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  mode: 'create' | 'edit';
  projectId: string;
  device: ProjectDeviceRecord | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: Omit<ProjectDeviceRecord, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}) {
  const [form, setForm] = useState<DeviceFormState>(createEmptyForm());

  useEffect(() => {
    if (!isOpen) return;
    if (!device || mode === 'create') {
      setForm(createEmptyForm());
      return;
    }

    setForm({
      name: device.name,
      device_type: device.device_type,
      identifier: device.identifier,
      secondary_identifier: device.secondary_identifier || '',
      refresh_ms: String(device.refresh_ms ?? 10000),
      enabled: device.enabled,
      notes: device.notes || '',
    });
  }, [device, isOpen, mode]);

  const showSecondaryField = form.device_type === 'smart_parking';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave({
      project_id: projectId,
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
      title={mode === 'create' ? 'Agregar dispositivo' : 'Editar dispositivo'}
      size="lg"
      className="bg-theme-card border border-theme-border text-theme-text"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-theme-secondary mb-2">Nombre visible</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
              placeholder="Camara principal A1"
            />
          </div>
          <div>
            <label className="block text-sm text-theme-secondary mb-2">Tipo</label>
            <select
              value={form.device_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  device_type: e.target.value as DeviceType,
                  secondary_identifier: e.target.value === 'smart_parking' ? form.secondary_identifier : '',
                })
              }
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
            >
              {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-theme-secondary mb-2">ID principal</label>
            <input
              required
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
              placeholder={DEVICE_TYPE_HELPERS[form.device_type]}
            />
            <p className="text-xs text-theme-secondary mt-2">{DEVICE_TYPE_HELPERS[form.device_type]}</p>
          </div>
          <div>
            <label className="block text-sm text-theme-secondary mb-2">Refresh ms</label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={form.refresh_ms}
              onChange={(e) => setForm({ ...form, refresh_ms: e.target.value })}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
              placeholder="10000"
            />
          </div>
          {showSecondaryField && (
            <div className="md:col-span-2">
              <label className="block text-sm text-theme-secondary mb-2">ID secundario</label>
              <input
                value={form.secondary_identifier}
                onChange={(e) => setForm({ ...form, secondary_identifier: e.target.value })}
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg"
                placeholder="cuenta_personas:A1"
              />
              <p className="text-xs text-theme-secondary mt-2">
                Usalo para relacionar el Smart Parking con el contador de personas del area.
              </p>
            </div>
          )}
        </div>

        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg h-28"
          placeholder="Notas internas del dispositivo"
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
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-theme-border hover:bg-theme-accent/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-theme-accent text-white disabled:opacity-60"
          >
            {saving ? 'Guardando...' : mode === 'create' ? 'Agregar' : 'Actualizar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeviceSection({ device }: { device: ProjectDeviceRecord }) {
  const refreshMs = device.refresh_ms ?? 10000;

  if (device.device_type === 'smart_parking') {
    return (
      <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
        <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
          <Monitor className="text-theme-accent" size={24} />
          {device.name}
        </h2>
        <p className="text-theme-secondary mb-6">
          Visualizacion en tiempo real del estacionamiento inteligente configurado para este proyecto.
        </p>
        <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
          <SmartParkingViewer
            camId={device.identifier}
            counterCamId={device.secondary_identifier || undefined}
            refreshMs={refreshMs}
          />
        </div>
      </div>
    );
  }

  if (device.device_type === 'people_counter') {
    return (
      <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
        <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
          <Monitor className="text-theme-accent" size={24} />
          {device.name}
        </h2>
        <p className="text-theme-secondary mb-6">
          Monitoreo de aforo en tiempo real para la camara configurada en este proyecto.
        </p>
        <div className="bg-theme-background rounded-lg p-4 border border-theme-border min-h-[600px]">
          <PeopleCounterViewer camId={device.identifier} refreshMs={refreshMs} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
      <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
        <Monitor className="text-theme-accent" size={24} />
        {device.name}
      </h2>
      <p className="text-theme-secondary mb-6">
        Monitoreo de calidad de aire para el dispositivo LoRa configurado en este proyecto.
      </p>
      <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
        <LoRaSensorViewer deviceId={device.identifier} refreshMs={refreshMs} />
      </div>
    </div>
  );
}

const getLegacyVisualFlags = (project: TechProject) => {
  const isSmartParkingProject =
    project.id === '00000000-0000-0000-0000-000000000001' ||
    project.title.toLowerCase().includes('smart parking');

  const isPeopleCounterProject =
    project.id === '4104a0b2-24ea-45b6-8b56-b0ef7ead7539' ||
    project.id === '00000000-0000-0000-0000-000000000007' ||
    project.title.toLowerCase().includes('conteo de personas') ||
    project.title.toLowerCase().includes('cuenta personas');

  const isLoRaProject =
    project.id === '00000000-0000-0000-0000-000000000002' ||
    project.title.toLowerCase().includes('lora');

  const isBlockchainProject =
    project.id === '5a72d6f1-c3b1-5f0b-8b13-0ffec9aa3c1b' ||
    project.title.toLowerCase().includes('blockchain') ||
    project.category.toLowerCase().includes('blockchain') ||
    project.technologies.some((tech) =>
      ['blockchain', 'ethereum', 'poa', 'clique'].some((keyword) =>
        tech.toLowerCase().includes(keyword)
      )
    );

  const isTechLabPlatformProject =
    project.id === '1a2b9f6b-3c2a-5db2-9b0d-cc2f5f3d72f3' ||
    project.title.toLowerCase().includes('plataforma techlab') ||
    project.category.toLowerCase().includes('plataforma') ||
    project.technologies.some((tech) =>
      ['web platform', 'auth/roles', 'gestión de proyectos', 'techlab-platform'].some((keyword) =>
        tech.toLowerCase().includes(keyword)
      )
    );

  const isIndoorAirQualityProject =
    project.id === '65b97c1d-0a6a-5fdd-9a9b-2c3b1c63cf5a' ||
    project.title.toLowerCase().includes('calidad de aire') ||
    project.category.toLowerCase().includes('salud ambiental') ||
    project.technologies.some((tech) =>
      ['air quality', 'calidad de aire', 'monitoreo ambiental', 'indoor-air-quality-iot'].some((keyword) =>
        tech.toLowerCase().includes(keyword)
      )
    );

  return {
    isSmartParkingProject,
    isPeopleCounterProject,
    isLoRaProject,
    isBlockchainProject,
    isTechLabPlatformProject,
    isIndoorAirQualityProject,
  };
};

function LegacySensorSections({
  project,
  managedTypes,
}: {
  project: TechProject;
  managedTypes: Set<DeviceType>;
}) {
  const flags = getLegacyVisualFlags(project);

  return (
    <>
      {flags.isSmartParkingProject && !managedTypes.has('smart_parking') && (
        <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
          <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
            <Monitor className="text-theme-accent" size={24} />
            Simulación 3D en Tiempo Real
          </h2>
          <p className="text-theme-secondary mb-6">
            Visualización interactiva del sistema de estacionamiento inteligente que muestra la ocupación de espacios en tiempo real.
          </p>
          <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
            <SmartParkingViewer />
          </div>
        </div>
      )}

      {flags.isPeopleCounterProject && !managedTypes.has('people_counter') && (
        <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
          <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
            <Monitor className="text-theme-accent" size={24} />
            Monitoreo de Aforo en Tiempo Real
          </h2>
          <p className="text-theme-secondary mb-6">
            Sistema de conteo de personas en tiempo real que muestra el aforo actual del área monitoreada.
          </p>
          <div className="bg-theme-background rounded-lg p-4 border border-theme-border min-h-[600px]">
            <PeopleCounterViewer camId="cuenta_personas:A1" refreshMs={10000} />
          </div>
        </div>
      )}

      {flags.isLoRaProject && !managedTypes.has('lora') && (
        <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
          <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
            <Monitor className="text-theme-accent" size={24} />
            Monitoreo de Calidad de Aire - Red LoRa
          </h2>
          <p className="text-theme-secondary mb-6">
            Sistema de monitoreo de calidad de aire usando tecnología LoRa con sensores distribuidos.
          </p>
          <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
            <LoRaSensorViewer refreshMs={10000} />
          </div>
        </div>
      )}

    </>
  );
}

function LegacyAdditionalVisualSections({ project }: { project: TechProject }) {
  const flags = getLegacyVisualFlags(project);

  return (
    <>
      {flags.isBlockchainProject && (
        <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
          <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
            <Monitor className="text-theme-accent" size={24} />
            Simulación de Red Blockchain
          </h2>
          <p className="text-theme-secondary mb-6">
            Entorno de simulación para visualizar transacciones pendientes, minería de bloques y encadenamiento mediante hash.
          </p>
          <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
            <BlockchainViewer />
          </div>
        </div>
      )}

      {flags.isTechLabPlatformProject && (
        <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
          <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
            <Monitor className="text-theme-accent" size={24} />
            Demo de Plataforma TechLab
          </h2>
          <p className="text-theme-secondary mb-6">
            Simulación funcional de la plataforma web para centralizar proyectos, investigadores y préstamos.
          </p>
          <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
            <TechLabPlatformViewer />
          </div>
        </div>
      )}

      {flags.isIndoorAirQualityProject && (
        <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
          <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
            <Monitor className="text-theme-accent" size={24} />
            Simulación 3D de Calidad de Aire Interior
          </h2>
          <p className="text-theme-secondary mb-6">
            Monitoreo visual del ambiente interior con sensores de CO₂, PM2.5, temperatura, humedad y VOC.
          </p>
          <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
            <AirQualityViewer refreshMs={3000} />
          </div>
        </div>
      )}
    </>
  );
}

export default function ProjectDeviceExperience({ project }: { project: TechProject }) {
  const { user, profile } = useAuth();
  const isAdmin = !!user && profile?.role === 'admin';
  const { devices, loading, error, createDevice, updateDevice, deleteDevice } = useProjectDevices(project.id);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDevice, setSelectedDevice] = useState<ProjectDeviceRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const activeDevices = useMemo(
    () => devices.filter((device) => device.enabled),
    [devices]
  );
  const managedTypes = useMemo(
    () => new Set(activeDevices.map((device) => device.device_type)),
    [activeDevices]
  );

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
    const confirmed = window.confirm(`¿Eliminar el dispositivo "${device.name}"?`);
    if (!confirmed) return;
    await deleteDevice(device.id);
  };

  return (
    <>
      {isAdmin && (
        <div className="bg-theme-card rounded-xl p-6 border border-theme-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-theme-text flex items-center gap-2">
                <Cpu className="text-theme-accent" size={24} />
                Dispositivos del Proyecto
              </h2>
              <p className="text-theme-secondary mt-2">
                Configura aquí los IDs reales de Smart Parking, conteo de personas o LoRa que este proyecto debe consumir.
              </p>
            </div>
            <button
              onClick={() => {
                setModalMode('create');
                setSelectedDevice(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-pink to-bright-blue text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Agregar dispositivo
            </button>
          </div>

          {loading ? (
            <p className="text-theme-secondary">Cargando dispositivos...</p>
          ) : devices.length === 0 ? (
            <p className="text-theme-secondary">
              Todavía no hay dispositivos configurados para este proyecto. Si no agregas ninguno, la página seguirá usando la lógica legacy.
            </p>
          ) : (
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="rounded-lg border border-theme-border bg-theme-background p-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-theme-text font-semibold">
                      {device.device_type === 'smart_parking' ? <Camera size={16} /> : <Wifi size={16} />}
                      <span>{device.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${device.enabled ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {device.enabled ? 'Activo' : 'Deshabilitado'}
                      </span>
                    </div>
                    <div className="text-sm text-theme-secondary">
                      Tipo: {DEVICE_TYPE_LABELS[device.device_type]}
                    </div>
                    <div className="text-sm text-theme-secondary">
                      ID principal: <span className="font-mono text-theme-text">{device.identifier}</span>
                    </div>
                    {device.secondary_identifier && (
                      <div className="text-sm text-theme-secondary">
                        ID secundario: <span className="font-mono text-theme-text">{device.secondary_identifier}</span>
                      </div>
                    )}
                    <div className="text-sm text-theme-secondary">
                      Refresh: {device.refresh_ms ?? 10000} ms
                    </div>
                    {device.notes && (
                      <p className="text-sm text-theme-secondary">{device.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setModalMode('edit');
                        setSelectedDevice(device);
                        setShowModal(true);
                      }}
                      className="p-2 rounded-lg border border-theme-border hover:bg-theme-accent/10"
                      title="Editar dispositivo"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(device)}
                      className="p-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10"
                      title="Eliminar dispositivo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      )}

      {activeDevices.map((device) => (
        <DeviceSection key={device.id} device={device} />
      ))}
      <LegacySensorSections project={project} managedTypes={managedTypes} />
      <LegacyAdditionalVisualSections project={project} />

      <DeviceModal
        isOpen={showModal}
        mode={modalMode}
        projectId={project.id}
        device={selectedDevice}
        saving={saving}
        onClose={() => {
          setShowModal(false);
          setSelectedDevice(null);
        }}
        onSave={handleSave}
      />
    </>
  );
}
