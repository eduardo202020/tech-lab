'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type LocationPayload = {
    lat?: number | string;
    lng?: number | string;
    lon?: number | string;
    latitude?: number | string;
    longitude?: number | string;
};

const parseCoordinate = (value: string | null): number | null => {
    if (!value) return null;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return null;
    return parsed;
};

const inRange = (lat: number, lng: number) =>
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

export default function MapsPage() {
    const searchParams = useSearchParams();

    const initialCoordinates = useMemo(() => {
        const lat =
            parseCoordinate(searchParams.get('lat')) ??
            parseCoordinate(searchParams.get('latitude'));

        const lng =
            parseCoordinate(searchParams.get('lng')) ??
            parseCoordinate(searchParams.get('lon')) ??
            parseCoordinate(searchParams.get('longitude'));

        if (lat === null || lng === null || !inRange(lat, lng)) {
            return null;
        }

        return { lat, lng };
    }, [searchParams]);

    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
        initialCoordinates
    );
    const [locationSource, setLocationSource] = useState<'url' | 'api' | 'device' | 'message' | null>(
        initialCoordinates ? 'url' : null
    );
    const [isLoadingApi, setIsLoadingApi] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const resolveLocation = async () => {
            setLocationError(null);

            if (initialCoordinates) {
                setCoordinates(initialCoordinates);
                setLocationSource('url');
                return;
            }

            setIsLoadingApi(true);
            try {
                const response = await fetch('/api/maps-location', { cache: 'no-store' });
                if (response.ok) {
                    const data = (await response.json()) as {
                        location?: { lat?: number; lng?: number };
                    };

                    const lat = Number(data.location?.lat);
                    const lng = Number(data.location?.lng);

                    if (isValidNumber(lat) && isValidNumber(lng) && inRange(lat, lng)) {
                        if (!cancelled) {
                            setCoordinates({ lat, lng });
                            setLocationSource('api');
                        }
                        return;
                    }
                }
            } catch {
            } finally {
                if (!cancelled) setIsLoadingApi(false);
            }

            if (!('geolocation' in navigator)) {
                if (!cancelled) {
                    setLocationError('Tu navegador no soporta geolocalización.');
                }
                return;
            }

            if (!cancelled) {
                setIsLocating(true);
                setLocationError(null);
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    if (!inRange(lat, lng)) {
                        if (!cancelled) {
                            setLocationError('Se obtuvo una ubicación inválida del dispositivo.');
                            setIsLocating(false);
                        }
                        return;
                    }

                    if (!cancelled) {
                        setCoordinates({ lat, lng });
                        setLocationSource('device');
                        setIsLocating(false);
                    }
                },
                (error) => {
                    const errorMessage =
                        error.code === error.PERMISSION_DENIED
                            ? 'Permiso de ubicación denegado. Habilítalo para ver tu ubicación actual.'
                            : 'No se pudo obtener la ubicación actual del dispositivo.';

                    if (!cancelled) {
                        setLocationError(errorMessage);
                        setIsLocating(false);
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                }
            );
        };

        void resolveLocation();

        return () => {
            cancelled = true;
        };
    }, [initialCoordinates]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent<LocationPayload>) => {
            const payload = event.data;

            if (!payload || typeof payload !== 'object') return;

            const lat = parseCoordinate(
                String(payload.lat ?? payload.latitude ?? '') || null
            );
            const lng = parseCoordinate(
                String(payload.lng ?? payload.lon ?? payload.longitude ?? '') || null
            );

            if (lat === null || lng === null || !inRange(lat, lng)) return;

            setCoordinates({ lat, lng });
            setLocationSource('message');
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const mapUrl = useMemo(() => {
        if (!coordinates) return null;

        const delta = 0.01;
        const minLng = coordinates.lng - delta;
        const minLat = coordinates.lat - delta;
        const maxLng = coordinates.lng + delta;
        const maxLat = coordinates.lat + delta;

        return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`;
    }, [coordinates]);

    const externalMapUrl = useMemo(() => {
        if (!coordinates) return null;
        return `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=16/${coordinates.lat}/${coordinates.lng}`;
    }, [coordinates]);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-text font-roboto">
            <Header />

            <main className="flex flex-1 flex-col items-center py-10 pt-36 md:py-16 md:pt-40">
                <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight font-montserrat text-theme-text sm:text-5xl">
                            Mapa de Ubicación
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-theme-secondary font-poppins">
                            Esta página recibe coordenadas desde la app y marca el punto exacto
                            en el mapa.
                        </p>
                    </div>

                    <div className="mt-10 rounded-lg border border-theme-border bg-theme-card p-4 sm:p-6">
                        {coordinates && mapUrl ? (
                            <>
                                <p className="mb-4 text-sm text-theme-secondary font-poppins">
                                    Coordenadas mostradas: <strong>lat</strong> {coordinates.lat},{' '}
                                    <strong>lng</strong> {coordinates.lng}
                                    {locationSource ? ` · fuente: ${locationSource}` : ''}
                                </p>

                                <div className="overflow-hidden rounded-lg border border-theme-border">
                                    <iframe
                                        title="Mapa de ubicación"
                                        src={mapUrl}
                                        className="h-[420px] w-full"
                                        loading="lazy"
                                    />
                                </div>

                                {externalMapUrl ? (
                                    <a
                                        href={externalMapUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 inline-flex rounded-md bg-bright-blue px-4 py-2 text-sm font-semibold text-dark-bg transition-colors hover:bg-white font-poppins"
                                    >
                                        Abrir en OpenStreetMap
                                    </a>
                                ) : null}
                            </>
                        ) : (
                            <div className="rounded-md border border-theme-border p-4 text-sm text-theme-secondary font-poppins">
                                {isLocating
                                    ? 'Obteniendo ubicación actual del dispositivo...'
                                    : isLoadingApi
                                        ? 'Buscando última ubicación recibida desde la API...'
                                        : locationError ??
                                        'No se recibieron coordenadas válidas. Envía la ubicación en la URL usando ?lat=-12.0464&lng=-77.0428 o permite el acceso a tu ubicación actual.'}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function isValidNumber(value: number) {
    return Number.isFinite(value);
}
