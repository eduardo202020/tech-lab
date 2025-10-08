'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ParkingSpot {
  spot_id: string;
  isOccuppied: boolean;
  position: [number, number, number];
}

interface ParkingData {
  camera_id: string;
  timestamp: string;
  parking_spots: ParkingSpot[];
}

// Datos simulados del estacionamiento con posiciones 3D - Una sola fila A0-A11
const generateParkingSpots = (): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  const totalSpots = 12; // A0 a A11

  for (let i = 0; i < totalSpots; i++) {
    spots.push({
      spot_id: `A${i}`,
      isOccuppied: Math.random() > 0.5, // Ocupación aleatoria inicial
      position: [
        (i - totalSpots / 2) * 4 + 2, // X: espaciado horizontal (4 metros entre espacios)
        0.1, // Y: altura sobre el suelo
        0, // Z: todos en la misma línea
      ],
    });
  }

  return spots;
};

// Componente individual de espacio de parking
function ParkingSpotMesh({
  spot,
  theme,
}: {
  spot: ParkingSpot;
  theme: string;
}) {
  return (
    <group position={spot.position}>
      {/* Superficie del espacio de parking - dimensiones más realistas */}
      <Box args={[3.5, 0.1, 5]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={
            spot.isOccuppied
              ? '#ff4444' // Rojo para ocupado
              : '#44ff44' // Verde para disponible
          }
          transparent
          opacity={0.9}
        />
      </Box>

      {/* Bordes del espacio - líneas blancas de demarcación */}
      <Box args={[3.6, 0.15, 0.1]} position={[0, 0.1, 2.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[3.6, 0.15, 0.1]} position={[0, 0.1, -2.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.1, 0.15, 5]} position={[1.8, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.1, 0.15, 5]} position={[-1.8, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Texto del ID del espacio */}
      <Text
        position={[0, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.0}
        color={theme === 'dark' ? '#ffffff' : '#000000'}
        anchorX="center"
        anchorY="middle"
      >
        {spot.spot_id}
      </Text>

      {/* Vehículo si está ocupado - dimensiones más realistas */}
      {spot.isOccuppied && (
        <Box args={[2.8, 0.6, 4.2]} position={[0, 0.4, 0]}>
          <meshStandardMaterial
            color={`hsl(${Math.random() * 360}, 60%, 45%)`}
          />
        </Box>
      )}
    </group>
  );
}

// Componente del suelo/asfalto - como en la imagen de referencia
function Ground({ theme }: { theme: string }) {
  return (
    <Box args={[60, 0.1, 20]} position={[0, -0.5, 0]}>
      <meshStandardMaterial
        color={theme === 'dark' ? '#2a2a3a' : '#4a4a5a'} // Color de asfalto
      />
    </Box>
  );
}

// Componente principal del visor 3D
function ParkingScene() {
  const { theme } = useTheme();
  const [parkingData, setParkingData] = useState<ParkingData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [screenSize, setScreenSize] = useState<'mobile' | 'desktop'>('desktop');

  // Posiciones de cámara responsivas basadas en las coordenadas proporcionadas
  const getCameraPosition = (): [number, number, number] => {
    return screenSize === 'mobile'
      ? [18.51, 29.34, 14.46] // Dispositivo pequeño
      : [3.77, 19.94, 20]; // Dispositivo grande
  };

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    // Verificar al inicio
    checkScreenSize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Simulación de datos que llegan del sistema Smart Parking
  useEffect(() => {
    const simulateData = () => {
      const newData: ParkingData = {
        camera_id: 'cam_001',
        timestamp: new Date().toISOString(),
        parking_spots: generateParkingSpots().map((spot) => ({
          ...spot,
          // Simular cambios ocasionales de ocupación
          isOccuppied:
            Math.random() > 0.7 ? !spot.isOccuppied : spot.isOccuppied,
        })),
      };

      setParkingData(newData);
      setLastUpdate(new Date());
    };

    // Simular datos iniciales
    simulateData();

    // Actualizar cada 10 segundos para simular cambios en tiempo real
    const interval = setInterval(simulateData, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!parkingData) {
    return null;
  }

  const occupiedCount = parkingData.parking_spots.filter(
    (spot) => spot.isOccuppied
  ).length;
  const totalSpots = parkingData.parking_spots.length;
  const availableCount = totalSpots - occupiedCount;

  return (
    <div className="w-full h-full relative">
      {/* Stats Panel */}
      <div
        className={`absolute z-10 bg-theme-card/90 backdrop-blur-sm rounded-lg border border-theme-border ${
          screenSize === 'mobile'
            ? 'bottom-4 left-2 right-2 p-2 text-xs'
            : 'top-4 left-4 p-3 min-w-[250px]'
        }`}
      >
        <h3
          className={`font-bold text-theme-text mb-2 ${
            screenSize === 'mobile' ? 'text-sm' : 'text-lg'
          }`}
        >
          Estado del Parking
        </h3>
        {screenSize === 'mobile' ? (
          // Layout compacto horizontal para móvil
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-theme-secondary">Total:</span>
                <span className="font-bold text-theme-text">{totalSpots}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded"></div>
                <span className="font-bold text-green-500">
                  {availableCount}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded"></div>
                <span className="font-bold text-red-500">{occupiedCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-theme-secondary">Ocup:</span>
                <span className="font-bold text-theme-text">
                  {Math.round((occupiedCount / totalSpots) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Layout vertical para escritorio
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-theme-secondary">Espacios totales:</span>
              <span className="font-bold text-theme-text">{totalSpots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-secondary">Disponibles:</span>
              <span className="font-bold text-green-500">{availableCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-secondary">Ocupados:</span>
              <span className="font-bold text-red-500">{occupiedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-secondary">Ocupación:</span>
              <span className="font-bold text-theme-text">
                {Math.round((occupiedCount / totalSpots) * 100)}%
              </span>
            </div>
            <div className="text-xs text-theme-secondary mt-3">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div
        className={`absolute z-10 bg-theme-card/90 backdrop-blur-sm rounded-lg p-3 border border-theme-border ${
          screenSize === 'mobile' ? 'top-20 right-2 text-xs' : 'top-4 right-4'
        }`}
      >
        <h4
          className={`font-bold text-theme-text mb-2 ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}
        >
          Leyenda
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-theme-text">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-theme-text">Ocupado</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        key={screenSize} // Re-renderizar cuando cambie el tamaño de pantalla
        camera={{
          position: getCameraPosition(), // Posición responsiva basada en el tamaño de pantalla
          fov: screenSize === 'mobile' ? 75 : 50, // FOV adaptativo
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Iluminación optimizada para vista aérea */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[0, 20, 0]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={100}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          <pointLight position={[-15, 15, 5]} intensity={0.4} color="#ffffff" />
          <pointLight position={[15, 15, 5]} intensity={0.4} color="#ffffff" />

          {/* Elementos de la escena */}
          <Ground theme={theme} />

          {/* Espacios de parking */}
          {parkingData.parking_spots.map((spot) => (
            <ParkingSpotMesh key={spot.spot_id} spot={spot} theme={theme} />
          ))}

          {/* Controles de cámara */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={screenSize === 'mobile' ? 10 : 15}
            maxDistance={screenSize === 'mobile' ? 50 : 45}
            maxPolarAngle={Math.PI / 2.5} // Limitar rotación para mantener vista aérea
            enableDamping={true}
            dampingFactor={0.08}
            target={[0, 0, 0]} // Centrar en el parking
          />
        </Suspense>
      </Canvas>

      {/* Loading indicator */}
      <div
        className={`absolute z-10 ${screenSize === 'mobile' ? 'bottom-2 left-2' : 'bottom-4 left-4'}`}
      ></div>
    </div>
  );
}

export default function SmartParkingViewer() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border border-theme-border bg-theme-card/20 overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-theme-text">Cargando simulación 3D...</div>
          </div>
        }
      >
        <ParkingScene />
      </Suspense>
    </div>
  );
}
