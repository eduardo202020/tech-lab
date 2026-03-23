const AUTH_STORAGE_KEY = 'techlab_mock_auth';
const LEGACY_STORAGE_KEY = 'techlab_supabase_auth';

type AuthStoragePayload = {
  profile?: {
    id?: string;
    username?: string;
    email?: string;
    role?: string;
  };
};

const readStoredAuth = (): AuthStoragePayload | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw =
      localStorage.getItem(AUTH_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthStoragePayload;
  } catch {
    return null;
  }
};

export const createMockAuthHeaders = (headers?: HeadersInit) => {
  const nextHeaders = new Headers(headers);
  const auth = readStoredAuth();
  const profile = auth?.profile;

  if (profile?.id) {
    nextHeaders.set('x-techlab-user-id', profile.id);
  }
  if (profile?.role) {
    nextHeaders.set('x-techlab-user-role', profile.role);
  }
  if (profile?.username) {
    nextHeaders.set('x-techlab-username', profile.username);
  }
  if (profile?.email) {
    nextHeaders.set('x-techlab-user-email', profile.email);
  }

  return nextHeaders;
};
