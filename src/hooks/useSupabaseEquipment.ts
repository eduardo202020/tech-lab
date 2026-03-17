'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SupabaseEquipment {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  available_quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'broken';
  location?: string;
  purchase_date?: string;
  purchase_price?: number;
  serial_number?: string;
  brand?: string;
  model?: string;
  specifications?: string | null;
  image_url?: string;
  notes?: string;
  is_loanable: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentFilters {
  condition?: SupabaseEquipment['condition'];
  category?: string;
  location?: string;
  available_only?: boolean;
}

interface UseSupabaseEquipmentOptions {
  /** Si true, el hook hará una carga inicial al montar (con guard para StrictMode). */
  autoFetch?: boolean;
}

export function useSupabaseEquipment(options?: UseSupabaseEquipmentOptions) {
  const autoFetch = options?.autoFetch ?? true;
  const [equipment, setEquipment] = useState<SupabaseEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAutoFetched = useRef(false);

  // Cargar todos los equipos desde PostgreSQL vía API interna
  const fetchEquipment = useCallback(async (filters?: EquipmentFilters, search?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.condition) params.set('condition', filters.condition);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.location) params.set('location', filters.location);
      if (filters?.available_only) params.set('available_only', 'true');
      if (search?.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/equipment?${params.toString()}`);
      if (!res.ok) throw new Error('No se pudo cargar equipos desde PostgreSQL');

      const json = await res.json();
      setEquipment((json.equipment || []) as SupabaseEquipment[]);
    } catch (err) {
      console.error('Error in fetchEquipment:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener equipo por ID
  const getEquipmentById = useCallback(
    async (id: string): Promise<SupabaseEquipment | null> => {
      try {
        return equipment.find((item) => item.id === id) || null;
      } catch (err) {
        console.error('Error in getEquipmentById:', err);
        return null;
      }
    },
    [equipment]
  );

  // Crear nuevo equipo
  const createEquipment = useCallback(
    async (
      equipmentData: Omit<SupabaseEquipment, 'id' | 'created_at' | 'updated_at'>
    ): Promise<SupabaseEquipment | null> => {
      try {
        const res = await fetch('/api/equipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(equipmentData),
        });

        if (!res.ok) {
          throw new Error('No se pudo crear equipo en PostgreSQL');
        }

        const json = await res.json();
        const created = json.equipment as SupabaseEquipment;
        setEquipment((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        console.error('Error in createEquipment:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        return null;
      }
    },
    []
  );

  // Actualizar equipo
  const updateEquipment = useCallback(
    async (
      id: string,
      updates: Partial<Omit<SupabaseEquipment, 'id' | 'created_at'>>
    ): Promise<SupabaseEquipment | null> => {
      try {
        const res = await fetch('/api/equipment', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates }),
        });

        if (!res.ok) {
          throw new Error('No se pudo actualizar equipo en PostgreSQL');
        }

        const json = await res.json();
        const updated = json.equipment as SupabaseEquipment;

        setEquipment((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
        return updated;
      } catch (err) {
        console.error('Error in updateEquipment:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        return null;
      }
    },
    []
  );

  // Eliminar equipo
  const deleteEquipment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/equipment?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar equipo en PostgreSQL');
      }

      setEquipment((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      console.error('Error in deleteEquipment:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  }, []);

  // Obtener estadísticas de equipos
  const getEquipmentStats = useCallback(() => {
    const stats = {
      total: equipment.length,
      available: equipment.filter(item => item.available_quantity > 0).length,
      excellent: equipment.filter(item => item.condition === 'excellent').length,
      good: equipment.filter(item => item.condition === 'good').length,
      fair: equipment.filter(item => item.condition === 'fair').length,
      poor: equipment.filter(item => item.condition === 'poor').length,
      damaged: equipment.filter(item => item.condition === 'damaged').length,
      categories: {} as Record<string, number>
    };

    // Contar por categorías
    equipment.forEach((item) => {
      stats.categories[item.category] =
        (stats.categories[item.category] || 0) + 1;
    });

    return stats;
  }, [equipment]);

  // Buscar equipos
  const searchEquipment = useCallback(
    (query: string) => {
      if (!query.trim()) return equipment;

      const lowerQuery = query.toLowerCase();
      return equipment.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.brand?.toLowerCase().includes(lowerQuery) ||
          item.model?.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery) ||
          item.serial_number?.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)
      );
    },
    [equipment]
  );

  // Obtener equipos por categoría
  const getEquipmentByCategory = useCallback(
    (category: string) => {
      return equipment.filter((item) => item.category === category);
    },
    [equipment]
  );

  // Cargar datos iniciales (una sola vez, protegido ante StrictMode)
  useEffect(() => {
    if (!autoFetch) return;
    if (hasAutoFetched.current) return;
    hasAutoFetched.current = true;
    fetchEquipment();
  }, [autoFetch, fetchEquipment]);

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentStats,
    searchEquipment,
    getEquipmentByCategory,
    // Utilidades
    refreshEquipment: () => fetchEquipment(),
    clearError: () => setError(null),
  };
}
