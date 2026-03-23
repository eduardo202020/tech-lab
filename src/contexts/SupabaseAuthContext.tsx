'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { createMockAuthHeaders } from '@/lib/mockAuthClient';

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type AuthSession = {
  user: AuthUser;
  access_token: string;
  expires_at: number;
};

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: 'visitor' | 'student' | 'researcher' | 'admin';
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: AuthSession | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithGitHub: () => Promise<{ error: Error | null }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ error: Error | null }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'techlab_mock_auth';
const LEGACY_STORAGE_KEY = 'techlab_supabase_auth';

type AuthApiResponse = {
  error?: string;
  profile?: UserProfile;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const saveAuthToStorage = (nextSession: AuthSession, nextProfile: UserProfile) => {
    try {
      if (typeof window === 'undefined') return;
      const payload = {
        session: nextSession,
        profile: nextProfile,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(payload));
    } catch { }
  };

  const clearAuthStorage = () => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch { }
  };

  const createMockSession = (nextUser: AuthUser): AuthSession => {
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    return {
      user: nextUser,
      access_token: `mock-${nextUser.id}-${Date.now()}`,
      expires_at: expiresAt,
    };
  };

  const toAuthUser = useCallback((nextProfile: UserProfile): AuthUser => {
    return {
      id: nextProfile.id,
      email: nextProfile.email,
      user_metadata: {
        full_name: nextProfile.full_name,
        user_name: nextProfile.username,
        avatar_url: nextProfile.avatar_url,
      },
    };
  }, []);

  const applyAuthState = useCallback(
    (nextSession: AuthSession, nextProfile: UserProfile) => {
      setSession(nextSession);
      setUser(nextSession.user);
      setProfile(nextProfile);
      saveAuthToStorage(nextSession, nextProfile);
    },
    []
  );

  const fetchCurrentProfile = useCallback(async () => {
    const response = await fetch('/api/auth/session', {
      headers: createMockAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('No se pudo validar la sesión');
    }

    const json = (await response.json()) as AuthApiResponse;
    if (!json.profile) {
      throw new Error('Perfil no disponible');
    }

    return json.profile;
  }, []);

  const restoreSavedSession = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return false;
      const raw =
        localStorage.getItem(AUTH_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return false;

      const parsed = JSON.parse(raw) as {
        session?: AuthSession;
        profile?: UserProfile;
      };
      if (!parsed?.session?.user || !parsed?.profile) return false;

      try {
        const freshProfile = await fetchCurrentProfile();
        const nextSession = parsed.session;
        applyAuthState(nextSession, freshProfile);
        return true;
      } catch {
        clearAuthStorage();
        setUser(null);
        setSession(null);
        setProfile(null);
        return false;
      }
    } catch {
      return false;
    }
  }, [applyAuthState, fetchCurrentProfile]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        if (!isMounted) return;
        const restored = await restoreSavedSession();
        if (!restored) {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [restoreSavedSession]);

  const signInWithGoogle = async () => {
    try {
      return {
        error: new Error(
          'Autenticación OAuth deshabilitada. Usa usuario/email y contraseña.'
        ),
      };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGitHub = async () => {
    try {
      return {
        error: new Error(
          'Autenticación OAuth deshabilitada. Usa usuario/email y contraseña.'
        ),
      };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (!password) {
        return { error: new Error('Contraseña requerida') };
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      const json = (await response.json().catch(() => ({}))) as AuthApiResponse;
      if (!response.ok || !json.profile) {
        return {
          error: new Error(json.error || 'No se pudo iniciar sesión'),
        };
      }

      const nextUser = toAuthUser(json.profile);
      const nextSession = createMockSession(nextUser);
      applyAuthState(nextSession, json.profile);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: Partial<UserProfile>
  ) => {
    try {
      if (!password || password.length < 6) {
        return {
          error: new Error('La contraseña debe tener al menos 6 caracteres'),
        };
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          userData,
        }),
      });

      const json = (await response.json().catch(() => ({}))) as AuthApiResponse;
      if (!response.ok || !json.profile) {
        return {
          error: new Error(json.error || 'No se pudo registrar usuario'),
        };
      }

      const nextUser = toAuthUser(json.profile);
      const nextSession = createMockSession(nextUser);
      applyAuthState(nextSession, json.profile);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      setSession(null);
      clearAuthStorage();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: createMockAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ updates }),
      });

      const json = (await response.json().catch(() => ({}))) as AuthApiResponse;
      if (!response.ok || !json.profile) {
        return {
          error: new Error(json.error || 'No se pudo actualizar el perfil'),
        };
      }

      setProfile(json.profile);
      if (session) {
        saveAuthToStorage(session, json.profile);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: createMockAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        return {
          error: new Error(json.error || 'No se pudo cambiar la contraseña'),
        };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUp,
    signOut,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useIsAdmin = () => {
  const { profile } = useAuth();
  return profile?.role === 'admin';
};

export const useRequireAuth = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  return { user, loading };
};
