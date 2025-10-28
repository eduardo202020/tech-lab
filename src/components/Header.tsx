'use client';

import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-theme-bg/80 backdrop-blur-sm transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 transition-all hover:scale-105"
        >
          <svg
            className="h-8 w-8 text-neon-pink"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"></path>
          </svg>
          <h2 className="text-xl font-bold font-montserrat text-theme-text">
            OTI UNI Tech Lab
          </h2>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text"
            href="/"
          >
            Inicio
          </Link>
          <Link
            className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text"
            href="/inventory"
          >
            Inventario
          </Link>
          <Link
            className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text"
            href="/projects"
          >
            Proyectos
          </Link>
          <Link
            className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text"
            href="/researchers"
          >
            Equipo
          </Link>
          <Link
            className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text"
            href="/loans"
          >
            Préstamos
          </Link>
          <Link
            className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text"
            href="/contact"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isLoading ? (
            <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-theme-text">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              className="rounded-md bg-bright-blue px-5 py-2.5 text-sm font-semibold text-dark-bg shadow-lg shadow-bright-blue/30 transition-all hover:bg-white hover:text-dark-bg hover:shadow-bright-blue"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
