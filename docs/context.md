# Context — SpottLyft

## UserContext

Contexto global que gestiona el usuario autenticado y el gimnasio activo en toda la aplicación.

### ¿Por qué Context API y no Redux?

SpottLyft solo necesita compartir dos datos globales — el usuario y el gimnasio. Redux añadiría complejidad innecesaria para un estado tan sencillo. Context API es suficiente y más ligero.

### Estado global

- `user` — datos del usuario autenticado (id, username, email, gymId)
- `gym` — datos del gimnasio activo (id, name, location, qrCode)
- `isAuthenticated` — booleano derivado de si existe un usuario

### Funciones

- `setUser(user)` — actualiza el usuario autenticado
- `setGym(gym)` — actualiza el gimnasio activo
- `logout()` — limpia usuario y gimnasio, cierra sesión

### ¿Cuándo es útil Context API?

Context es útil cuando varios componentes en distintos niveles del árbol necesitan acceder al mismo dato sin pasar props manualmente por cada nivel (prop drilling). En SpottLyft el usuario y el gimnasio se usan en el Navbar, el Perfil, el Leaderboard y el registro de entrenamientos.

### Uso

```tsx
const { user, gym, isAuthenticated, logout } = useUser();
```