'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  // Evita que la pantalla de verificación quede pegada si algo falla al resolver la sesión
  const [hydrated, setHydrated] = useState(false);
  const [authTimeoutPassed, setAuthTimeoutPassed] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setAuthTimeoutPassed(true), 2500);
    return () => clearTimeout(timeoutId);
  }, []);

  const showLoader = hydrated && loading && !authTimeoutPassed;

  if (showLoader) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Verificando autenticación...</div>
      </div>
    );
  }

  return <>{children}</>;
}
