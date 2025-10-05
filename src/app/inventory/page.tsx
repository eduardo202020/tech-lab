'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Equipment {
  id: string;
  name: string;
  category: string;
  status: 'Disponible' | 'En Préstamo';
  brand: string;
  imageUrl: string;
}

const equipmentData: Equipment[] = [
  {
    id: '1',
    name: 'Microscopio Avanzado',
    category: 'Microscopía',
    status: 'Disponible',
    brand: 'Nikon',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMwOrDUmgLzAORBcJtc4FPdhlv_TIa6uI4Y0bpsZejlcre5uSCTWjmGPN17Sz7ENJkhQCsbD-8BANQjbvBEMw7jz_rTtZxIRLALDdOKTPRxRH-GGJQ1p-AtiBf1i7KHNPnUOQDaLGuWNg1k4SnS_f3TOYKMc8vBUytYD7TnzWIbuO6-jzRsbE68-JvBOH8-OQIp4f_JN4C2HzSTteSOjttKwSdCIEVzxPNR0G7DCVSWAvLNNewolWMN355V5U4kZPcPCpL131tXowC',
  },
  {
    id: '2',
    name: 'Espectrofotómetro',
    category: 'Análisis',
    status: 'En Préstamo',
    brand: 'Thermo Fisher',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Jg59L5Y-hfAhp4Dy6_h9zvWklQcdTjfLOWoZhjXdtgY8bYw7ejqR0dhXplLLTN3U3DX7iAS3wiqZ9G02fmGC5z0TvHnqwNJ4TWpGTMR2EDI44LxJF-bpkAuBY6YNq_AUOPOLHZBWLDzuIqUtPuO-IlMvyxM7adt1DOvB4tuvxk3WaKF0w37V3JnjqQpYUa9lX-eqq36yeXgttQ47DxYhABTJwpDduFhoWMj1M5bOy77Ylg3DfL6quVjKjFKkGXZI8PDUlIxwgY2n',
  },
  {
    id: '3',
    name: 'Centrífuga',
    category: 'Preparación',
    status: 'Disponible',
    brand: 'Eppendorf',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDiv7bI6QKlRUT7YO-E4Q7dKsLhc70zQyxkm8SRIx4q9rwCRVKUZDSULfPBgYqekKFDKPUSnrEJetB2OMOJXN2LHMYruhdJvyJIA4qXwitE_xHf_tXwywO2QpUjwFq3t-Bm7yvrbEFXJdVRjrzxP00O2RIfaPTY28t3j47gRE8dfMY8P7NE9BmRo9blPG83uPH0Ez_RKzuW3__OK__8P2GmQu_Z5WFZwBpGpP3UK4QvtJ7VeBuPMKyEKWAOpkU8BDd7CD7o8hrXA7AA',
  },
  {
    id: '4',
    name: 'Autoclave Digital',
    category: 'Esterilización',
    status: 'Disponible',
    brand: 'Tuttnauer',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAS9_joCX9hP2_yXEqrERYnFxmCg2Y54tfH7B16vwJ6e2-lHkMo6u_KDgS-uZbjQQejbGrWTKxxJMG4GfuAxaTxfFfLhzcj-SXvJS1IGk-rUbWQXuw8EL4Z4xXtomJIVAZNr04nl-LxYDOgG5uFwno25WpDAoKr2hUj9JTYXKyGDx3jdvMr-4GhLRNDB-ZB6RYDo7-k2RFWF6Pcti1PcgipXexOaII2oOyQLPewARs-fEvSR6DPQiYMA0-_LNme3faBGmgivwW3iPYa',
  },
  {
    id: '5',
    name: 'Balanza Analítica',
    category: 'Medición',
    status: 'Disponible',
    brand: 'Sartorius',
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
  },
  {
    id: '6',
    name: 'PCR Thermal Cycler',
    category: 'Biología Molecular',
    status: 'En Préstamo',
    brand: 'Bio-Rad',
    imageUrl:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [brandFilter, setBrandFilter] = useState('Todas');

  const filteredEquipment = equipmentData.filter((equipment) => {
    const matchesSearch = equipment.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'Todos' || equipment.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'Todas' || equipment.category === categoryFilter;
    const matchesBrand =
      brandFilter === 'Todas' || equipment.brand === brandFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
  });

  const categories = Array.from(
    new Set(equipmentData.map((eq) => eq.category))
  );
  const brands = Array.from(new Set(equipmentData.map((eq) => eq.brand)));

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-text font-roboto">
      <Header />

      <main className="flex-1 px-4 py-8 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold font-montserrat text-theme-text">
              Inventario de Equipos
            </h1>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-theme-border bg-theme-card py-2 pl-10 pr-4 text-sm text-theme-text placeholder-theme-secondary focus:border-bright-blue focus:ring-bright-blue"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-theme-border bg-theme-card text-sm text-theme-text focus:border-bright-blue focus:ring-bright-blue"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Disponible">Disponible</option>
              <option value="En Préstamo">En Préstamo</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-theme-border bg-theme-card text-sm text-theme-text focus:border-bright-blue focus:ring-bright-blue"
            >
              <option value="Todas">Categoría: Todas</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Brand Filter */}
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="rounded-lg border border-theme-border bg-theme-card text-sm text-theme-text focus:border-bright-blue focus:ring-bright-blue"
            >
              <option value="Todas">Marca: Todas</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredEquipment.map((equipment) => (
              <Link
                key={equipment.id}
                href={`/equipment/${equipment.id}`}
                className="group relative overflow-hidden rounded-lg bg-theme-card shadow-sm transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-neon-pink hover:shadow-neon-pink/20"
              >
                {/* Equipment Image */}
                <div className="aspect-square w-full overflow-hidden">
                  <div className="h-full w-full relative">
                    <Image
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Equipment Info */}
                <div className="p-4">
                  <h3 className="font-bold font-montserrat text-theme-text">
                    {equipment.name}
                  </h3>
                  <p className="text-sm text-theme-secondary font-poppins">
                    {equipment.category}
                  </p>

                  {/* Status */}
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        equipment.status === 'Disponible'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <p
                      className={`text-sm font-medium font-poppins ${
                        equipment.status === 'Disponible'
                          ? 'text-green-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {equipment.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-light-gray/70 text-lg">
                No se encontraron equipos que coincidan con los filtros.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
