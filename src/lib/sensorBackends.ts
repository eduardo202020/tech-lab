const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolveBaseUrl = (envValue: string | undefined, fallback: string) =>
  trimTrailingSlash(envValue?.trim() || fallback);

export const DECLARATIVE_DB_API_BASE_URL = resolveBaseUrl(
  process.env.DECLARATIVE_DB_API_BASE_URL,
  'https://oti-test.jorgeparishuana.dev:4300'
);

export const LORA_DEVICE_ID = process.env.LORA_DEVICE_ID?.trim() || '1102';
