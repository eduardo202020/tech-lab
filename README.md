<p align="center">
  <img src="./docs/screenshots/tech-lab-home.png" alt="Portada de Tech Lab Platform" width="900" />
</p>

<h1 align="center">OTI UNI Tech Lab Platform</h1>

<p align="center">
  Plataforma web para la gestión del laboratorio tecnológico OTI UNI, con módulos de <strong>inventario</strong>, <strong>préstamos</strong>, <strong>proyectos</strong>, <strong>tecnologías</strong>, <strong>dispositivos</strong> y visualizaciones interactivas en una sola interfaz.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-111827?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React 19" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=0F172A" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Three.js-3D_Viewer-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js 3D viewer" />
  <img src="https://img.shields.io/badge/Docker-Local_Dev-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker local dev" />
</p>

## Qué es este proyecto

`tech-lab` es una plataforma interna para centralizar la operación de un laboratorio tecnológico universitario. Reúne catálogo de equipos, préstamos, proyectos, tecnologías, dispositivos y visualizaciones 3D en una sola app web.

Más que una web informativa, funciona como un tablero operativo con autenticación, permisos por rol, API interna y persistencia en PostgreSQL.

## Alcance del MVP

- 6 proyectos cargados desde mocks iniciales.
- 6 tecnologías vinculadas a proyectos.
- 23 equipos en inventario.
- 17 usuarios seed para pruebas y autenticación.
- CRUD administrativo sobre las entidades principales.
- Entorno local con Docker Compose y PostgreSQL.

## Qué resuelve

- Evita tener información del laboratorio dispersa entre hojas, documentos y demos aisladas.
- Unifica la consulta de inventario, préstamos y portafolio técnico.
- Permite mostrar proyectos con una interfaz más presentable para stakeholders, docentes o visitantes.
- Sirve como base para integrar sensores, mapas, modelos 3D y otros sistemas del ecosistema Tech Lab.

## Funcionalidades principales

- Dashboard inicial con resumen del laboratorio y accesos rápidos.
- Módulo de inventario con consulta, detalle y administración por rol.
- Sistema de préstamos con estados, historial y calendario.
- Catálogo de proyectos con vista de lista y detalle.
- Catálogo de tecnologías y su relación con proyectos.
- Gestión global de dispositivos y dispositivos por proyecto.
- Autenticación propia con sesión persistida y validación real contra PostgreSQL.
- Visualizaciones interactivas con Three.js para experiencias del laboratorio.

## Roles y permisos

- `visitor`: solo lectura.
- `student`: lectura y creación de préstamos.
- `researcher`: lectura y creación de préstamos.
- `admin`: CRUD completo sobre proyectos, inventario, investigadores, tecnologías, dispositivos y préstamos.

La autorización no vive solo en la UI: también se aplica del lado servidor en las rutas API.

## Arquitectura general

```mermaid
flowchart LR
    U[Usuario] --> W[Next.js App Router]
    W --> API[Route Handlers / API interna]
    API --> DB[PostgreSQL]
    W --> UI[UI React + Tailwind]
    UI --> VIZ[Three.js / Recharts]
    API --> SEED[Bootstrap desde public/mocks]
    API --> SENS[Proxies de sensores y dispositivos]
```

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript |
| UI | Tailwind CSS 4, Lucide React |
| Backend app | Next.js App Router + Route Handlers |
| Base de datos | PostgreSQL 16, `pg` |
| Visualización | Three.js, `@react-three/fiber`, `@react-three/drei`, Recharts |
| Infra local | Docker, Docker Compose |

## Autenticación

El flujo actual ya no depende de un login puramente mock:

1. El usuario inicia sesión con `username` o `email` y `password`.
2. La API valida contra la tabla `techlab_auth_users` en PostgreSQL.
3. Si no hay usuarios, se siembran registros base desde `public/mocks/usuarios.json`.
4. Las contraseñas se guardan hasheadas.
5. La sesión se persiste en cliente y se revalida contra la API.

Credenciales demo:

- Admin: `luis.pujay / admin123`
- Researcher: `edson.palacios / techlab123`

## Ejecución local

### Requisitos

- Node.js 20 recomendado
- npm
- Docker y Docker Compose

### Ejecutar en host

```bash
npm install
npm run dev
```

La aplicación queda disponible en:

```text
http://localhost:3050
```

Si corres fuera de Docker, necesitas una `DATABASE_URL` válida:

```env
DATABASE_URL=postgres://techlab:techlab@localhost:5432/techlab
```

## Docker Compose

Servicios principales:

- `postgres`: base de datos PostgreSQL 16.
- `app-local`: build local de producción.
- `app-dev`: desarrollo con hot reload.

Levantar entorno local:

```bash
docker compose --profile local up -d postgres app-local
```

Levantar entorno de desarrollo:

```bash
docker compose --profile dev up postgres app-dev
```

## Bootstrap de datos

El proyecto expone `POST /api/bootstrap-mocks` para cargar o recargar datos base desde `public/mocks/`.

Ejemplo:

```bash
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"reset":true}'
```

También puedes limitar entidades:

```bash
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"targets":["projects","researchers","technologies"]}'
```

## Archivos clave

- `docker-compose.yml`: servicios y variables de entorno base.
- `docker-compose.testnet.yml`: overlay para conectar este repo a la red externa `testnet`.
- `src/lib/authUsers.ts`: tabla de usuarios, hash y seed inicial.
- `src/lib/permissions.ts`: roles y capacidades.
- `src/lib/projectDevices.ts`: utilidades de dispositivos por proyecto.
- `src/lib/sensorBackends.ts`: punto central para URLs, IPs e IDs hardcodeados de sensores.
- `src/contexts/SupabaseAuthContext.tsx`: estado de sesión en cliente.
- `src/app/api/auth/*`: login, sesión, perfil, registro y cambio de contraseña.
- `src/app/api/bootstrap-mocks/route.ts`: carga de datos mock a PostgreSQL.
- `src/components/DevicesAdminPage.tsx`: vista global de dispositivos.
- `src/components/ProjectDeviceExperience.tsx`: gestión de dispositivos por proyecto.

## Documentación relacionada

- [docs/DOCKER-TESTNET.md](docs/DOCKER-TESTNET.md)
- [docs/GUIA-CAPTURAS-DOCS.md](docs/GUIA-CAPTURAS-DOCS.md)

## Estado actual

El proyecto ya cubre la base operativa de la plataforma: autenticación persistida, permisos por rol, entidades principales en PostgreSQL, carga de mocks y experiencias visuales integradas. Está listo para continuar creciendo como portal de gestión, vitrina tecnológica e interfaz para integraciones del laboratorio.
