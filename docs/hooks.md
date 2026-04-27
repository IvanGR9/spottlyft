# Hooks — SpottLyft

## useWorkout

Hook personalizado para gestionar el estado de un entrenamiento activo.

### Uso

```tsx
const { workout, setTitle, addExercise, addSet, updateSet, totalVolume, reset } = useWorkout();
```

### Estado

- `workout` — objeto con el título y array de ejercicios del entrenamiento actual

### Funciones

- `setTitle(title)` — actualiza el nombre del entrenamiento
- `addExercise(name, muscleGroup)` — añade un ejercicio nuevo con una serie vacía
- `addSet(exerciseId)` — añade una serie a un ejercicio existente
- `updateSet(exerciseId, setIndex, field, value)` — actualiza kg o reps de una serie concreta
- `reset()` — limpia el entrenamiento completo

### Hooks internos utilizados

- `useState` — gestiona el estado del entrenamiento
- `useCallback` — memoriza las funciones para evitar renders innecesarios
- `useMemo` — calcula el volumen total solo cuando cambian los ejercicios

## Hooks nativos de React utilizados en la app

### useState
Gestiona estado local en componentes. Usado en `Leaderboard` para el filtro activo y en `Workout` para controlar si el entrenamiento ha empezado.

### useEffect
Maneja efectos secundarios. Usado en `Leaderboard` para cargar los datos de la API al montar el componente.

### useMemo
Optimiza cálculos costosos. Usado en `useWorkout` para recalcular el volumen total solo cuando cambian los ejercicios.

### useCallback
Evita que las funciones se recreen en cada render. Usado en `useWorkout` para estabilizar las funciones que se pasan como props.