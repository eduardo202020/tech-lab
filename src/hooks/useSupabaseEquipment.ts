'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface SupabaseEquipment {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  available_quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
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

export function useSupabaseEquipment() {
  const [equipment, setEquipment] = useState<SupabaseEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los equipos
  const fetchEquipment = useCallback(async (filters?: EquipmentFilters, search?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      // Si se envía búsqueda, usar ilike server-side para varios campos
      if (search && search.trim()) {
        const like = `%${search.trim()}%`;
        const orCondition = `name.ilike.${like},brand.ilike.${like},model.ilike.${like},category.ilike.${like},serial_number.ilike.${like},description.ilike.${like},location.ilike.${like}`;
        query = query.or(orCondition);
      }

      // Aplicar filtros
      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.location) {
        query = query.eq('location', filters.location);
      }
      if (filters?.available_only) {
        query = query.gt('available_quantity', 0);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching equipment:', fetchError);
        setError(fetchError.message);
        return;
      }

      setEquipment(data || []);
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
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('id', id)
        .single();        if (error) {
          console.error('Error fetching equipment by ID:', error);
          return null;
        }

        return data;
      } catch (err) {
        console.error('Error in getEquipmentById:', err);
        return null;
      }
    },
    []
  );

  // Crear nuevo equipo
  const createEquipment = useCallback(
    async (
      equipmentData: Omit<SupabaseEquipment, 'id' | 'created_at' | 'updated_at'>
    ): Promise<SupabaseEquipment | null> => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert(equipmentData)
        .select()
        .single();        if (error) {
          console.error('Error creating equipment:', error);
          setError(error.message);
          return null;
        }

        // Actualizar la lista local
        setEquipment((prev) => [data, ...prev]);
        return data;
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
      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();        if (error) {
          console.error('Error updating equipment:', error);
          setError(error.message);
          return null;
        }

        // Actualizar la lista local
        setEquipment((prev) =>
          prev.map((item) => (item.id === id ? data : item))
        );
        return data;
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
      const { error } = await supabase.from('inventory_items').delete().eq('id', id);

      if (error) {
        console.error('Error deleting equipment:', error);
        setError(error.message);
        return false;
      }

      // Actualizar la lista local
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

  // Cargar datos iniciales
  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

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
