# Testing — SpottLyft

## Pruebas manuales realizadas

### Navegación
- [x] Todas las rutas navegan correctamente
- [x] El Navbar resalta la ruta activa en naranja
- [x] La página 404 aparece en rutas no definidas
- [x] El botón "Volver al inicio" de la 404 funciona

### Leaderboard
- [x] Los datos cargan desde la API real
- [x] Los filtros Volumen, Entrenamientos y Racha ordenan correctamente
- [x] El estado de carga aparece mientras se obtienen los datos
- [x] El mensaje de error aparece si la API no responde

### Perfil
- [x] El nombre y gimnasio del usuario se cargan desde el contexto
- [x] El historial de entrenamientos carga desde la API
- [x] El badge #1 Ranking se muestra correctamente

### Workout
- [x] El botón Iniciar está deshabilitado sin título
- [x] Se pueden añadir ejercicios de la lista
- [x] Se pueden añadir series a cada ejercicio
- [x] El volumen total se actualiza en tiempo real
- [x] El botón ✓ marca la serie como completada
- [x] El botón Finalizar resetea el formulario

### Backend
- [x] GET /health responde correctamente
- [x] GET /api/v1/gyms devuelve la lista de gimnasios
- [x] GET /api/v1/gyms/:id devuelve un gimnasio
- [x] GET /api/v1/users/:id devuelve un usuario
- [x] GET /api/v1/workouts devuelve los entrenamientos
- [x] GET /api/v1/leaderboard/:gymId devuelve el ranking

### Responsive
- [x] En desktop el Navbar aparece arriba
- [x] En móvil el Navbar aparece abajo
- [x] Las tarjetas se adaptan a pantallas pequeñas

## Errores encontrados y corregidos

- Dark mode no aplicaba estilos CSS propios — corregido unificando en `body.dark-mode`
- API_URL hardcodeada rompía en producción — corregido con detección automática de hostname
- Conflicto de módulos TypeScript en el servidor — corregido con `NodeNext` en tsconfig