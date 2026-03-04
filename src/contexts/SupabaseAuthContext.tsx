'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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

// Tipo para el perfil de usuario
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

// Tipo para el contexto de autenticación
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'techlab_mock_auth';
const LEGACY_STORAGE_KEY = 'techlab_supabase_auth';
const MOCK_PROFILES_KEY = 'techlab_mock_profiles';

type MockUsersFile = {
  usuarios?: UserProfile[];
  user_profiles?: UserProfile[];
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  const saveProfilesToStorage = (nextProfiles: UserProfile[]) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(nextProfiles));
    } catch { }
  };

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

  const loadProfiles = async (): Promise<UserProfile[]> => {
    let baseProfiles: UserProfile[] = [];
    try {
      const response = await fetch('/mocks/usuarios.json');
      if (response.ok) {
        const json = (await response.json()) as MockUsersFile;
        baseProfiles = (json.usuarios || json.user_profiles || []) as UserProfile[];
      }
    } catch { }

    try {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem(MOCK_PROFILES_KEY);
        if (local) {
          const parsed = JSON.parse(local) as UserProfile[];
          const byId = new Map<string, UserProfile>();
          [...baseProfiles, ...parsed].forEach((item) => byId.set(item.id, item));
          return Array.from(byId.values());
        }
      }
    } catch { }

    return baseProfiles;
  };

  const loadUserProfile = async (userId: string) => {
    const found = profiles.find((item) => item.id === userId) || null;
    if (found) return found;
    const loaded = await loadProfiles();
    setProfiles(loaded);
    return loaded.find((item) => item.id === userId) || null;
  };

  const createUserProfile = async (
    authUser: AuthUser,
    additionalData?: Partial<UserProfile>
  ) => {
    const now = new Date().toISOString();
    const nextProfile: UserProfile = {
      id: authUser.id,
      username:
        additionalData?.username ||
        String(authUser.user_metadata?.user_name || authUser.email?.split('@')[0] || 'usuario'),
      full_name:
        additionalData?.full_name ||
        String(authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Usuario'),
      email: additionalData?.email || authUser.email || '',
      role: (additionalData?.role || 'student') as UserProfile['role'],
      avatar_url:
        additionalData?.avatar_url ||
        (String(authUser.user_metadata?.avatar_url || '') || null),
      bio: additionalData?.bio || null,
      phone: additionalData?.phone || null,
      linkedin_url: additionalData?.linkedin_url || null,
      created_at: now,
      updated_at: now,
    };

    const nextProfiles = [nextProfile, ...profiles.filter((item) => item.id !== nextProfile.id)];
    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles);
    return nextProfile;
  };

  const applyAuthState = (nextSession: AuthSession, nextProfile: UserProfile) => {
    setSession(nextSession);
    setUser(nextSession.user);
    setProfile(nextProfile);
    saveAuthToStorage(nextSession, nextProfile);
  };

  const restoreSavedSession = async () => {
    try {
      if (typeof window === 'undefined') return false;
      const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as {
        session?: AuthSession;
        profile?: UserProfile;
      };
      if (!parsed?.session?.user || !parsed?.profile) return false;
      applyAuthState(parsed.session, parsed.profile);
      return true;
    } catch {
      return false;
    }
  };

  // Inicializar autenticación
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        if (!isMounted) return;

        const loadedProfiles = await loadProfiles();
        if (!isMounted) return;
        setProfiles(loadedProfiles);

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
  }, []);

  // Funciones de autenticación
  const signInWithGoogle = async () => {
    try {
      return {
        error: new Error('Autenticación OAuth deshabilitada en modo mock. Usa email/contraseña.'),
      };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGitHub = async () => {
    try {
      return {
        error: new Error('Autenticación OAuth deshabilitada en modo mock. Usa email/contraseña.'),
      };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (!password) return { error: new Error('Contraseña requerida') };

      const normalized = email.trim().toLowerCase();
      const loadedProfiles = profiles.length ? profiles : await loadProfiles();

      const matchedProfile = loadedProfiles.find(
        (item) =>
          (item.email || '').toLowerCase() === normalized ||
          item.username.toLowerCase() === normalized
      );

      if (!matchedProfile) {
        return { error: new Error('Usuario no encontrado') };
      }

      const nextUser: AuthUser = {
        id: matchedProfile.id,
        email: matchedProfile.email,
        user_metadata: {
          full_name: matchedProfile.full_name,
          user_name: matchedProfile.username,
          avatar_url: matchedProfile.avatar_url,
        },
      };
      const nextSession = createMockSession(nextUser);
      applyAuthState(nextSession, matchedProfile);

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
        return { error: new Error('La contraseña debe tener al menos 6 caracteres') };
      }

      const loadedProfiles = profiles.length ? profiles : await loadProfiles();
      const exists = loadedProfiles.some(
        (item) => (item.email || '').toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        return { error: new Error('El email ya está registrado') };
      }

      const now = new Date().toISOString();
      const nextProfile: UserProfile = {
        id: crypto.randomUUID(),
        username: userData?.username || email.split('@')[0],
        full_name: userData?.full_name || 'Usuario',
        email,
        role: (userData?.role || 'student') as UserProfile['role'],
        avatar_url: userData?.avatar_url || null,
        bio: userData?.bio || null,
        phone: userData?.phone || null,
        linkedin_url: userData?.linkedin_url || null,
        created_at: now,
        updated_at: now,
      };

      const nextProfiles = [nextProfile, ...loadedProfiles.filter((item) => item.id !== nextProfile.id)];
      setProfiles(nextProfiles);
      saveProfilesToStorage(nextProfiles);

      const nextUser: AuthUser = {
        id: nextProfile.id,
        email: nextProfile.email,
        user_metadata: {
          full_name: nextProfile.full_name,
          user_name: nextProfile.username,
          avatar_url: nextProfile.avatar_url,
        },
      };
      const nextSession = createMockSession(nextUser);
      applyAuthState(nextSession, nextProfile);

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

      const currentProfile = profile || (await loadUserProfile(user.id));
      if (!currentProfile) {
        return { error: new Error('Perfil no encontrado') };
      }

      const nextProfile: UserProfile = {
        ...currentProfile,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const nextProfiles = profiles.map((item) =>
        item.id === nextProfile.id ? nextProfile : item
      );
      setProfiles(nextProfiles);
      saveProfilesToStorage(nextProfiles);
      setProfile(nextProfile);

      if (session) {
        saveAuthToStorage(session, nextProfile);
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

// Helper hook para verificar si el usuario es admin
export const useIsAdmin = () => {
  const { profile } = useAuth();
  return profile?.role === 'admin';
};

// Helper hook para verificar autenticación
export const useRequireAuth = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login';
    }
  }, [user, loading]);

  return { user, loading };
};
