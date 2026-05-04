# API Client

Este documento describe el cliente HTTP tipado de SpottLyft, ubicado en `client/src/api/client.ts`. Es la única capa del frontend que se comunica con el backend — ninguna página o componente hace fetch directamente.

---

## Base URL

El cliente resuelve la URL base automáticamente según el entorno:

- Si existe `VITE_API_URL`, la usa directamente
- Si el hostname es `localhost` o `127.0.0.1`, apunta a `http://localhost:3000/api/v1`
- En producción usa `/api/v1` como ruta relativa

---

## Función base: request

Todas las llamadas pasan por `request<T>`, que se encarga de:

- Construir la URL completa con el endpoint
- Añadir la cabecera `Content-Type: application/json`
- Serializar el body si existe
- Parsear la respuesta como `ApiResponse<T>`
- Lanzar un error si `ok` es false o `success` es false

---

## gymClient

| Método | Llamada | Endpoint | Devuelve |
|--------|---------|----------|----------|
| GET | `gymClient.getAll()` | `/gyms` | `Gym[]` |
| GET | `gymClient.getById(id)` | `/gyms/:id` | `Gym` |
| GET | `gymClient.getLeaderboard(id)` | `/leaderboard/:id` | `LeaderboardEntry[]` |

## userClient

| Método | Llamada | Endpoint | Devuelve |
|--------|---------|----------|----------|
| GET | `userClient.getById(id)` | `/users/:id` | `User` |
| POST | `userClient.create(user)` | `/users` | `User` |

## workoutClient

| Método | Llamada | Endpoint | Devuelve |
|--------|---------|----------|----------|
| GET | `workoutClient.getAll()` | `/workouts` | `Workout[]` |
| POST | `workoutClient.create(workout)` | `/workouts` | `Workout` |
| DELETE | `workoutClient.delete(id)` | `/workouts/:id` | `void` |

---

## Tipos utilizados

Definidos en `client/src/types/index.ts`:

- `ApiResponse<T>` — wrapper estándar con `success`, `data` y `error`
- `Gym` — datos del gimnasio
- `User` — datos del usuario
- `Workout` — entrenamiento con ejercicios y series
- `LeaderboardEntry` — entrada del ranking con volumen, entrenamientos y racha