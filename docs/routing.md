# Rutas y Navegación — SpottLyft

## Estructura de rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home | Página principal con stats y acceso rápido |
| `/workout` | Workout | Registro de entrenamiento activo |
| `/leaderboard` | Leaderboard | Ranking del gimnasio |
| `/profile` | Profile | Perfil de usuario e historial |
| `*` | NotFound | Página 404 |

## Configuración

Las rutas están configuradas en `App.tsx` usando React Router v6 con el componente `BrowserRouter`.

## Navegación

- El componente `Navbar` usa `NavLink` para resaltar la ruta activa en naranja
- En desktop el Navbar aparece en la parte superior
- En móvil el Navbar aparece fijo en la parte inferior
- El botón "Iniciar entrenamiento" de Home navega a `/workout` usando `useNavigate`
- El botón "Volver al inicio" de la página 404 navega a `/` usando `useNavigate`

## Página 404

Cualquier ruta no definida redirige al componente `NotFound` mediante el wildcard `path="*"`.