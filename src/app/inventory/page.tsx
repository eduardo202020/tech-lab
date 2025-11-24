'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  Eye,
} from 'lucide-react';
import { useAuth as useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import {
  useSupabaseEquipment,
  SupabaseEquipment,
} from '@/hooks/useSupabaseEquipment';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Header from '@/components/Header';
import useDebounce from '@/hooks/useDebounce';
import SearchBar from '@/components/SearchBar';

export default function InventoryPage() {
  const { user: sbUser, profile, loading: authLoading } = useSupabaseAuth();
  const isAuthenticated = !!sbUser;
  const user = { role: profile?.role } as { role?: string };
  const { redirectToLogin } = useAuthRedirect();
  const {
    equipment: items,
    createEquipment: addItem,
    updateEquipment: updateItem,
    deleteEquipment: deleteItem,
    searchEquipment: searchItems,
    loading: isLoading,
  } = useSupabaseEquipment();

  // Estados del componente
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<
    SupabaseEquipment['condition'] | ''
  >('');
  const [locationQuery, setLocationQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SupabaseEquipment | null>(
    null
  );
  const [filteredItems, setFilteredItems] =
    useState<SupabaseEquipment[]>(items);

  // Funciones auxiliares para filtros
  const filterByCondition = (condition: SupabaseEquipment['condition']) => {
    return items.filter((item) => item.condition === condition);
  };

  const getAvailableItems = () => {
    return items.filter((item) => item.available_quantity > 0);
  };

  const getUnavailableItems = () => {
    return items.filter((item) => item.available_quantity === 0);
  };

  // Función para manejar la redirección al login
  const handleLoginRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    redirectToLogin();
  };

  // Debounce search to avoid filtering on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedLocationQuery = useDebounce(locationQuery, 300);

  // Efecto para pedir datos al servidor cuando cambian filtros/búsqueda
  useEffect(() => {
    const filters = {
      condition: selectedCondition || undefined,
      category: selectedCategory || undefined,
      location: debouncedLocationQuery || undefined,
      available_only: availableOnly || undefined,
    };

    // fetchEquipment viene del hook
    fetchEquipment(filters, debouncedSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, selectedCategory, selectedCondition, debouncedLocationQuery, availableOnly]);

  // Mantener filteredItems sincronizado con items que vienen del servidor
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Verificando autenticación...</div>
      </div>
    );
  }

  // Datos para filtros
  const categories = [...new Set(items.map((item) => item.category))];
  const conditions: SupabaseEquipment['condition'][] = [
    'excellent',
    'good',
    'fair',
    'poor',
    'damaged',
  ];

  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Funciones para íconos y colores según condición
  const getConditionIcon = (condition: SupabaseEquipment['condition']) => {
    switch (condition) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'fair':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'damaged':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getConditionColor = (condition: SupabaseEquipment['condition']) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'good':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'fair':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'poor':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'damaged':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const conditionLabels = {
    excellent: 'Excelente',
    good: 'Bueno',
    fair: 'Regular',
    poor: 'Malo',
    damaged: 'Dañado',
  };

  // Función para agregar nuevo equipo
  const handleAddItem = async (
    formData: Omit<SupabaseEquipment, 'id' | 'created_at' | 'updated_at'>
  ) => {
    await addItem(formData);
    setShowAddModal(false);
  };

  // Función para editar equipo
  const handleEditItem = async (
    formData: Omit<SupabaseEquipment, 'id' | 'created_at' | 'updated_at'>
  ) => {
    if (!selectedItem) return;
    await updateItem(selectedItem.id, formData);
    setShowEditModal(false);
    setSelectedItem(null);
  };

  // Función para eliminar equipo
  const handleDeleteItem = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      await deleteItem(id);
    }
  };

  return (
    <div className="min-h-screen bg-theme-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-2">
            {isAdmin ? 'Gestión de Inventario' : 'Inventario del Tech Lab'}
          </h1>
          <p className="text-theme-secondary">
            {isAdmin
              ? 'Administra el inventario del Tech Lab'
              : isAuthenticated
                ? 'Consulta el inventario y solicita préstamos de equipos'
                : 'Explora el inventario de equipos disponibles en el Tech Lab'}
          </p>
          {!isAdmin && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                {isAuthenticated ? (
                  <>
                    <strong>Modo Usuario:</strong> Puedes ver detalles de
                    equipos y solicitar préstamos. Solo los administradores
                    pueden modificar el inventario.
                  </>
                ) : (
                  <>
                    <strong>Modo Visitante:</strong> Puedes explorar el
                    inventario.{' '}
                    <button
                      onClick={handleLoginRedirect}
                      className="underline hover:text-blue-300 cursor-pointer"
                    >
                      Inicia sesión
                    </button>{' '}
                    para solicitar préstamos de equipos.
                  </>
                )}
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
                  placeholder="Buscar equipos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    title="Limpiar búsqueda"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-theme-secondary hover:text-theme-text"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) =>
                  setSelectedCondition(
                    e.target.value as SupabaseEquipment['condition'] | ''
                  )
                }
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todas las condiciones</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {conditionLabels[condition]}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Agregar - Solo para administradores */}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-neon-pink to-bright-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Agregar Equipo
              </button>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-theme-text">
                {items.length}
              </div>
              <div className="text-sm text-theme-secondary">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {getAvailableItems().length}
              </div>
              <div className="text-sm text-theme-secondary">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {getUnavailableItems().length}
              </div>
              <div className="text-sm text-theme-secondary">No Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filterByCondition('damaged').length}
              </div>
              <div className="text-sm text-theme-secondary">Dañados</div>
            </div>
          </div>
        </div>

        {/* Lista de Equipos */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center text-theme-secondary">
              Cargando inventario...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-theme-secondary py-8">
              {searchQuery || selectedCategory || selectedCondition
                ? 'No se encontraron equipos con los filtros aplicados.'
                : 'No hay equipos en el inventario.'}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-theme-card border border-theme-border rounded-lg p-4 hover:border-theme-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-theme-accent" />
                      <h3 className="text-lg font-semibold text-theme-text">
                        {item.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getConditionColor(item.condition)}`}
                      >
                        {getConditionIcon(item.condition)}
                        {conditionLabels[item.condition]}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-theme-secondary">Categoría:</span>
                        <div className="text-theme-text font-medium">
                          {item.category}
                        </div>
                      </div>
                      <div>
                        <span className="text-theme-secondary">Cantidad:</span>
                        <div className="text-theme-text font-medium">
                          {item.available_quantity}/{item.quantity}
                        </div>
                      </div>
                      <div>
                        <span className="text-theme-secondary">Ubicación:</span>
                        <div className="text-theme-text font-medium">
                          {item.location || 'No especificada'}
                        </div>
                      </div>
                      <div>
                        <span className="text-theme-secondary">Marca:</span>
                        <div className="text-theme-text font-medium">
                          {item.brand || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {/* Botón Ver - Todos los usuarios */}
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowViewModal(true);
                      }}
                      className="p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Botón Pedir Prestado - Solo usuarios autenticados no admin */}
                    {isAuthenticated &&
                      !isAdmin &&
                      item.available_quantity > 0 &&
                      item.is_loanable && (
                        <button
                          onClick={() => {
                            // TODO: Implementar funcionalidad de préstamo
                            alert('Funcionalidad de préstamo en desarrollo');
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Pedir prestado"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}

                    {/* Botón Login para visitantes */}
                    {!isAuthenticated &&
                      item.available_quantity > 0 &&
                      item.is_loanable && (
                        <button
                          onClick={handleLoginRedirect}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                          title="Inicia sesión para solicitar préstamo"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}

                    {/* Botones Editar y Eliminar - Solo administradores */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-accent/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal para Ver Detalles */}
        {showViewModal && selectedItem && (
          <ViewItemModal
            item={selectedItem}
            onClose={() => {
              setShowViewModal(false);
              setSelectedItem(null);
            }}
          />
        )}

        {/* Modal para Agregar */}
        {showAddModal && (
          <AddItemModal
            onAdd={handleAddItem}
            onClose={() => setShowAddModal(false)}
          />
        )}

        {/* Modal para Editar */}
        {showEditModal && selectedItem && (
          <EditItemModal
            item={selectedItem}
            onEdit={handleEditItem}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
          />
        )}
      </main>
    </div>
  );
}

// Modal para ver detalles
function ViewItemModal({
  item,
  onClose,
}: {
  item: SupabaseEquipment;
  onClose: () => void;
}) {
  const getConditionIcon = (condition: SupabaseEquipment['condition']) => {
    switch (condition) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'fair':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'damaged':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const conditionLabels = {
    excellent: 'Excelente',
    good: 'Bueno',
    fair: 'Regular',
    poor: 'Malo',
    damaged: 'Dañado',
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-theme-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-theme-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-text">
            Detalles del Equipo
          </h2>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-text"
          >
            ×
          </button>
        </div>

        {item.image_url && (
          <div className="mb-6">
            <Image
              src={item.image_url}
              alt={item.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-theme-text mb-2">
              {item.name}
            </h3>
            <div className="flex items-center gap-2">
              {getConditionIcon(item.condition)}
              <span className="text-theme-secondary">
                {conditionLabels[item.condition]}
              </span>
            </div>
          </div>

          {item.description && (
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Descripción
              </label>
              <p className="text-theme-text">{item.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Categoría
              </label>
              <p className="text-theme-text">{item.category}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Disponibilidad
              </label>
              <p className="text-theme-text">
                {item.available_quantity} de {item.quantity} disponibles
              </p>
            </div>

            {item.brand && (
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1">
                  Marca
                </label>
                <p className="text-theme-text">{item.brand}</p>
              </div>
            )}

            {item.model && (
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1">
                  Modelo
                </label>
                <p className="text-theme-text">{item.model}</p>
              </div>
            )}

            {item.serial_number && (
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1">
                  Número de Serie
                </label>
                <p className="text-theme-text">{item.serial_number}</p>
              </div>
            )}

            {item.location && (
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1">
                  Ubicación
                </label>
                <p className="text-theme-text">{item.location}</p>
              </div>
            )}

            {item.purchase_date && (
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1">
                  Fecha de Compra
                </label>
                <p className="text-theme-text">{item.purchase_date}</p>
              </div>
            )}

            {item.purchase_price && (
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1">
                  Precio de Compra
                </label>
                <p className="text-theme-text">${item.purchase_price}</p>
              </div>
            )}
          </div>

          {item.specifications && (
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Especificaciones
              </label>
              <pre className="bg-theme-background p-3 rounded text-sm text-theme-text whitespace-pre-wrap">
                {typeof item.specifications === 'string'
                  ? item.specifications
                  : JSON.stringify(item.specifications, null, 2)}
              </pre>
            </div>
          )}

          {item.notes && (
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Notas
              </label>
              <p className="text-theme-text">{item.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Modal para agregar nuevo equipo
function AddItemModal({
  onAdd,
  onClose,
}: {
  onAdd: (
    item: Omit<SupabaseEquipment, 'id' | 'created_at' | 'updated_at'>
  ) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: 1,
    available_quantity: 1,
    condition: 'good' as SupabaseEquipment['condition'],
    location: '',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    purchase_price: 0,
    specifications: '',
    image_url: '',
    notes: '',
    is_loanable: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const equipmentData: Omit<
      SupabaseEquipment,
      'id' | 'created_at' | 'updated_at'
    > = {
      name: formData.name,
      category: formData.category,
      description: formData.description || undefined,
      quantity: formData.quantity,
      available_quantity: formData.available_quantity,
      condition: formData.condition,
      location: formData.location || undefined,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      serial_number: formData.serial_number || undefined,
      purchase_date: formData.purchase_date || undefined,
      purchase_price: formData.purchase_price || undefined,
      specifications: formData.specifications || null,
      image_url: formData.image_url || undefined,
      notes: formData.notes || undefined,
      is_loanable: formData.is_loanable,
    };

    onAdd(equipmentData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-theme-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-theme-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-text">
            Agregar Nuevo Equipo
          </h2>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-text"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos del formulario */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Cantidad Total *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                    available_quantity: Math.min(
                      formData.available_quantity,
                      parseInt(e.target.value)
                    ),
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Cantidad Disponible *
              </label>
              <input
                type="number"
                required
                min="0"
                max={formData.quantity}
                value={formData.available_quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available_quantity: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Condición *
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as SupabaseEquipment['condition'],
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="excellent">Excelente</option>
                <option value="good">Bueno</option>
                <option value="fair">Regular</option>
                <option value="poor">Malo</option>
                <option value="damaged">Dañado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Marca
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Modelo
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Número de Serie
              </label>
              <input
                type="text"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Fecha de Compra
              </label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) =>
                  setFormData({ ...formData, purchase_date: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Precio de Compra
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.purchase_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchase_price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">
              URL de Imagen
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">
              Especificaciones (JSON)
            </label>
            <textarea
              value={formData.specifications}
              onChange={(e) =>
                setFormData({ ...formData, specifications: e.target.value })
              }
              rows={3}
              placeholder='{"campo": "valor", "otro_campo": "otro_valor"}'
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_loanable"
              checked={formData.is_loanable}
              onChange={(e) =>
                setFormData({ ...formData, is_loanable: e.target.checked })
              }
              className="rounded border-theme-border"
            />
            <label
              htmlFor="is_loanable"
              className="text-sm text-theme-secondary"
            >
              Disponible para préstamo
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-neon-pink to-bright-blue text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Agregar Equipo
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-theme-border rounded-lg text-theme-text hover:bg-theme-accent/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal para editar equipo (similar al modal de agregar pero con datos prellenados)
function EditItemModal({
  item,
  onEdit,
  onClose,
}: {
  item: SupabaseEquipment;
  onEdit: (
    item: Omit<SupabaseEquipment, 'id' | 'created_at' | 'updated_at'>
  ) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item.name,
    category: item.category,
    description: item.description || '',
    quantity: item.quantity,
    available_quantity: item.available_quantity,
    condition: item.condition,
    location: item.location || '',
    brand: item.brand || '',
    model: item.model || '',
    serial_number: item.serial_number || '',
    purchase_date: item.purchase_date || '',
    purchase_price: item.purchase_price || 0,
    specifications:
      typeof item.specifications === 'string'
        ? item.specifications
        : JSON.stringify(item.specifications || {}, null, 2),
    image_url: item.image_url || '',
    notes: item.notes || '',
    is_loanable: item.is_loanable,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const equipmentData: Omit<
      SupabaseEquipment,
      'id' | 'created_at' | 'updated_at'
    > = {
      name: formData.name,
      category: formData.category,
      description: formData.description || undefined,
      quantity: formData.quantity,
      available_quantity: formData.available_quantity,
      condition: formData.condition,
      location: formData.location || undefined,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      serial_number: formData.serial_number || undefined,
      purchase_date: formData.purchase_date || undefined,
      purchase_price: formData.purchase_price || undefined,
      specifications: formData.specifications || null,
      image_url: formData.image_url || undefined,
      notes: formData.notes || undefined,
      is_loanable: formData.is_loanable,
    };

    onEdit(equipmentData);
  };

  // El formulario es idéntico al de agregar, pero con datos prellenados
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-theme-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-theme-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-text">Editar Equipo</h2>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-text"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* El mismo formulario que AddItemModal pero con valores iniciales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Cantidad Total *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                    available_quantity: Math.min(
                      formData.available_quantity,
                      parseInt(e.target.value)
                    ),
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Cantidad Disponible *
              </label>
              <input
                type="number"
                required
                min="0"
                max={formData.quantity}
                value={formData.available_quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available_quantity: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1">
                Condición *
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as SupabaseEquipment['condition'],
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="excellent">Excelente</option>
                <option value="good">Bueno</option>
                <option value="fair">Regular</option>
                <option value="poor">Malo</option>
                <option value="damaged">Dañado</option>
              </select>
            </div>
          </div>

          {/* Resto de campos similares al modal de agregar... */}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-neon-pink to-bright-blue text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-theme-border rounded-lg text-theme-text hover:bg-theme-accent/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
