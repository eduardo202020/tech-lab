'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error in auth callback:', error);
          router.push('/login?error=auth_error');
          return;
        }

        if (data.session) {
          // Usuario autenticado exitosamente
          router.push('/');
        } else {
          // No hay sesión válida
          router.push('/login?error=no_session');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.push('/login?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-theme-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent mx-auto mb-4"></div>
        <p className="text-theme-text">Completando autenticación...</p>
      </div>
    </div>
  );
}
