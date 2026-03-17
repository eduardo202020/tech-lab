'use client';

// Archivo de compatibilidad que mapea el contexto legacy con auth de sesión
import {
  useAuth as useAuthSession,
  UserProfile,
} from '@/contexts/SessionAuthContext';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  setRedirectPath: (path: string) => void;
  getRedirectPath: () => string | null;
  clearRedirectPath: () => void;
}

// Convertir UserProfile a User legacy
const convertProfileToUser = (profile: UserProfile | null): User | null => {
  if (!profile) return null;

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    role: profile.role === 'admin' ? 'admin' : 'user',
    name: profile.full_name,
  };
};

// Hook de compatibilidad
export const useAuth = (): AuthContextType => {
  const {
    user: authUser,
    profile,
    signInWithEmail,
    signOut,
    loading,
  } = useAuthSession();

  // Simulación de redirect path (localStorage)
  const setRedirectPath = (path: string) => {
    localStorage.setItem('redirectPath', path);
  };

  const getRedirectPath = (): string | null => {
    return localStorage.getItem('redirectPath');
  };

  const clearRedirectPath = () => {
    localStorage.removeItem('redirectPath');
  };

  // Función de login legacy sobre auth de sesión
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Intentar login con email (asumiendo que username es email)
    const { error } = await signInWithEmail(username, password);
    return !error;
  };

  // Función de logout legacy
  const logout = async () => {
    await signOut();
    clearRedirectPath();
  };

  return {
    user: convertProfileToUser(profile),
    login,
    logout,
    isLoading: loading,
    isAuthenticated: !!authUser && !!profile,
    setRedirectPath,
    getRedirectPath,
    clearRedirectPath,
  };
};

// Credenciales hardcodeadas para desarrollo (ya no se usan pero mantengo compatibilidad)
export const HARDCODED_CREDENTIALS = [
  { username: 'admin@techlab.com', password: 'admin123', role: 'admin' },
  { username: 'eduardo@techlab.com', password: 'eduardo123', role: 'admin' },
  { username: 'user@techlab.com', password: 'user123', role: 'user' },
];

export default useAuth;
