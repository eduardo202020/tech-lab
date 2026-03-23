# Docker Testnet

Este archivo deja a `tech-lab` listo para integrarse a la red compartida del stack mayor sin orquestar los otros repos desde aqui.

## Archivos

- `docker-compose.yml`: flujo normal de este repo.
- `docker-compose.testnet.yml`: overlay para conectarse a la red externa `testnet`.

## Preparacion

1. Crear la red una sola vez:

```bash
docker network create testnet
```

2. Copiar `.env.testnet.example` a `.env.testnet` si quieres ajustar variables.

## Levantar este repo en testnet

Modo produccion local:

```bash
docker compose \
  --env-file .env.testnet \
  -f docker-compose.yml \
  -f docker-compose.testnet.yml \
  --profile local \
  up -d postgres app-local
```

Modo desarrollo:

```bash
docker compose \
  --env-file .env.testnet \
  -f docker-compose.yml \
  -f docker-compose.testnet.yml \
  --profile dev \
  up -d postgres app-dev
```

## Que cambia con este overlay

- `app`, `app-local` y `app-dev` entran a la red externa `testnet`.
- `postgres` tambien entra a `testnet` para quedar visible si otro servicio lo necesita.
- El frontend usa `DECLARATIVE_DB_API_BASE_URL=http://db-api:3004` para consultar sensores del motor declarativo.

## Puertos de este repo

- App: `3050`
- PostgreSQL local de este repo: `5432`

## Nota

Este overlay no levanta `TechLab-Data-Ingestion` ni `declarativeEngine`. Solo deja a este repo listo para convivir con ellos.
