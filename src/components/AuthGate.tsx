'use client';

import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Verificando autenticación...</div>
      </div>
    );
  }

  return <>{children}</>;
}
