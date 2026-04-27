# Formularios — SpottLyft

## Formulario de entrenamiento (Workout.tsx)

Formulario controlado con React para registrar series y repeticiones durante un entrenamiento.

### Campos

- **Nombre del entrenamiento** — input de texto controlado con useState
- **Kg** — input numérico por serie, actualizado con updateSet
- **Reps** — input numérico por serie, actualizado con updateSet

### Validación

- El botón "Iniciar entrenamiento" está deshabilitado si el título tiene menos de 1 carácter
- Los inputs de kg y reps solo aceptan valores numéricos

### Estados del formulario

- **Idle** — pantalla inicial con input de nombre
- **Activo** — entrenamiento en curso con ejercicios y series
- **Serie completada** — botón ✓ en naranja al marcar una serie

### Gestión del estado

El estado del formulario se gestiona con el custom hook `useWorkout` que centraliza toda la lógica de añadir ejercicios, series y calcular el volumen total.