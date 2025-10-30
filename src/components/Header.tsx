'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, User, Shield, GraduationCap, Search, Eye, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, profile, signOut, loading } = useAuth();
  const isAuthenticated = !!user && !!profile;
  const isLoading = loading;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-theme-bg/80 backdrop-blur-sm transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button & Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button - Only visible on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-theme-text hover:bg-theme-accent/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-all hover:scale-105"
          >
            <svg
              className="h-8 w-8 text-neon-pink"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"></path>
            </svg>
          </Link>
        </div>

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
            Investigadores
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
              {/* Indicador de Rol */}
              <div className="flex items-center gap-1">
                {profile?.role === 'admin' && (
                  <div className="flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20">
                    <Shield className="w-3 h-3" />
                    <span className="text-xs font-medium">Admin</span>
                  </div>
                )}
                {profile?.role === 'researcher' && (
                  <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">
                    <GraduationCap className="w-3 h-3" />
                    <span className="text-xs font-medium">Investigador</span>
                  </div>
                )}
                {profile?.role === 'student' && (
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
                    <Search className="w-3 h-3" />
                    <span className="text-xs font-medium">Estudiante</span>
                  </div>
                )}
                {profile?.role === 'visitor' && (
                  <div className="flex items-center gap-1 bg-gray-500/10 text-gray-400 px-2 py-1 rounded-md border border-gray-500/20">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs font-medium">Visitante</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-theme-text">
                <div className="relative group">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || profile.username || 'Usuario'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-theme-accent/20 hover:border-theme-accent/50 transition-all cursor-pointer group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-theme-accent/10 rounded-full flex items-center justify-center border-2 border-theme-accent/20 hover:border-theme-accent/50 transition-all cursor-pointer group-hover:scale-105">
                      <User className="w-4 h-4 text-theme-accent" />
                    </div>
                  )}

                  {/* Tooltip con información del usuario */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-theme-card border border-theme-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    <p className="text-xs text-theme-text font-medium">
                      {profile?.full_name || profile?.username}
                    </p>
                    <p className="text-xs text-theme-secondary">
                      {profile?.email}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block">
                  <span className="text-sm font-medium">
                    {profile?.full_name || profile?.username}
                  </span>
                </div>
              </div>
              {/* Logout button - Hidden on mobile, shown in mobile menu instead */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 text-theme-secondary hover:text-theme-text transition-colors"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-theme-card border-b border-theme-border">
          <div className="container mx-auto px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-2">
              <Link
                href="/"
                className="block py-2 text-theme-text hover:text-theme-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/inventory"
                className="block py-2 text-theme-text hover:text-theme-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inventario
              </Link>
              <Link
                href="/projects"
                className="block py-2 text-theme-text hover:text-theme-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Proyectos
              </Link>
              <Link
                href="/researchers"
                className="block py-2 text-theme-text hover:text-theme-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Investigadores
              </Link>
              <Link
                href="/loans"
                className="block py-2 text-theme-text hover:text-theme-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Préstamos
              </Link>
              <Link
                href="/contact"
                className="block py-2 text-theme-text hover:text-theme-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>

            {isAuthenticated && user ? (
              <div className="pt-4 border-t border-theme-border">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors w-full justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-theme-border">
                <Link
                  href="/login"
                  className="block px-4 py-2 bg-bright-blue text-dark-bg rounded-md font-medium hover:opacity-90 transition-opacity text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
