'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth, HARDCODED_CREDENTIALS } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/inventory');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setLoginError('Por favor, completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const success = await login(username, password);

      if (success) {
        router.push('/inventory');
      } else {
        setLoginError('Credenciales incorrectas');
      }
    } catch (error) {
      setLoginError('Error de conexión');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-theme-text">Verificando autenticación...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background transition-colors duration-300">
      <header className="bg-theme-card border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-neon-pink to-bright-blue rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-theme-text mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-theme-secondary">
              Accede al sistema de gestión del Tech Lab
            </p>
          </div>

          <div className="bg-theme-card rounded-lg p-6 border border-theme-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="Ingresa tu usuario"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent text-theme-text"
                  placeholder="Ingresa tu contraseña"
                  disabled={isSubmitting}
                />
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !username || !password}
                className="w-full bg-gradient-to-r from-neon-pink to-bright-blue text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Autenticando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 bg-theme-card/50 rounded-lg p-4 border border-theme-border/50">
            <h3 className="text-sm font-medium text-theme-text mb-3">
              Credenciales de demostración:
            </h3>
            <div className="space-y-2">
              {HARDCODED_CREDENTIALS.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setUsername(cred.username);
                    setPassword(cred.password);
                    setLoginError('');
                  }}
                  className="w-full text-left p-2 rounded bg-theme-background hover:bg-theme-accent/10 transition-colors text-sm border border-theme-border/50"
                  disabled={isSubmitting}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-theme-text font-medium">
                      {cred.username}
                    </span>
                    <span className="text-theme-secondary text-xs">
                      {cred.password}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-theme-secondary mt-3">
              Haz clic en cualquier credencial para llenar automáticamente el
              formulario.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
