import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider as SessionAuthProvider } from '@/contexts/SessionAuthContext';
import { InventoryProvider } from '@/contexts/InventoryContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { ResearcherProvider } from '@/contexts/ResearcherContext';
import AuthGate from '@/components/AuthGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'OTI UNI Tech Lab',
  description:
    'Laboratorio Virtual 3D - Gestión y visualización de equipos de vanguardia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.className = document.documentElement.className.replace(/light|dark/g, '').trim() + ' ' + theme;
                } catch (e) {
                  document.documentElement.className = document.documentElement.className.replace(/light|dark/g, '').trim() + ' dark';
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <SessionAuthProvider>
            <AuthGate>
              <InventoryProvider>
                <ProjectProvider>
                  <ResearcherProvider>{children}</ResearcherProvider>
                </ProjectProvider>
              </InventoryProvider>
            </AuthGate>
          </SessionAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
