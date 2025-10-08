'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Cpu,
  MapPin,
  Monitor,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react';
import SmartParkingViewer from '@/components/SmartParkingViewer';

interface Technology {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  primaryColor: string;
  description: string;
  about: {
    title: string;
    content: string[];
  };
  features: {
    title: string;
    items: {
      text: string;
      color: string;
    }[];
  };
  projects: {
    title: string;
    description: string;
  }[];
  hasSmartParkingDemo?: boolean;
}

export default function SmartParkingPage() {
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTechnology = async () => {
      try {
        const response = await fetch('/data/technologies.json');
        const data = await response.json();
        const smartParking = data.technologies.find(
          (tech: Technology) => tech.id === 'smart-parking'
        );
        setTechnology(smartParking || null);
      } catch (error) {
        console.error('Error loading Smart Parking technology:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTechnology();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Cargando...</div>
      </div>
    );
  }

  if (!technology) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Tecnología no encontrada</div>
      </div>
    );
  }

  const featureIcons = {
    'Detección en tiempo real': Camera,
    'Algoritmos YOLO': Cpu,
    'Visualización 3D': Monitor,
    'Monitoreo IoT': Zap,
    'App móvil': Smartphone,
    'Seguridad avanzada': Shield,
    Geolocalización: MapPin,
  };

  return (
    <div className="min-h-screen bg-theme-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-theme-card border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/technologies"
              className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver a Tecnologías</span>
            </Link>
            <div className="text-sm text-theme-secondary">
              TechLab • Smart Parking System
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{technology.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-theme-text mb-2">
                {technology.name}
              </h1>
              <p className="text-theme-secondary text-lg">
                {technology.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-theme-accent/20 text-theme-accent rounded-full text-sm font-medium">
              YOLO Detection
            </span>
            <span className="px-3 py-1 bg-theme-accent/20 text-theme-accent rounded-full text-sm font-medium">
              IoT Monitoring
            </span>
            <span className="px-3 py-1 bg-theme-accent/20 text-theme-accent rounded-full text-sm font-medium">
              3D Visualization
            </span>
          </div>
        </div>

        {/* Simulación 3D */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
            <Monitor className="text-theme-accent" size={28} />
            Simulación 3D en Tiempo Real
          </h2>
          <div className="bg-theme-card rounded-lg p-6 border border-theme-border">
            <p className="text-theme-secondary mb-6">
              Explora nuestra simulación interactiva que muestra cómo funciona
              el sistema Smart Parking en tiempo real. Los espacios verdes están
              disponibles, los rojos están ocupados.
            </p>
            <SmartParkingViewer />
          </div>
        </div>

        {/* Grid de Contenido */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Descripción */}
          <div className="space-y-6">
            <div className="bg-theme-card rounded-lg p-6 border border-theme-border">
              <h2 className="text-2xl font-bold text-theme-text mb-4">
                {technology.about.title}
              </h2>
              <div className="space-y-4">
                {technology.about.content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-theme-secondary leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Características */}
            <div className="bg-theme-card rounded-lg p-6 border border-theme-border">
              <h2 className="text-2xl font-bold text-theme-text mb-4">
                {technology.features.title}
              </h2>
              <div className="space-y-4">
                {technology.features.items.map((feature, index) => {
                  const IconComponent =
                    featureIcons[feature.text as keyof typeof featureIcons] ||
                    Zap;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <IconComponent
                        className="text-theme-accent mt-0.5 flex-shrink-0"
                        size={20}
                      />
                      <span className="text-theme-secondary">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Proyectos */}
          <div className="space-y-6">
            <div className="bg-theme-card rounded-lg p-6 border border-theme-border">
              <h2 className="text-2xl font-bold text-theme-text mb-4">
                Proyectos Implementados
              </h2>
              <div className="space-y-3">
                {technology.projects.map((project, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 bg-theme-background rounded-lg"
                  >
                    <h3 className="font-semibold text-theme-text">
                      {project.title}
                    </h3>
                    <p className="text-theme-secondary text-sm">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Información Técnica */}
            <div className="bg-theme-card rounded-lg p-6 border border-theme-border">
              <h2 className="text-2xl font-bold text-theme-text mb-4">
                Especificaciones Técnicas
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-theme-secondary">Tipo:</span>
                  <span className="text-theme-text font-medium">
                    Sistema de Monitoreo Inteligente
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-theme-secondary">Dificultad:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                    Avanzado
                  </span>
                </div>
                <div className="pt-4 border-t border-theme-border">
                  <h3 className="text-lg font-semibold text-theme-text mb-2">
                    Tecnologías Utilizadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                      YOLO v8
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                      Three.js
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                      IoT Sensors
                    </span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm">
                      React Native
                    </span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">
                      Node.js
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-theme-accent/20 to-theme-secondary/20 rounded-lg p-8 border border-theme-border">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-theme-text mb-4">
              ¿Interesado en implementar Smart Parking?
            </h2>
            <p className="text-theme-secondary mb-6 max-w-2xl mx-auto">
              Nuestro sistema de gestión inteligente de estacionamientos puede
              revolucionar la experiencia de parking en tu ciudad o empresa.
              Contáctanos para más información.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-theme-accent text-white rounded-lg hover:bg-theme-accent/80 transition-colors font-medium"
              >
                Solicitar Demo
              </Link>
              <Link
                href="/technologies"
                className="px-6 py-3 border border-theme-border text-theme-text rounded-lg hover:bg-theme-card transition-colors font-medium"
              >
                Ver Más Tecnologías
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
