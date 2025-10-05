'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En una app real, esto enviaría los datos a una API de autenticación
    alert(
      `Inicio de sesión:\nUsuario: ${formData.username}\nContraseña: ${formData.password}`
    );
    setFormData({ username: '', password: '' });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-text font-roboto">
      <Header />

      <main className="flex flex-1 items-center justify-center py-16 px-4 pt-28">
        <div className="w-full max-w-md space-y-8">
          {/* Login Header */}
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="h-12 w-12 text-neon-pink mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight font-montserrat text-theme-text">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-light-gray/70 font-poppins">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/register"
                className="font-medium text-bright-blue hover:text-white transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>

          {/* Login Form */}
          <div className="rounded-2xl bg-black/30 p-8 backdrop-blur-xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="sr-only">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-theme-card py-3 px-4 text-theme-text placeholder-theme-secondary focus:ring-2 focus:ring-inset focus:ring-neon-pink h-12 font-poppins"
                  placeholder="Usuario"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-theme-card py-3 px-4 text-theme-text placeholder-theme-secondary focus:ring-2 focus:ring-inset focus:ring-neon-pink h-12 font-poppins"
                  placeholder="Contraseña"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-bright-blue hover:text-white transition-colors font-poppins"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-neon-pink py-3 px-4 text-sm font-bold text-white shadow-lg shadow-neon-pink/40 hover:scale-105 hover:shadow-neon-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-pink h-12 transition-all font-montserrat"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-black/30 px-2 text-light-gray/70 font-poppins">
                    O continúa con
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-white/5 transition-colors font-poppins"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-white/5 transition-colors font-poppins"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.739.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001.012.017z" />
                </svg>
                Continuar con Microsoft
              </button>
            </div>
          </div>

          {/* Additional Links */}
          <div className="text-center text-sm text-light-gray/70 space-y-2">
            <p className="font-poppins">
              ¿Problemas para iniciar sesión?{' '}
              <Link
                href="/contact"
                className="text-bright-blue hover:text-white transition-colors"
              >
                Contacta con soporte
              </Link>
            </p>
            <p className="font-poppins">
              <Link
                href="/"
                className="text-bright-blue hover:text-white transition-colors"
              >
                Volver al inicio
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
