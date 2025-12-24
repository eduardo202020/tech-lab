'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Esperar a que Supabase procese el callback de OAuth
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message);
          setTimeout(() => router.push('/login?error=auth_error'), 2000);
          return;
        }

        if (session) {
          console.log('Session established, redirecting to home...');
          // Dar tiempo para que el contexto se actualice
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 500);
        } else {
          // Intentar obtener el usuario directamente
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            console.error('No session or user found');
            setTimeout(() => router.push('/login?error=no_session'), 2000);
          } else {
            console.log('User found, redirecting...');
            setTimeout(() => {
              router.push('/');
              router.refresh();
            }, 500);
          }
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setError('Error inesperado');
        setTimeout(() => router.push('/login?error=unexpected'), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-theme-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent mx-auto mb-4"></div>
        <p className="text-theme-text">
          {error ? `Error: ${error}` : 'Completando autenticación...'}
        </p>
      </div>
    </div>
  );
}
