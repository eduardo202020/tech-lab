# 🔬 OTI UNI Tech Lab Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?style=for-the-badge&logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css) ![Three.js](https://img.shields.io/badge/Three.js-Latest-000000?style=for-the-badge&logo=three.js) ![Nextra](https://img.shields.io/badge/Nextra-Docs-000000?style=for-the-badge)

**Plataforma moderna para la gestión integral del Laboratorio Tecnológico OTI UNI**

[🌐 Características](#-características) | [🛠️ Instalación](#-instalación) | [🐳 Docker](#-docker) | [📁 Estructura](#-estructura-del-proyecto) | [🚀 Roadmap](#-roadmap-futuro)

</div>

## 🌟 Descripción

**OTI UNI Tech Lab** es una plataforma web moderna y futurista diseñada para la gestión integral de equipos tecnológicos de vanguardia en el laboratorio de la Oficina de Tecnologías de la Información (OTI) de la Universidad Nacional de Ingeniería.

La plataforma integra gestión de inventario, sistema de préstamos, catálogo de tecnologías emergentes, portafolio de proyectos, simulaciones 3D interactivas y documentación de usuario con Nextra en una experiencia unificada y moderna.

### 🎯 Objetivos

- ✅ **Gestión eficiente** de inventario de equipos tecnológicos
- ✅ **Sistema automatizado** de préstamos con seguimiento completo
- ✅ **Visualización inmersiva** de tecnologías con modelos 3D
- ✅ **Portafolio completo** de proyectos de investigación
- ✅ **Interface moderna** con soporte de temas claro/oscuro
- ✅ **Autenticación avanzada** con redirección inteligente
- ✅ **Responsivo y accesible** en todos los dispositivos

---

## ✨ Características

### 🏠 **Página Principal - Hero Section**

- **Modelo 3D interactivo** con tecnología Three.js y OrbitControls
- **Sección de estadísticas** mostrando proyectos activos y tecnologías integradas
- **Cards informativas** con características principales
- **Navegación intuitiva** hacia todas las secciones
- **Diseño futurista** con efectos neon y glassmorphism
- **Responsive** - Optimizado para desktop y móviles

### 📊 **Gestión de Inventario**

- **Catálogo completo** de equipos con imágenes y descripciones
- **Filtros avanzados**:
  - Por categoría (Computadoras, Sensores, Microcontroladores, etc.)
  - Por marca y modelo
  - Por estado (Disponible, En Préstamo, Mantenimiento, Retirado)
- **Búsqueda en tiempo real** con múltiples criterios
- **Cards interactivas** con información detallada y especificaciones
- **Estados visuales** con códigos de color diferenciados
- **Información de serial** y características técnicas

### 📝 **Sistema de Préstamos**

- **Tabla de préstamos activos** con seguimiento completo
- **Historial de préstamos** con filtros por fecha
- **Estados dinámicos** con códigos de color (Activo, Devuelto, Atrasado)
- **Gestión de usuarios** y responsables del préstamo
- **Fechas de devolución** con indicadores visuales
- **Calendario de préstamos** (LoansCalendar component)
- **Integración con equipos** del inventario

### 🚀 **Catálogo de Tecnologías Emergentes**

Plataforma con 8+ tecnologías principales:

- 📡 **LoRa & IoT** - Comunicación de largo alcance para dispositivos
- ⛓️ **Blockchain** - Tecnología de cadena de bloques y criptografía
- 🔧 **ESP32** - Microcontroladores y sistemas embedded
- 🤖 **IA & Machine Learning** - Inteligencia artificial y modelos predictivos
- 🌐 **Edge Computing** - Computación en el borde (Edge)
- ☁️ **Cloud Computing** - Arquitecturas y servicios en la nube
- 🔒 **Cybersecurity** - Seguridad informática y protección de datos
- 📊 **Big Data** - Análisis de grandes volúmenes de datos
- 🌍 **Renewable Energy** - Energías renovables y sostenibilidad
- 🌐 **Web Platform** - Plataformas web modernas

**Características:**
- **Páginas individuales** para cada tecnología con información completa
- **Descripción detallada** de casos de uso y características
- **Proyectos vinculados** que utilizan cada tecnología
- **Enlaces directos** a sistemas específicos
- **Historial de búsqueda** y navegación inteligente

### 📋 **Gestión Integral de Proyectos**

Sistema completo de portafolio de proyectos con:

**Lista de Proyectos:**
- **Catálogo completo** con 12+ proyectos activos y archivados
- **Filtros avanzados**:
  - Por estado (Activo, Completado, En Pausa, Planificación)
  - Por prioridad (Baja, Media, Alta, Crítica)
  - Por categoría y tecnología
- **Búsqueda en tiempo real** con múltiples criterios
- **Cards del proyecto** con información resumida
- **Indicadores visuales** de progreso y estado

**Detalles de Proyecto Individual:**
- **Información completa**: Título, descripción, objetivos, desafíos
- **Métricas del proyecto**:
  - Barra de progreso visual
  - Fecha de inicio/término
  - Estado actual con distintivo
  - Nivel de prioridad
- **Equipo del proyecto**:
  - Lead del proyecto
  - Miembros del equipo
  - Investigadores vinculados
- **Presupuesto y recursos** asignados
- **Galería de imágenes** del proyecto
- **Enlaces externos**:
  - URL de demostración (demo)
  - Repositorio del código (GitHub)
  - Documentación técnica
- **Tecnologías vinculadas** con información de uso
- **Desafíos y soluciones** implementadas

### 🎯 **Smart Parking System - Simulación 3D Avanzada**

Proyecto destacado con simulación 3D interactiva:

- **Visualización 3D en tiempo real** usando React Three Fiber
- **Espacios con identidades únicas** y layout configurable por cámara (A1, A2, etc.)
- **Estados de ocupación** dinámicos:
  - Verde: Disponible
  - Rojo: Ocupado
  - Amarillo: Reservado
  - Gris: Mantenimiento
- **Controles de cámara 3D** intuitivos:
  - Rotación con ratón (drag)
  - Zoom con scroll
  - Pan con click derecho
- **Información de espacios** en tiempo real
- **Responsive** - Adaptado para desktop y tablets
- **Integración completa** en la página del proyecto
- **Fallback automático a mock** si la DB está apagada (22:00–08:00) para no romper la UI

### 🧑‍💼 **Gestión de Investigadores**

- **Catálogo de investigadores** del lab
- **Perfiles completos** con especialidades
- **Proyectos asignados** a cada investigador
- **Información de contacto** y especialidades técnicas
- **Estado de actividad** (Activo, Inactivo, Egresado)
- **Vinculación bidireccional** con proyectos

### 🔐 **Sistema de Autenticación Avanzado**

- **Sistema de login** robusto con validación de formularios
- **UI moderna** con efectos glassmorphism y validación en tiempo real
- **OAuth integrado**:
  - Google OAuth para login social
  - GitHub OAuth para desarrolladores
- **Redirección inteligente**:
  - El usuario regresa automáticamente donde estaba antes del login
  - Persistencia de rutas en localStorage
  - Limpieza automática de rutas expiradas
- **Componentes de seguridad**:
  - `ProtectedRoute` para rutas privadas
  - `AuthAwareLink` para enlaces inteligentes
  - `AuthGate` para control de acceso granular
- **Hook personalizado** `useAuthRedirect` para gestión de navegación
- **Estados de sesión** persistentes entre recargas
- **Roles y permisos** diferenciados

### 🔗 **Sistema de Vinculación Bidireccional**

- **Proyectos ↔ Tecnologías**: Cada proyecto vinculado con tecnologías usadas
- **Proyectos ↔ Investigadores**: Asignación de equipos a proyectos
- **Tecnologías ↔ Proyectos**: Visualización de casos de uso
- **Componente reutilizable** `RelatedTechnologies` para mostrar conexiones
- **Navegación cruzada** intuitiva entre entidades relacionadas

### 🎨 **Sistema de Temas Dinámicos**

- **Tema claro/oscuro** con transiciones suaves
- **Sistema de variables CSS** para tema global
- **Persistencia automática** en localStorage
- **Detección de preferencias** del sistema operativo
- **Componente ThemeToggle** con switch intuitivo
- **Colores predefinidos**:
  - Tema Claro: Fondos claros, texto oscuro
  - Tema Oscuro: Fondos oscuros, efectos neon

### 📞 **Página de Contacto**

- **Formulario de contacto** completamente funcional
- **Información de ubicación** del laboratorio
- **Datos de contacto** directo
- **Diseño responsivo** optimizado para móviles
- **Validación de formularios** en tiempo real

### 📱 **Diseño Responsivo y Accesibilidad**

- **Mobile First** - Optimizado primero para móviles
- **Desktop Experience** - Funcionalidad completa en desktop
- **Tablet Support** - Experiencia adaptada para tablets
- **Navegación adaptativa** según tamaño de pantalla
- **Componente Header** con menú responsivo
- **Componente Footer** con navegación secundaria
- **Touch-friendly** - Elementos con tamaño apropiado para táctil

---

## 🛠️ Tecnologías Utilizadas

### **Frontend Framework**
- **Next.js 15.5.4** - Framework React con App Router
- **React 18** - Biblioteca de interfaces de usuario
- **TypeScript 5** - Tipado estático para JavaScript

### **Estilos e Interfaz**
- **Tailwind CSS 3** - Framework de utilidades CSS
- **Custom CSS Variables** - Sistema de temas dinámicos
- **Responsive Design** - Mobile First approach
- **Lucide React** - Iconos SVG modernos y consistentes

### **Gráficos 3D y Visualización**
- **Three.js** - Biblioteca 3D profesional
- **@react-three/fiber** - Renderer React para Three.js
- **@react-three/drei** - Utilidades avanzadas para Three.js
- **OrbitControls** - Controles de cámara 3D intuitivos
- **React Three Fiber Canvas** - Simulaciones 3D interactivas

### **Gestión de Estado y Context**
- **React Context API** - Estado global con múltiples contextos
- **React Hooks** - useState, useEffect, useContext, useCallback
- **Hooks Personalizados**:
  - `useTechnologies` - Gestión de tecnologías
  - `useAuthRedirect` - Redirección inteligente
  - `useSupabaseProjects` - Proyectos desde API local/mock (nomenclatura legacy)
  - `useSupabaseResearchers` - Investigadores desde API local/mock (nomenclatura legacy)
  - `useSupabaseEquipment` - Inventario desde API local/mock (nomenclatura legacy)
  - `useDebounce` - Debouncing para búsquedas
- **localStorage** - Persistencia de preferencias y sesiones

### **Base de Datos y Backend**
- **API Routes de Next.js** - Endpoints internos en `src/app/api/*`
- **Mocks JSON** - Fuente principal de datos en `public/mocks/*`
- **Mock Auth local** - Sesión y perfiles persistidos en `localStorage`
- **Scripts SQL de referencia** - Carpeta `supabase/` mantenida para escenarios opcionales

### **Tipografía y Fuentes**
- **Google Fonts**: Geist, Montserrat, Roboto, Poppins
- **Bebas Neue** - Fuente display moderna para títulos
- **Sistema de tipografía** consistente y escalable

### **Herramientas de Desarrollo**
- **ESLint** - Linting y análisis de código
- **TypeScript Compiler** - Verificación de tipos
- **Tailwind CSS CLI** - Procesamiento de estilos
- **Next.js CLI** - Servidor de desarrollo y build

---

## 📁 Estructura del Proyecto

```
tech-lab/
├── 📄 README.md                 # Este archivo
├── 📄 package.json             # Dependencias del proyecto
├── 📄 tsconfig.json            # Configuración TypeScript
├── 📄 tailwind.config.js       # Configuración de Tailwind
├── 📄 next.config.ts           # Configuración de Next.js
├── 📄 eslint.config.mjs        # Configuración de ESLint
│
├── 📁 public/                  # Archivos estáticos
│   ├── 📁 models/              # Modelos 3D (.gltf, .bin)
│   │   └── textures/           # Texturas para modelos
│   ├── 📁 mocks/               # Datos mock (equipos, proyectos, investigadores, etc.)
│   ├── 📁 docs/                # Assets de documentación (capturas)
│   └── favicon.ico
│
├── 📁 src/
│   ├── 📁 app/                 # App Router de Next.js
│   │   ├── 📄 layout.tsx       # Layout principal
│   │   ├── 📄 page.tsx         # Página de inicio (home)
│   │   ├── 📄 globals.css      # Estilos globales y variables CSS
│   │   │
│   │   ├── 📁 api/             # Rutas API
│   │   │   └── 📁 loans/       # Endpoints de préstamos
│   │   │
│   │   ├── 📁 auth/            # Autenticación
│   │   │   └── 📁 callback/    # Callback OAuth
│   │   │
│   │   ├── 📁 equipment/       # Gestión de equipos
│   │   │   └── 📁 [id]/        # Página de equipo individual
│   │   │
│   │   ├── 📁 inventory/       # Inventario de equipos
│   │   │
│   │   ├── 📁 loans/           # Sistema de préstamos
│   │   │
│   │   ├── 📁 login/           # Página de autenticación
│   │   │   ├── 📄 page.tsx     # Login principal
│   │   │   └── 📄 page-new.tsx # Alternativa de login
│   │   │
│   │   ├── 📁 projects/        # Gestión de proyectos
│   │   │   ├── 📄 page.tsx     # Lista de proyectos
│   │   │   ├── 📄 layout.tsx   # Layout de proyectos
│   │   │   └── 📁 [id]/        # Página individual de proyecto
│   │   │
│   │   ├── 📁 researchers/     # Gestión de investigadores
│   │   │   ├── 📄 page.tsx     # Lista de investigadores
│   │   │   └── 📁 [id]/        # Página individual de investigador
│   │   │
│   │   ├── 📁 technologies/    # Catálogo de tecnologías
│   │   │   ├── 📄 page.tsx     # Lista de tecnologías
│   │   │   └── 📁 [technology]/ # Página individual de tecnología
│   │   │
│   │   ├── 📁 contact/         # Página de contacto
│   │   │
│   │   ├── 📁 docs/            # Documentación de usuario (Nextra)
│   │   └── 📁 test-supabase/   # Página técnica legacy de pruebas
│   │
│   ├── 📁 components/          # Componentes reutilizables
│   │   ├── 📄 Header.tsx       # Navegación principal
│   │   ├── 📄 Footer.tsx       # Pie de página
│   │   ├── 📄 ThemeToggle.tsx  # Selector de temas claro/oscuro
│   │   ├── 📄 SearchBar.tsx    # Barra de búsqueda
│   │   ├── 📄 Modal.tsx        # Componente modal genérico
│   │   │
│   │   ├── 📄 Model3DViewer.tsx          # Visor 3D principal
│   │   ├── 📄 SmartParkingViewer.tsx     # Simulación 3D Smart Parking
│   │   ├── 📄 RelatedTechnologies.tsx    # Componente de vinculaciones
│   │   │
│   │   ├── 📄 LoansCalendar.tsx         # Calendario de préstamos
│   │   ├── 📄 ProtectedRoute.tsx        # Rutas protegidas
│   │   ├── 📄 AuthGate.tsx              # Control de acceso
│   │   ├── 📄 AuthAwareLink.tsx         # Enlaces inteligentes
│   │   │
│   │   ├── 📄 ProjectModals.tsx         # Modales de proyectos
│   │   ├── 📄 EditResearcherModal.tsx   # Modal de edición de investigador
│   │   ├── 📄 ResearcherModals.tsx      # Modales de investigadores
│   │   │
│   │   └── 📄 index.ts         # Exportaciones de componentes
│   │
│   ├── 📁 contexts/            # React Contexts (Estado Global)
│   │   ├── 📄 ThemeContext.tsx           # Contexto de temas
│   │   ├── 📄 AuthContext.tsx           # Contexto de autenticación
│   │   ├── 📄 AuthContextLegacy.tsx     # Autenticación legacy
│   │   ├── 📄 SupabaseAuthContext.tsx   # Autenticación mock (nombre legacy)
│   │   ├── 📄 ProjectContext.tsx        # Contexto de proyectos
│   │   ├── 📄 InventoryContext.tsx      # Contexto de inventario
│   │   └── 📄 ResearcherContext.tsx     # Contexto de investigadores
│   │
│   ├── 📁 hooks/               # Hooks personalizados
│   │   ├── 📄 useAuthRedirect.ts       # Redirección inteligente
│   │   ├── 📄 useTechnologies.ts       # Gestión de tecnologías
│   │   ├── 📄 useSupabaseProjects.ts   # Proyectos desde API/mocks (nombre legacy)
│   │   ├── 📄 useSupabaseResearchers.ts # Investigadores desde API/mocks (nombre legacy)
│   │   ├── 📄 useSupabaseEquipment.ts  # Equipos desde API/mocks (nombre legacy)
│   │   └── 📄 useDebounce.ts           # Debounce para búsquedas
│   │
│   └── 📁 lib/                 # Librerías y utilidades
│
├── 📁 supabase/                # Scripts SQL históricos/opcionales
│   ├── 📄 schema.sql           # Esquema de base de datos
│   ├── 📄 seed-data.sql        # Datos iniciales
│   ├── 📄 configure-auth.sql   # Configuración de autenticación
│   ├── 📄 create-loans-table.sql
│   ├── 📄 create-equipment-table.sql
│   └── 📄 fix-rls.sql          # Configuración de Row Level Security
│
└── 📁 docs/                    # Documentación adicional y guías internas
    ├── 📄 MIGRACION-SUPABASE.md # Guía de migración a Supabase
    └── 📄 OAUTH-GOOGLE.md      # Configuración OAuth Google
```

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**

- Node.js 18+ ([nodejs.org](https://nodejs.org/))
- npm o yarn
- Git
- Docker + Docker Compose (opcional)
- Cuenta de Supabase (opcional, solo para escenarios avanzados)

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/eduardo202020/tech-lab.git
cd tech-lab
```

### **2. Instalar Dependencias**

```bash
npm install
# o con yarn
yarn install
```

### **3. Configurar Variables de Entorno (Opcional)**

Crear archivo `.env.local` en la raíz del proyecto:

```env
# OAuth (Opcional, actualmente deshabilitado en modo mock)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxxxx
NEXT_PUBLIC_GITHUB_CLIENT_ID=xxxxxxxxxxxxxx

# PostgreSQL (Opcional - por defecto usa postgres local en Docker)
# DATABASE_URL=postgres://usuario:contraseña@host:puerto/base_datos
```

Nota: para levantar la app localmente **sin Docker**, no se requieren variables de entorno obligatorias (usa mocks automáticamente).

### **4. Base de Datos - PostgreSQL**

La app soporta dos modos:

**Modo Local (Mocks - por defecto):**
- Los datos vienen listos en `public/mocks/`
- No requiere PostgreSQL instalado
- Perfecto para desarrollo y pruebas rápidas

**Modo PostgreSQL (recomendado para producción):**
- Datastore persistente y confiable
- Requiere variable `DATABASE_URL`
- Docker Compose incluye PostgreSQL preconfigurado

#### **Opción A: PostgreSQL Local en Docker Compose**

El `docker-compose.yml` ya incluye PostgreSQL. Para usarlo:

```bash
# Levanta PostgreSQL + app-dev juntos
docker compose --profile dev up postgres app-dev

# O solo PostgreSQL si quieres correr la app en host
docker compose up postgres
```

Base de datos se crea automáticamente con:
- **Usuario:** `techlab`
- **Contraseña:** `techlab`
- **DB:** `techlab`
- **Puerto:** `5432`

#### **Opción B: PostgreSQL Externo (Servidor Separate)**

Si tu postgre está en un servidor diferente (proyecto más grande):

```bash
# En tu servidor de producción:
DATABASE_URL="postgres://user:pass@tu-servidor.com:5432/techlab"

# Luego levanta la app:
docker compose up -d app

# O en host local:
npm run build
npm start
```

La app automáticamente:
- Crea tablas si no existen
- No borra datos existentes
- Soporta múltiples clientes apuntando a same DB

### **5. Cargar Datos Mock a PostgreSQL (Bootstrap)**

Una vez que PostgreSQL esté activo, carga datos mock con:

```bash
# Endpoint disponible en http://localhost:3050/api/bootstrap-mocks

# Cargar todos los mocks (reset + recarga):
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"reset":true}'

# Cargar solo específicas tablas sin resetear:
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"targets":["projects","researchers"]}'

# Respuesta esperada:
# {"ok":true,"reset":true,"targets":[...],"seeded":{"projects":6,"equipment":23,...}}
```

**Endpoint `POST /api/bootstrap-mocks`**
- `reset` (boolean): Si true, vacía las tablas antes de cargar
- `targets` (array): Qué entidades cargar: `equipment`, `projects`, `researchers`, `technologies`, `loans`
- Devuelve conteos de registros cargados por tabla

**Si deseas usar Supabase de forma opcional:**
- Revisa [docs/MIGRACION-SUPABASE.md](docs/MIGRACION-SUPABASE.md).
- Usa `supabase/schema.sql` y luego `supabase/configure-auth.sql`.
- Carga semillas con `supabase/seed-data-clean.sql` o `supabase/seed-data.sql`.

### **5. Ejecutar en Modo Desarrollo**

```bash
npm run dev
# o con yarn
yarn dev
```

### **6. Abrir en el Navegador**

```
http://localhost:3050
```

---

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot reload

# Producción
npm run build            # Construir aplicación para producción
npm start               # Iniciar servidor de producción

# Linting y Tipado
npm run lint            # Ejecutar ESLint
```

---

## 🐳 Docker

El proyecto incluye:

- `Dockerfile` multi-stage para imagen de producción optimizada
- `.dockerignore` para reducir contexto de build
- `docker-compose.yml` con servicios preconfigura­dos: PostgreSQL, app (prod), app-local (prod local), app-dev (desarrollo)

### **1. Desarrollo Local (con PostgreSQL en Docker)**

```bash
# Levanta la app en modo desarrollo con PostgreSQL local
docker compose --profile dev up app-dev postgres

# Acceso: http://localhost:3050
```

Esto agrupa:
- **app-dev** en puerto 3050 (Next.js con hot reload)
- **postgres** en puerto 5432 (BD persistente)

### **2. Producción con Docker Compose (PostgreSQL Local)**

```bash
# Reconstruir imagen y correr en modo producción
docker compose --profile local up --build app-local

# O con postgres también:
docker compose --profile local up --build postgres app-local

# Acceso: http://localhost:3050
```

Detener todos los servicios:

```bash
docker compose down
```

### **3. PostgreSQL Externo (Servidor Separado)**

Si tienes PostgreSQL corriendo en otro servidor (proyecto más grande):

**A. Vía variable de entorno en Docker:**

```bash
# Crear archivo .env con tu conexión externa
echo 'DATABASE_URL=postgres://usuario:contraseña@tu-servidor.com:5432/techlab' > .env

# Levantar solo la app (sin postgres local)
docker compose up -d app-local
```

**B. Vía `docker-compose.override.yml` (recomendado):**

Crear archivo `docker-compose.override.yml` en la raíz:

```yaml
version: '3.8'

services:
  app-local:
    environment:
      DATABASE_URL: postgres://usuario:contraseña@tu-servidor.com:5432/techlab
      
  app-dev:
    environment:
      DATABASE_URL: postgres://usuario:contraseña@tu-servidor.com:5432/techlab
```

Luego:

```bash
docker compose --profile local up app-local
# o modo desarrollo:
docker compose --profile dev up app-dev
```

**C. En producción (Docker Swarm / Kubernetes):**

Pasar variable al contenedor:

```bash
docker run -d \
  -p 3050:3000 \
  -e DATABASE_URL="postgres://user:pass@db-server:5432/techlab" \
  -e NODE_ENV="production" \
  tech-lab:latest
```

### **4. Build y Ejecución Manual**

```bash
# Construir imagen
docker build -t tech-lab:latest .

# Ejecutar sin PostgreSQL (usa conexión externa)
docker run --rm -p 3050:3000 \
  -e DATABASE_URL="postgres://user:pass@tu-servidor.com:5432/techlab" \
  --name tech-lab \
  tech-lab:latest
```

### **5. Validar Conexión a PostgreSQL**

Una vez que el contenedor esté arriba:

```bash
# Cargar datos mock en PostgreSQL
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"reset":true}'

# Verificar respuesta:
# {"ok":true,"reset":true,"targets":[...],"seeded":{"projects":6,"equipment":23}}
```

Si falla con error de conexión:
- Verifica que `DATABASE_URL` esté correcta
- Confirma firewall/red permite conectar a la BD
- Revisa logs: `docker logs nombre_contenedor`

---

## �️ Arquitectura Multi-Servidor (PostgreSQL Externo)

### **Escenario: Integración con Proyecto Mayor**

Si ya tienes un servidor PostgreSQL ejecutándose en un proyecto más grande (ej. backend Django, Go, etc.), puedes conectar esta app fácilmente:

### **Diagrama de Arquitectura**

```
┌─────────────────────────────────────┐
│   Tu Servidor Principal (Proyecto)  │
├─────────────────────────────────────┤
│  PostgreSQL 16 (puerto 5432)        │
│  - Database: 'techlab'              │
│  - Usuario: 'tu_usuario'            │
│  - Host: 192.168.1.100 (interno)    │
│  - O: tu-servidor.com (externo)     │
└─────────────────────────────────────┘
          ↑ Conexión TCP
          │ (DATABASE_URL)
          │
┌─────────────────────────────────────┐
│   Tech Lab App (Esta app)           │
├─────────────────────────────────────┤
│  Docker Container                   │
│  - Puerto 3050 (localhost)          │
│  - Conecta a PostgreSQL externo     │
│  - Lee/Escribe datos compartidos    │
└─────────────────────────────────────┘
```

### **Paso 1: Preparar PostgreSQL Externo**

En tu servidor PostgreSQL (ejecución única):

```sql
-- Crear database si no existe
CREATE DATABASE IF NOT EXISTS techlab;

-- Conectar a la base de datos
\c techlab

-- La app creará las tablas automáticamente en primer acceso
-- Tablas que se crearán: techlab_equipment, techlab_projects, 
--                        techlab_researchers, techlab_technologies, 
--                        techlab_loans
```

No necesitas crear tablas manualmente; la app lo hace en el primer boot.

### **Paso 2: Configurar en Esta App**

**Opción A: Vía fichero `.env.local`**

```bash
# En la raíz del proyecto, crear/editar .env.local
DATABASE_URL="postgres://tu_usuario:tu_contraseña@tu-servidor.com:5432/techlab"
```

**Opción B: Vía `docker-compose.override.yml` (recomendado para equipos)**

Crear archivo `docker-compose.override.yml` en la raíz:

```yaml
version: '3.8'

services:
  app-local:
    environment:
      DATABASE_URL: "postgres://tu_usuario:tu_contraseña@tu-servidor.com:5432/techlab"
      NODE_ENV: production

  app-dev:
    environment:
      DATABASE_URL: "postgres://tu_usuario:tu_contraseña@tu-servidor.com:5432/techlab"
      NODE_ENV: development
```

Este archivo NO se commitea (agregalo a `.gitignore` ya si está ahí). Cada desarrollador puede tener su propia versión local.

**Opción C: Variable global del sistema**

```bash
export DATABASE_URL="postgres://tu_usuario:tu_contraseña@tu-servidor.com:5432/techlab"
npm start
```

### **Paso 3: Levantar la App**

Con Docker Compose:

```bash
# Opción 1: Con docker-compose.override.yml (ambiente automático)
docker compose --profile local up app-local

# Opción 2: Con .env.local (docker carga automáticamente)
docker compose --profile local up app-local

# Opción 3: Sin Docker (en host)
npm run build
npm start
```

La app tardará unos segundos en:
1. Conectar a PostgreSQL
2. Crear tablas si no existen
3. Disponibilizar endpoints en http://localhost:3050

### **Paso 4: Verificar Conexión**

```bash
# Verificar que está arriba
curl http://localhost:3050/

# Cargar datos mock en PostgrSQL (opcional, si quieres datos iniciales)
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"reset":true}'

# Respuesta:
# {"ok":true,"reset":true,"targets":[...],"seeded":{"projects":6,...}}
```

### **Paso 5: Acceso Compartido (Múltiples Clientes)**

Si múltiples apps/equipo van a usar la misma BD:

```bash
# App 1 (Este proyecto)
DATABASE_URL="postgres://tech:tech@db.empresa.com:5432/techlab" npm start

# App 2 (Tu backend Django/Go)
DATABASE_URL="postgres://tech:tech@db.empresa.com:5432/techlab" ./ run

# Ambas escriben/leen de la misma DB sin conflictos
```

Las tablas están prefixadas (`techlab_*`) para evitar colisiones con otros esquemas.

### **Solución de Problemas**

| Error | Causa | Solución |
|-------|-------|----------|
| `connection refused` | Host/puerto incorrecto | Verifica `DATABASE_URL` con `psql -c "SELECT 1"` |
| `authentication failed` | Usuario/contraseña | Confirma credenciales en servidor |
| `database does not exist` | BD no creada | Ejecuta `CREATE DATABASE techlab;` en PostgreSQL |
| `ECONNREFUSED` en logs | Firewall bloqueando | Abre puerto 5432 en firewall del servidor |
| `FATAL: sorry, too many clients` || Reduce conexiones: limpia pools stale o incrementa max_connections |

### **Variables de Conexión (Referencia)**

```
postgres://[usuario]:[contraseña]@[host]:[puerto]/[base_datos]

Ejemplos:
- Local:      postgres://techlab:techlab@localhost:5432/techlab
- Red interna: postgres://techlab:techlab@192.168.1.100:5432/techlab
- Servidor:   postgres://tech:pass123@tu-servidor.com:5432/techlab
- Con SSL:    postgres://tech:pass@host:5432/techlab?sslmode=require
```

---

## �🎨 Personalización

### **Temas Personalizados**

Sistema de variables CSS en [src/app/globals.css](src/app/globals.css):

```css
/* Tema Claro */
:root.light {
  --theme-background: #f8fafc;
  --theme-text: #0f172a;
  --theme-secondary: #475569;
  --theme-border: #cbd5e1;
  --theme-card: #ffffff;
  --theme-accent: #3b82f6;
}

/* Tema Oscuro */
:root.dark {
  --theme-background: #0f172a;
  --theme-text: #f1f5f9;
  --theme-secondary: #cbd5e1;
  --theme-border: rgba(255, 255, 255, 0.1);
  --theme-card: rgba(15, 23, 42, 0.6);
  --theme-accent: #00d9ff;
}
```

### **Colores Personalizados**

Editar [tailwind.config.js](tailwind.config.js):

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff00ff',
        'bright-blue': '#00ffff',
        'dark-bg': '#0a0e27',
        // Agregar tus colores personalizados
      },
    },
  },
};
```

### **Agregar Nuevas Tecnologías**

Las tecnologías se cargan desde `public/mocks/technologies.json`. Para agregar una:

1. Abrir `public/mocks/technologies.json`.
2. Agregar un objeto en el arreglo de tecnologías con la estructura:

```json
{
  "id": "nueva-tech",
  "name": "Nueva Tecnología",
  "description": "Descripción breve",
  "icon": "🚀",
  "gradient": "from-blue-500 to-purple-600",
  "about_title": "Acerca de",
  "about_content": ["Párrafo 1", "Párrafo 2"],
  "features_title": "Características",
  "features_items": [
    {"text": "Característica 1", "color": "text-blue-400"},
    {"text": "Característica 2", "color": "text-purple-400"}
  ],
  "has_direct_links": false
}
```

### **Agregar Nuevos Proyectos**

En modo local/mock:

1. Abrir `public/mocks/projects.json`.
2. Agregar el proyecto con su estructura completa.
3. Verificar IDs y relaciones en `public/mocks/technologies.json` y `public/mocks/investigadores.json`.
4. Si aplica, ajustar datos de usuario en `public/mocks/usuarios.json`.

---

## 🔐 Configuración de Autenticación

### **Modo Actual (Mock Auth Local)**

El proyecto usa autenticación mock por defecto con persistencia local (localStorage). No requiere variables de entorno adicionales.

La implementación vive en `src/contexts/SupabaseAuthContext.tsx` y mantiene compatibilidad de llaves legacy para migraciones internas.

### **OAuth Google/GitHub (Estado actual)**

Actualmente los métodos OAuth están deshabilitados en modo mock y el login funcional es por email/contraseña contra datos en `public/mocks/usuarios.json`.

Si se reactiva OAuth en una etapa posterior, usar:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_google_id
```

Más detalles históricos en [docs/OAUTH-GOOGLE.md](docs/OAUTH-GOOGLE.md).

### **Supabase (Opcional / Avanzado)**

Los scripts SQL se conservan en `supabase/` para usos puntuales, pero no forman parte del flujo local por defecto.

```sql
-- Referencia histórica (no requerida para entorno mock)
-- Ver carpeta supabase/
```

### **Notas de carga de datos**

- Los hooks de datos mantienen la opción `autoFetch` para evitar dobles requests en React Strict Mode: `useSupabaseEquipment`, `useSupabaseProjects`, `useSupabaseResearchers`.
- Las páginas principales ejecutan carga controlada inicial para no duplicar llamadas.
- La fuente principal de verdad en desarrollo son los endpoints internos y archivos de `public/mocks`.

---

## 🤝 Guía de Contribución

### **Flujo de Trabajo**

1. **Fork** el repositorio
2. **Crear rama** de feature:
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```
3. **Hacer cambios** y **commit** con convenciones:
   ```bash
   git commit -m "feat: agregar nueva característica"
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/nueva-caracteristica
   ```
5. **Abrir Pull Request** en GitHub

### **Convenciones de Commits**

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Cambios de formato (sin lógica)
- `refactor:` - Refactorización de código
- `perf:` - Mejoras de rendimiento
- `test:` - Pruebas
- `chore:` - Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat: agregar sistema de notificaciones"
git commit -m "fix: corregir validación de formulario"
git commit -m "docs: actualizar README"
```

### **Estándares de Código**

- **TypeScript** - Tipado completo, evitar `any`
- **ESLint** - Ejecutar `npm run lint` antes de commit
- **Tailwind** - Usar clases en lugar de CSS puro
- **Components** - Reutilizables y bien documentados
- **Hooks** - Respetar reglas de hooks de React

---

## 📚 Documentación Adicional

- [Migración a Supabase](docs/MIGRACION-SUPABASE.md) - Proceso de migración completa
- [Configuración OAuth Google](docs/OAUTH-GOOGLE.md) - Autenticación social
- [Nextra Docs](https://nextra.site/docs) - Documentación del sistema de docs
- [Three.js Documentation](https://threejs.org/docs/) - Gráficos 3D

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Eduardo Guevara

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Autor

**Eduardo Guevara** - Desarrollador Full Stack

- 🐙 GitHub: [@eduardo202020](https://github.com/eduardo202020)
- 💼 LinkedIn: [Eduardo Guevara](https://www.linkedin.com/in/jhunior-guevara-889483162/)
- 📧 Email: [contacto@eduardoguevara.dev]

---

## 🆕 Changelog

### **Versión 1.6.2 - Marzo 2026 (Hoy)**

- Separación de visualizaciones para evitar mezclar simulaciones: la vista de Smart Parking ya no renderiza el módulo de Cuenta Personas en la misma página de detalle de proyecto.
- Ajuste de condición en la vista de detalle de proyecto para que `PeopleCounterViewer` solo aparezca en proyectos de conteo de personas.

### **Versión 1.6.1 - Marzo 2026 (Ayer)**

- Integración de documentación con Nextra en `/docs` con layout, navegación y páginas funcionales para acceso, inventario, investigadores, proyectos, tecnologías, préstamos y FAQ.
- Guía de capturas para documentación y estructura inicial en `public/docs/screenshots/`.
- Limpieza de scripts y documentos legacy de migración/autenticación para reducir ruido técnico.
- Mejora visual de `ViewItemModal` en inventario para mayor legibilidad y contraste.
- Ajuste de interacción en `Model3DViewer` con `pointerEvents` para mejorar el manejo del canvas.
- Actualización de URL de demo del proyecto Blockchain.
- Mejoras de estilo y UX en la página de investigadores.

### **Versión 1.6.0 - Marzo 2026 (Anteayer)**

- Migración operativa a datos mock para desarrollo local: incorporación y normalización de datasets en `public/mocks/`.
- Refactor de endpoints para consumir mocks en préstamos, ubicaciones de mapa, inventario, proyectos e investigadores.
- Refactor de autenticación para modo mock y compatibilidad con flujo existente en la UI.
- Incorporación de nuevas visualizaciones de proyecto: `AirQualityViewer`, `BlockchainViewer` y `TechLabPlatformViewer`.
- Mejoras en perfiles de investigadores: detalle de proyectos vinculados y filtros más útiles.
- Añadido contacto por WhatsApp y mejoras de filtrado en investigadores.
- Soporte de estado `broken` en inventario con ajustes en componentes relacionados.
- Enlaces dinámicos de tecnologías en home usando datos reales del hook de tecnologías.

### **Versión 1.5.1 - Enero 2026**

- Persistencia de sesión Supabase unificada entre pestañas usando `storageKey` estable (`techlab_supabase_auth`).
- Hooks de datos con bandera `autoFetch` y guardas de una sola carga para evitar peticiones duplicadas en React Strict Mode (inventario, proyectos, investigadores).
- Contexto y páginas consumen los hooks en modo controlado (`refresh` único al montar) y permiten lectura pública sin bloquear por autenticación.
- Guía SQL actualizada: usar [supabase/schema.sql](supabase/schema.sql) + [supabase/configure-auth.sql](supabase/configure-auth.sql), semillas limpias ([supabase/seed-data-clean.sql](supabase/seed-data-clean.sql) / [supabase/seed-inventory-data-fixed.sql](supabase/seed-inventory-data-fixed.sql)) y evitar scripts legacy o [supabase/fix-rls.sql](supabase/fix-rls.sql) en producción.

### **Versión 1.5 - Diciembre 2025**

#### 🎉 Nuevas Características

- ✅ **Sistema de gestión de proyectos** completo
- ✅ **Redirección inteligente** después del login
- ✅ **Sistema de vinculación** bidireccional (proyectos ↔ tecnologías)
- ✅ **Simulación 3D Smart Parking** integrada
- ✅ **Páginas individuales** de proyectos con vista detallada
- ✅ **Búsqueda y filtros** avanzados en todas las secciones
- ✅ **Hooks personalizados** para funcionalidades específicas

#### 🔧 Mejoras Técnicas

- ✅ Optimización de dependencias en `useTechnologies` hook
- ✅ Eliminación de ciclos infinitos en efectos
- ✅ Mejor rendimiento en carga de datos
- ✅ Navegación mejorada sin duplicados
- ✅ Sistema de temas robusto
- ✅ Autenticación con redirección de rutas

### **Versión 1.0 - Lanzamiento Inicial**

- Sistema de inventario de equipos
- Sistema de préstamos
- Catálogo de tecnologías
- Autenticación básica
- Tema claro/oscuro
- Responsive design

---

## 🔮 Roadmap Futuro

### **Versión 1.7 (Próximo)**

- [ ] 📊 **Dashboard mejorado** con gráficos de estadísticas
- [ ] 🔔 **Sistema de notificaciones** en tiempo real
- [ ] 📅 **Reservas de equipos** con calendario avanzado
- [ ] 📈 **Analytics** de uso de equipos y proyectos
- [ ] 🎯 **Perfil de usuario** personalizable

### **Versión 2.0 (Propuesta)**

- [ ] 🔐 **Autenticación JWT** con tokens refresh
- [ ] 📊 **Dashboard administrativo** con métricas en tiempo real
- [ ] 📱 **App móvil** con React Native
- [ ] 🔔 **Push notifications** integrado
- [ ] 📈 **Advanced analytics** y reportes
- [ ] 🌐 **PWA** (Progressive Web App)
- [ ] 🤖 **Chatbot IA** para soporte técnico
- [ ] 📦 **API REST** completa documentada
- [ ] 🧪 **Testing** automatizado (Jest, Cypress)
- [x] 🐳 **Dockerización** (imagen de producción y compose)
- [ ] 📝 **Sistema de reservas** avanzado
- [ ] 🎨 **Editor de simulaciones 3D** personalizable
- [ ] 🌍 **Internacionalización** (i18n)
- [ ] ♿ **Accesibilidad WCAG 2.1** AA

---

## 🙏 Agradecimientos

- **Universidad Nacional de Ingeniería (UNI)** - Institución anfitriona
- **Oficina de Tecnologías de la Información (OTI)** - Laboratorio que alberga el proyecto
- **React Team** - Por la excelente biblioteca de UI
- **Next.js Team** - Framework que hace posible esto
- **Tailwind CSS** - Sistema de diseño increíble
- **Three.js Community** - Gráficos 3D fantásticos
- **Nextra** - Sistema de documentación integrado
- Todos los **contribuidores y usuarios** que han reportado bugs y sugerencias

---

## 📞 Soporte

¿Tienes dudas o encontraste un bug?

- 📧 Envía un email a [contacto@eduardoguevara.dev]
- 🐙 Abre un [issue en GitHub](https://github.com/eduardo202020/tech-lab/issues)
- 💬 Discute en [discussions](https://github.com/eduardo202020/tech-lab/discussions)
- 📱 Contacta a través de [la página de contacto](http://localhost:3050/contact)

---

<div align="center">

## ⭐ Si te gusta este proyecto, no olvides darle una estrella ⭐

**Hecho con ❤️ para la comunidad tecnológica de la UNI**

Última actualización: Marzo 2026

</div>
