# Despliegue — SpottLyft

## Frontend — Vercel

URL: https://spottlyft.vercel.app

El frontend está desplegado en Vercel conectado al repositorio de GitHub. Cada push a la rama `main` genera un redespliegue automático.

### Configuración

- Root Directory: `client`
- Framework: Vite
- Variable de entorno: `VITE_API_URL=https://spottlyft-production.up.railway.app/api/v1`

## Backend — Railway

URL: https://spottlyft-production.up.railway.app

El backend está desplegado en Railway conectado al mismo repositorio de GitHub.

### Configuración

- Root Directory: `server`
- Start command: `npm start`
- Puerto: asignado automáticamente por Railway

### Verificar que funciona

- Health check: https://spottlyft-production.up.railway.app/health
- Leaderboard: https://spottlyft-production.up.railway.app/api/v1/leaderboard/gym-1

## Flujo de despliegue

1. Desarrollar en local con `npm run dev` en ambas carpetas
2. Hacer commit y push a GitHub
3. Vercel y Railway redesplegan automáticamente