'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ParkingSpot {
  spot_id: string;
  isOccupied: boolean;
  position: [number, number, number];
}

interface ParkingData {
  camera_id: string;
  timestamp: string;
  parking_spots: ParkingSpot[];
  people_count?: number | null;
}

interface ApiParkingResponse {
  cameraId: string;
  timestamp: string;
  spots: Array<{ id: string; occupied: boolean; index: number }>;
  layout: [number, number];
  peopleCount?: number | null;
}

type ViewerProps = {
  camId?: string;
  counterCamId?: string;
  refreshMs?: number;
};

const colorFromId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 45%)`;
};

const buildPositions = (
  spots: Array<{ id: string; occupied: boolean; index: number }>,
  layout: [number, number]
): ParkingSpot[] => {
  const [rowsInput, colsInput] = layout;
  const cols = colsInput && colsInput > 0 ? colsInput : Math.max(1, Math.ceil(Math.sqrt(spots.length)));
  const rows = rowsInput && rowsInput > 0 ? rowsInput : Math.max(1, Math.ceil(spots.length / cols));

  return spots.map((spot, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const x = (col - (cols - 1) / 2) * 4;
    const z = ((rows - 1) / 2 - row) * 6;

    return {
      spot_id: spot.id,
      isOccupied: spot.occupied,
      position: [x, 0.1, z],
    };
  });
};

function ParkingSpotMesh({ spot, theme }: { spot: ParkingSpot; theme: string }) {
  return (
    <group position={spot.position}>
      <Box args={[3.5, 0.1, 5]} position={[0, 0, 0]}>
        <meshStandardMaterial color={spot.isOccupied ? '#ff4444' : '#44ff44'} transparent opacity={0.9} />
      </Box>

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

      {spot.isOccupied && (
        <Box args={[2.8, 0.6, 4.2]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color={colorFromId(spot.spot_id)} />
        </Box>
      )}
    </group>
  );
}

function Ground({ theme }: { theme: string }) {
  return (
    <Box args={[60, 0.1, 20]} position={[0, -0.5, 0]}>
      <meshStandardMaterial color={theme === 'dark' ? '#2a2a3a' : '#4a4a5a'} />
    </Box>
  );
}

function ParkingScene({ camId = 'smart_parking:A1', counterCamId = 'cuenta_personas:A1', refreshMs = 5000 }: ViewerProps) {
  const { theme } = useTheme();
  const [parkingData, setParkingData] = useState<ParkingData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [screenSize, setScreenSize] = useState<'mobile' | 'desktop'>('desktop');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getCameraPosition = (): [number, number, number] => (screenSize === 'mobile' ? [18.51, 29.34, 14.46] : [3.77, 19.94, 20]);

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ camId, counterCamId });
      const res = await fetch(`/api/smart-parking?${params.toString()}`, { cache: 'no-store' });

      if (!res.ok) {
        throw new Error('No se pudo obtener datos del estacionamiento');
      }

      const json: ApiParkingResponse = await res.json();
      const spotsWithPositions = buildPositions(json.spots, json.layout);

      setParkingData({
        camera_id: json.cameraId,
        timestamp: json.timestamp,
        parking_spots: spotsWithPositions,
        people_count: json.peopleCount ?? null,
      });
      setLastUpdate(new Date(json.timestamp));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [camId, counterCamId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshMs);
    return () => clearInterval(interval);
  }, [fetchData, refreshMs]);

  const stats = useMemo(() => {
    if (!parkingData) return { occupied: 0, total: 0, available: 0, percent: 0 };
    const occupied = parkingData.parking_spots.filter((s) => s.isOccupied).length;
    const total = parkingData.parking_spots.length;
    const available = total - occupied;
    const percent = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { occupied, total, available, percent };
  }, [parkingData]);

  if (loading && !parkingData) {
    return <div className="w-full h-full flex items-center justify-center text-theme-secondary">Cargando datos en tiempo real...</div>;
  }

  if (!parkingData) {
    return <div className="w-full h-full flex items-center justify-center text-theme-secondary">{error || 'Sin datos disponibles'}</div>;
  }

  return (
    <div className="w-full h-full relative">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow">
          {error}
        </div>
      )}

      <div
        className={`absolute z-10 bg-theme-card/90 backdrop-blur-sm rounded-lg border border-theme-border ${
          screenSize === 'mobile' ? 'bottom-4 left-2 right-2 p-2 text-xs' : 'top-4 left-4 p-3 min-w-[260px]'
        }`}
      >
        <h3 className={`font-bold text-theme-text mb-2 ${screenSize === 'mobile' ? 'text-sm' : 'text-lg'}`}>Estado del Parking</h3>

        {screenSize === 'mobile' ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-theme-secondary">Total:</span>
                <span className="font-bold text-theme-text">{stats.total}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded"></div>
                <span className="font-bold text-green-500">{stats.available}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded"></div>
                <span className="font-bold text-red-500">{stats.occupied}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-theme-secondary">Ocup:</span>
                <span className="font-bold text-theme-text">{stats.percent}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-theme-secondary">Espacios totales:</span>
              <span className="font-bold text-theme-text">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-secondary">Disponibles:</span>
              <span className="font-bold text-green-500">{stats.available}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-secondary">Ocupados:</span>
              <span className="font-bold text-red-500">{stats.occupied}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-secondary">Ocupación:</span>
              <span className="font-bold text-theme-text">{stats.percent}%</span>
            </div>
            {parkingData.people_count !== undefined && parkingData.people_count !== null && (
              <div className="flex justify-between">
                <span className="text-theme-secondary">Aforo (personas):</span>
                <span className="font-bold text-theme-text">{parkingData.people_count}</span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-theme-secondary mt-3 space-y-1">
          <div>Cámara: {parkingData.camera_id}</div>
          <div>Última actualización: {lastUpdate ? lastUpdate.toLocaleTimeString() : '—'}</div>
        </div>
      </div>

      <div
        className={`absolute z-10 bg-theme-card/90 backdrop-blur-sm rounded-lg p-3 border border-theme-border ${
          screenSize === 'mobile' ? 'top-20 right-2 text-xs' : 'top-4 right-4'
        }`}
      >
        <h4 className={`font-bold text-theme-text mb-2 ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>Leyenda</h4>
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

      <Canvas key={screenSize} camera={{ position: getCameraPosition(), fov: screenSize === 'mobile' ? 75 : 50 }} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
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

          <Ground theme={theme} />

          {parkingData.parking_spots.map((spot) => (
            <ParkingSpotMesh key={spot.spot_id} spot={spot} theme={theme} />
          ))}

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={screenSize === 'mobile' ? 10 : 15}
            maxDistance={screenSize === 'mobile' ? 50 : 45}
            maxPolarAngle={Math.PI / 2.5}
            enableDamping
            dampingFactor={0.08}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function SmartParkingViewer({ camId, counterCamId, refreshMs }: ViewerProps) {
  return (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border border-theme-border bg-theme-card/20 overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-theme-text">Cargando simulación 3D...</div>
          </div>
        }
      >
        <ParkingScene camId={camId} counterCamId={counterCamId} refreshMs={refreshMs} />
      </Suspense>
    </div>
  );
}
