'use client';

import { useCallback, useEffect, useState } from 'react';
import { createMockAuthHeaders } from '@/lib/mockAuthClient';
import type { ProjectDeviceRecord } from '@/lib/projectDevices';

type CreateDeviceInput = Omit<ProjectDeviceRecord, 'id' | 'created_at' | 'updated_at'>;

export function useProjectDevices(projectId?: string) {
  const [devices, setDevices] = useState<ProjectDeviceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = projectId
        ? `/api/devices?projectId=${encodeURIComponent(projectId)}`
        : '/api/devices';
      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('No se pudieron cargar dispositivos');
      }

      const json = await response.json();
      setDevices((json.devices || []) as ProjectDeviceRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando dispositivos');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const createDevice = useCallback(
    async (device: CreateDeviceInput) => {
      try {
        const response = await fetch('/api/devices', {
          method: 'POST',
          headers: createMockAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(device),
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(json.error || 'No se pudo crear el dispositivo');
        }

        await fetchDevices();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creando dispositivo');
        return false;
      }
    },
    [fetchDevices]
  );

  const updateDevice = useCallback(
    async (id: string, updates: Partial<CreateDeviceInput>) => {
      try {
        const response = await fetch('/api/devices', {
          method: 'PUT',
          headers: createMockAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ id, updates }),
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(json.error || 'No se pudo actualizar el dispositivo');
        }

        await fetchDevices();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error actualizando dispositivo');
        return false;
      }
    },
    [fetchDevices]
  );

  const deleteDevice = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/devices?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: createMockAuthHeaders(),
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(json.error || 'No se pudo eliminar el dispositivo');
        }

        await fetchDevices();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error eliminando dispositivo');
        return false;
      }
    },
    [fetchDevices]
  );

  return {
    devices,
    loading,
    error,
    fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
  };
}
