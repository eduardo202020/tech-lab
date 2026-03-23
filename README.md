# OTI UNI Tech Lab Platform

Plataforma web para la gestion del laboratorio tecnologico OTI UNI. La app centraliza inventario, prestamos, proyectos, investigadores, tecnologias, documentacion interna y visualizaciones interactivas en una sola interfaz construida con Next.js.

## Estado Actual

Hoy la app funciona con:

- Frontend en Next.js 15 + React 19 + TypeScript.
- API interna en `src/app/api/*`.
- PostgreSQL como fuente de verdad para las entidades principales.
- Seed inicial basado en los archivos de `public/mocks/`.
- Autenticacion propia con usuarios guardados en PostgreSQL.
- Docker Compose listo para desarrollo y despliegue local.

## Que Hace La App

### Modulos principales

- Inicio con resumen visual del laboratorio y accesos rapidos.
- Inventario de equipos con consulta, detalle y administracion por rol.
- Sistema de prestamos con estados, historial y calendario.
- Portafolio de proyectos con vista listado y detalle.
- Catalogo de investigadores con relacion a proyectos.
- Catalogo de tecnologias con relacion a proyectos.
- Documentacion interna en `/docs` usando Nextra.
- Pagina de contacto.
- Vistas especiales de proyectos como Smart Parking y otras simulaciones.

### Lo que puede hacer un admin

- Crear, editar y eliminar proyectos.
- Crear, editar y eliminar investigadores.
- Crear, editar y eliminar tecnologias.
- Crear, editar y eliminar inventario.
- Gestionar prestamos desde los endpoints protegidos.
- Cambiar su propia contrasena desde la interfaz.

### Roles y permisos

- `visitor`: solo lectura.
- `student`: lectura y creacion de prestamos.
- `researcher`: lectura y creacion de prestamos.
- `admin`: CRUD completo sobre proyectos, inventario, investigadores, tecnologias y prestamos.

La validacion de permisos no solo se hace en la UI. Tambien se aplica del lado servidor en las rutas API.

## Autenticacion

La app ya no usa login mock puro en cliente. El flujo actual es:

1. El usuario inicia sesion con `username` o `email` y `password`.
2. La API valida contra la tabla `techlab_auth_users` en PostgreSQL.
3. Si la tabla esta vacia, se siembran usuarios iniciales desde `public/mocks/usuarios.json`.
4. Las contrasenas se guardan hasheadas.
5. La sesion se persiste en `localStorage` y se revalida contra la API.

### Credenciales demo

- Admin: `luis.pujay / admin123`
- Researcher: `edson.palacios / techlab123`

Nota: para los usuarios seed conviene entrar por `username`, porque varios registros no tienen email.

### Endpoints de auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/session`
- `GET /api/auth/profile`
- `PUT /api/auth/password`

Archivos clave:

- `src/contexts/SupabaseAuthContext.tsx`
- `src/lib/authUsers.ts`
- `src/lib/mockAuthServer.ts`
- `src/lib/permissions.ts`

## Datos y Persistencia

Las entidades principales viven en PostgreSQL. Los mocks de `public/mocks/` se usan como semillas y referencia para bootstrap.

### Tablas principales

- `techlab_auth_users`
- `techlab_projects`
- `techlab_equipment`
- `techlab_researchers`
- `techlab_technologies`
- `techlab_loans`

### Bootstrap de datos mock

La app expone `POST /api/bootstrap-mocks` para cargar o recargar datos base desde `public/mocks/`.

Ejemplo:

```bash
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"reset":true}'
```

Tambien puedes limitar entidades:

```bash
curl -X POST http://localhost:3050/api/bootstrap-mocks \
  -H "Content-Type: application/json" \
  -d '{"targets":["projects","researchers","technologies"]}'
```

## Stack Tecnico

### Aplicacion

- Next.js 15.5.7
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- Lucide React
- Nextra

### Datos y backend

- Next.js App Router + Route Handlers
- PostgreSQL 16
- `pg`

### Visualizacion

- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- Recharts

## Estructura Del Proyecto

```text
tech-lab/
├── README.md
├── Dockerfile
├── docker-compose.yml
├── public/
│   ├── mocks/
│   ├── models/
│   └── docs/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── bootstrap-mocks/
│   │   │   ├── equipment/
│   │   │   ├── loans/
│   │   │   ├── projects/
│   │   │   ├── researchers/
│   │   │   ├── technologies/
│   │   │   ├── smart-parking/
│   │   │   └── people-counter/
│   │   ├── inventory/
│   │   ├── loans/
│   │   ├── login/
│   │   ├── projects/
│   │   ├── researchers/
│   │   ├── technologies/
│   │   ├── docs/
│   │   ├── contact/
│   │   └── maps/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── lib/
└── supabase/
```

## Instalacion Local

### Requisitos

- Node.js 20 recomendado
- npm
- Docker y Docker Compose para el flujo contenedorizado

### Ejecutar en host

```bash
npm install
npm run dev
```

La app queda en:

```text
http://localhost:3050
```

Si corres fuera de Docker necesitas una `DATABASE_URL` valida para usar PostgreSQL.

Ejemplo:

```env
DATABASE_URL=postgres://techlab:techlab@localhost:5432/techlab
```

## Docker Compose

El proyecto trae tres servicios principales:

- `postgres`: base de datos PostgreSQL 16.
- `app-local`: build local de produccion.
- `app-dev`: desarrollo con hot reload.

### Levantar entorno local de produccion

```bash
docker compose --profile local up -d postgres app-local
```

App:

```text
http://localhost:3050
```

PostgreSQL:

```text
localhost:5432
```

Credenciales por defecto:

- database: `techlab`
- user: `techlab`
- password: `techlab`

### Levantar entorno de desarrollo

```bash
docker compose --profile dev up postgres app-dev
```

### Rebuild de la imagen local

```bash
docker compose --profile local build app-local
docker compose --profile local up -d --force-recreate app-local
```

### Nota sobre BuildKit

Si el build falla por falta de `docker-buildx`, puedes usar:

```bash
DOCKER_BUILDKIT=0 docker compose --profile local build app-local
```

## Scripts Disponibles

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Flujo Recomendado De Datos

Para trabajar localmente con el estado actual del proyecto:

1. Levanta `postgres` y `app-local` o `app-dev`.
2. Entra con un usuario seed.
3. Si necesitas resetear catalogos, usa `POST /api/bootstrap-mocks`.
4. Administra contenido desde la UI o desde las rutas API protegidas.

## Archivos Clave

- `docker-compose.yml`: servicios y variables de entorno base.
- `src/lib/authUsers.ts`: tabla de usuarios, hash y seed inicial.
- `src/lib/permissions.ts`: roles y capacidades.
- `src/contexts/SupabaseAuthContext.tsx`: estado de sesion en cliente.
- `src/app/api/auth/*`: login, registro, sesion, perfil y cambio de contrasena.
- `src/app/api/bootstrap-mocks/route.ts`: carga de datos mock a PostgreSQL.
- `src/components/Header.tsx`: accion de cambio de contrasena.

## Historial Reciente

Cambios importantes ya incorporados:

- Migracion del login local a usuarios persistidos en PostgreSQL.
- Seed de usuarios desde `public/mocks/usuarios.json`.
- Validacion real de contrasena y cambio de contrasena por usuario.
- CRUD admin de investigadores y tecnologias.
- Permisos por rol aplicados tambien en backend.
- Ajuste del build para no depender de fuentes remotas durante Docker build.
- Correccion de `DATABASE_URL` en Docker Compose para usar `tech-lab-postgres`.

## Documentacion Adicional

- `docs/MIGRACION-SUPABASE.md`
- `docs/OAUTH-GOOGLE.md`

Esos documentos se mantienen como referencia historica. El flujo principal actual no depende de Supabase ni de OAuth social.
