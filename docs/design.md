# Arquitectura de la Aplicación — SpottLyft

## Estructura de componentes principales

La carpeta client/src se organiza de la siguiente manera:

- pages/Home.tsx — Página principal con feed de actividad
- pages/Leaderboard.tsx — Ranking por categorías
- pages/Workout.tsx — Registro de entrenamiento activo
- pages/Profile.tsx — Perfil de usuario con historial
- pages/QRAccess.tsx — Acceso al gimnasio por QR
- pages/NotFound.tsx — Página 404
- components/Navbar.tsx — Navegación principal
- components/LeaderboardCard.tsx — Tarjeta de usuario en el ranking
- components/WorkoutForm.tsx — Formulario de registro de ejercicios
- components/ExerciseItem.tsx — Item individual de ejercicio
- components/StatCard.tsx — Tarjeta de estadística
- context/UserContext.tsx — Estado global del usuario
- hooks/useWorkout.ts — Hook para gestión de entrenamientos
- api/client.ts — Cliente de API tipado
- types/index.ts — Interfaces y tipos globales

## Componentes reutilizables

- LeaderboardCard — usada en Leaderboard y Profile
- StatCard — usada en Home y Profile
- ExerciseItem — usada en Workout y Profile

## Gestión del estado

- Estado local con useState para formularios y UI
- Estado global con Context API para el usuario autenticado y el gimnasio activo
- useEffect para cargar datos de la API al montar componentes
- useMemo para calcular rankings y estadísticas

## Diseño del backend

### Recursos REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/v1/gyms/:id | Obtener datos de un gimnasio |
| GET | /api/v1/gyms/:id/leaderboard | Ranking del gimnasio |
| GET | /api/v1/users/:id | Perfil de usuario |
| POST | /api/v1/users | Crear usuario |
| GET | /api/v1/workouts | Obtener entrenamientos |
| POST | /api/v1/workouts | Registrar entrenamiento |
| DELETE | /api/v1/workouts/:id | Eliminar entrenamiento |

## Persistencia de datos

- En el servidor: usuarios, entrenamientos, gimnasios, ranking
- En el cliente: usuario activo en sesión (Context), filtros de UI

## Flujo de datos

1. Usuario escanea QR y selecciona su gimnasio
2. Registra entrenamiento mediante POST /api/v1/workouts
3. Consulta el ranking actualizado mediante GET /api/v1/gyms/:id/leaderboard
4. Comparte progreso con amigos del mismo gimnasio

## Decisiones de arquitectura

- Arquitectura por capas en el backend (Routes → Controllers → Services) para separar responsabilidades y facilitar el mantenimiento
- Cliente de API tipado en el frontend para garantizar que los datos recibidos coinciden con las interfaces TypeScript
- Context API en lugar de Redux por simplicidad — el estado global es solo el usuario activo y el gimnasio
- Vite como bundler por su velocidad en desarrollo y compatibilidad con React + TypeScript