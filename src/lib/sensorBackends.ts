const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolveBaseUrl = (envValue: string | undefined, fallback: string) =>
  trimTrailingSlash(envValue?.trim() || fallback);

const parseCsv = (envValue: string | undefined, fallback: string[]) => {
  const raw = envValue?.trim();
  if (!raw) return fallback;

  const values = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length > 0 ? values : fallback;
};

export type SensorDeviceType = 'smart_parking' | 'people_counter' | 'lora';

// Punto unico de configuracion manual:
// cambia aqui los fallbacks hardcodeados si no quieres depender de variables de entorno.
const DEFAULT_DECLARATIVE_DB_API_BASE_URL = 'https://oti-test.jorgeparishuana.dev:4300';

export const DECLARATIVE_DB_API_BASE_URL = resolveBaseUrl(
  process.env.DECLARATIVE_DB_API_BASE_URL,
  DEFAULT_DECLARATIVE_DB_API_BASE_URL
);

export const SENSOR_BACKEND_BASE_URLS: Record<SensorDeviceType, string> = {
  smart_parking: resolveBaseUrl(
    process.env.SMART_PARKING_API_BASE_URL,
    DECLARATIVE_DB_API_BASE_URL
  ),
  people_counter: resolveBaseUrl(
    process.env.PEOPLE_COUNTER_API_BASE_URL,
    DECLARATIVE_DB_API_BASE_URL
  ),
  lora: resolveBaseUrl(process.env.LORA_API_BASE_URL, DECLARATIVE_DB_API_BASE_URL),
};

export const DEFAULT_DEVICE_IDENTIFIERS: Record<SensorDeviceType, string> = {
  smart_parking: process.env.DEFAULT_SMART_PARKING_CAM_ID?.trim() || 'smart_parking:A1',
  people_counter:
    process.env.DEFAULT_PEOPLE_COUNTER_CAM_ID?.trim() || 'cuenta_personas:A1',
  lora: process.env.LORA_DEVICE_ID?.trim() || '1102',
};

export const DEVICE_IDENTIFIER_EXAMPLES: Record<SensorDeviceType, string> = {
  smart_parking: 'smart_parking:A1',
  people_counter: 'cuenta_personas:A1',
  lora: '1102',
};

export const SMART_PARKING_CAMERA_IDS = parseCsv(process.env.SMART_PARKING_CAMERA_IDS, [
  'smart_parking:A1',
  'smart_parking:A2',
]);
