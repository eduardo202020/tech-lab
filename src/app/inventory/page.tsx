'use client';

import { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useInventory, InventoryItem } from '@/contexts/InventoryContext';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Header from '@/components/Header';

export default function InventoryPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { redirectToLogin } = useAuthRedirect();
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
    searchItems,
    filterByStatus,
    isLoading,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    InventoryItem['status'] | ''
  >('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(items);

  // Permitir acceso sin autenticación pero con funcionalidades limitadas
  // No permitir acceso sin autenticación
  // No redirigir automáticamente al login

  // Función para manejar la redirección al login
  const handleLoginRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    redirectToLogin();
  };

  useEffect(() => {
    let result = items;

    if (searchQuery) {
      result = searchItems(searchQuery);
    }

    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (selectedStatus) {
      result = result.filter((item) => item.status === selectedStatus);
    }

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, selectedStatus, items, searchItems]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Verificando autenticación...</div>
      </div>
    );
  }

  const categories = [...new Set(items.map((item) => item.category))];
  const statuses: InventoryItem['status'][] = [
    'available',
    'in-use',
    'maintenance',
    'damaged',
  ];

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-use':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-yellow-500" />;
      case 'damaged':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in-use':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'maintenance':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'damaged':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const statusLabels = {
    available: 'Disponible',
    'in-use': 'En Uso',
    maintenance: 'Mantenimiento',
    damaged: 'Dañado',
  };

  return (
    <div className="min-h-screen bg-theme-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                  className="w-full pl-10 pr-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                />
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
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value as InventoryItem['status'] | ''
                  )
                }
                className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="">Todos los estados</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
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
                {filterByStatus('available').length}
              </div>
              <div className="text-sm text-theme-secondary">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {filterByStatus('in-use').length}
              </div>
              <div className="text-sm text-theme-secondary">En Uso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filterByStatus('maintenance').length}
              </div>
              <div className="text-sm text-theme-secondary">Mantenimiento</div>
            </div>
          </div>
        </div>

        {/* Lista de Equipos */}
        <div className="grid gap-4">
          {filteredItems.map((item) => (
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
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}
                    >
                      {getStatusIcon(item.status)}
                      {statusLabels[item.status]}
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
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <span className="text-theme-secondary">Ubicación:</span>
                      <div className="text-theme-text font-medium">
                        {item.location}
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
                    item.status === 'available' && (
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
                  {!isAuthenticated && item.status === 'available' && (
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
                        onClick={() => deleteItem(item.id)}
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
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-theme-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-theme-text mb-2">
                No se encontraron equipos
              </h3>
              <p className="text-theme-secondary">
                {searchQuery || selectedCategory || selectedStatus
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Agrega tu primer equipo al inventario'}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="bg-theme-card rounded-lg p-6 text-center">
              <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-theme-text">Procesando...</p>
            </div>
          </div>
        )}

        {/* Modales */}
        {/* Modal Agregar - Solo para administradores */}
        {isAdmin && (
          <AddItemModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={addItem}
          />
        )}

        {/* Modal Editar - Solo para administradores */}
        {isAdmin && (
          <EditItemModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            item={selectedItem}
            onUpdate={updateItem}
          />
        )}

        <ViewItemModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          item={selectedItem}
        />
      </main>
    </div>
  );
}

// Modal Components
interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
}

function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    location: '',
    status: 'available' as InventoryItem['status'],
    description: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    lastMaintenance: '',
    assignedTo: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.location) {
      onAdd(formData);
      setFormData({
        name: '',
        category: '',
        quantity: 1,
        location: '',
        status: 'available',
        description: '',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        lastMaintenance: '',
        assignedTo: '',
        notes: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-sm modal-container modal-dark-bg">
        <div className="p-6 border-b modal-header">
          <h2 className="text-xl font-semibold modal-text">
            Agregar Nuevo Equipo
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 modal-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
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
                placeholder="ej. Laptops, Sensores, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Cantidad *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Ubicación *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                placeholder="ej. Lab Principal, Estante A-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as InventoryItem['status'],
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="available">Disponible</option>
                <option value="in-use">En Uso</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="damaged">Dañado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
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

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
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
              <label className="block text-sm font-medium text-theme-text mb-1">
                Número de Serie
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text h-20"
              placeholder="Descripción del equipo..."
            />
          </div>

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
              Agregar Equipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
}

function EditItemModal({
  isOpen,
  onClose,
  item,
  onUpdate,
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    location: '',
    status: 'available' as InventoryItem['status'],
    description: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    lastMaintenance: '',
    assignedTo: '',
    notes: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        location: item.location,
        status: item.status,
        description: item.description || '',
        brand: item.brand || '',
        model: item.model || '',
        serialNumber: item.serialNumber || '',
        purchaseDate: item.purchaseDate || '',
        lastMaintenance: item.lastMaintenance || '',
        assignedTo: item.assignedTo || '',
        notes: item.notes || '',
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item && formData.name && formData.category && formData.location) {
      onUpdate(item.id, formData);
      onClose();
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-sm modal-container modal-dark-bg">
        <div className="p-6 border-b modal-header">
          <h2 className="text-xl font-semibold modal-text">Editar Equipo</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 modal-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Cantidad *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Ubicación *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as InventoryItem['status'],
                  })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              >
                <option value="available">Disponible</option>
                <option value="in-use">En Uso</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="damaged">Dañado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
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

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Asignado a
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                placeholder="Persona o proyecto asignado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Número de Serie
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text h-20"
              placeholder="Notas adicionales..."
            />
          </div>

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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ViewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

function ViewItemModal({ isOpen, onClose, item }: ViewItemModalProps) {
  if (!isOpen || !item) return null;

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-use':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
      case 'damaged':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const statusLabels = {
    available: 'Disponible',
    'in-use': 'En Uso',
    maintenance: 'Mantenimiento',
    damaged: 'Dañado',
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-sm modal-container modal-dark-bg">
        <div className="p-6 border-b modal-header">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold modal-text">{item.name}</h2>
            <div className="flex items-center gap-2">
              {getStatusIcon(item.status)}
              <span className="text-theme-text font-medium">
                {statusLabels[item.status]}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 modal-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-theme-text mb-3">
                Información Básica
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-theme-secondary text-sm">
                    Categoría:
                  </span>
                  <div className="text-theme-text font-medium">
                    {item.category}
                  </div>
                </div>
                <div>
                  <span className="text-theme-secondary text-sm">
                    Cantidad:
                  </span>
                  <div className="text-theme-text font-medium">
                    {item.quantity}
                  </div>
                </div>
                <div>
                  <span className="text-theme-secondary text-sm">
                    Ubicación:
                  </span>
                  <div className="text-theme-text font-medium">
                    {item.location}
                  </div>
                </div>
                {item.brand && (
                  <div>
                    <span className="text-theme-secondary text-sm">Marca:</span>
                    <div className="text-theme-text font-medium">
                      {item.brand}
                    </div>
                  </div>
                )}
                {item.model && (
                  <div>
                    <span className="text-theme-secondary text-sm">
                      Modelo:
                    </span>
                    <div className="text-theme-text font-medium">
                      {item.model}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-theme-text mb-3">
                Detalles Técnicos
              </h3>
              <div className="space-y-3">
                {item.serialNumber && (
                  <div>
                    <span className="text-theme-secondary text-sm">
                      Número de Serie:
                    </span>
                    <div className="text-theme-text font-medium">
                      {item.serialNumber}
                    </div>
                  </div>
                )}
                {item.purchaseDate && (
                  <div>
                    <span className="text-theme-secondary text-sm">
                      Fecha de Compra:
                    </span>
                    <div className="text-theme-text font-medium">
                      {item.purchaseDate}
                    </div>
                  </div>
                )}
                {item.lastMaintenance && (
                  <div>
                    <span className="text-theme-secondary text-sm">
                      Último Mantenimiento:
                    </span>
                    <div className="text-theme-text font-medium">
                      {item.lastMaintenance}
                    </div>
                  </div>
                )}
                {item.assignedTo && (
                  <div>
                    <span className="text-theme-secondary text-sm">
                      Asignado a:
                    </span>
                    <div className="text-theme-text font-medium">
                      {item.assignedTo}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {item.description && (
            <div>
              <h3 className="text-sm font-semibold text-theme-text mb-2">
                Descripción
              </h3>
              <p className="text-theme-secondary">{item.description}</p>
            </div>
          )}

          {item.notes && (
            <div>
              <h3 className="text-sm font-semibold text-theme-text mb-2">
                Notas
              </h3>
              <p className="text-theme-secondary">{item.notes}</p>
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
