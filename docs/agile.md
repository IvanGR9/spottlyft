# Metodologías de Desarrollo Ágil

## ¿Qué es Agile?

Agile es una filosofía de desarrollo de software basada en la flexibilidad y la entrega continua de valor. Su objetivo principal es adaptarse a los cambios durante el desarrollo en lugar de seguir un plan rígido desde el principio. En lugar de entregar el producto completo al final, Agile propone entregar partes funcionales del software de forma incremental, permitiendo recibir feedback constante y corregir el rumbo cuando sea necesario.

## Scrum

Scrum es un framework ágil que organiza el trabajo en ciclos cortos llamados **sprints**, normalmente de 1 a 4 semanas. Al final de cada sprint se entrega una versión funcional del producto.

### Conceptos principales

- **Roles:** Hay tres roles principales — el Product Owner (define qué se construye y prioriza), el Scrum Master (facilita el proceso y elimina obstáculos) y el Development Team (construye el producto).
- **Sprint:** Período de tiempo fijo en el que el equipo trabaja en un conjunto de tareas acordadas. Al finalizar se revisa lo entregado.
- **Backlog:** Lista priorizada de todas las funcionalidades y tareas pendientes del proyecto. El Product Owner es responsable de mantenerla actualizada.
- **Sprint Review:** Reunión al final del sprint donde el equipo muestra lo que ha construido y recibe feedback.
- **Daily Standup:** Reunión diaria de 15 minutos donde cada miembro responde qué hizo ayer, qué hará hoy y si tiene algún bloqueo.

## Kanban

Kanban es un método visual para gestionar el trabajo. Se basa en un tablero con columnas que representan los estados de las tareas (por ejemplo: Pendiente, En Progreso, Hecho). Cada tarea es una tarjeta que se mueve de columna en columna según avanza.

A diferencia de Scrum, Kanban no tiene sprints ni roles fijos. El trabajo fluye de forma continua y el equipo se enfoca en no acumular demasiadas tareas en progreso al mismo tiempo.

## Diferencias entre Scrum y Kanban

| Aspecto | Scrum | Kanban |
|---|---|---|
| Estructura | Sprints con duración fija | Flujo continuo sin ciclos |
| Roles | Product Owner, Scrum Master, Dev Team | No hay roles definidos |
| Cambios | Solo entre sprints | En cualquier momento |
| Enfoque | Entrega por iteraciones | Entrega continua |
| Reuniones | Daily, Review, Retrospectiva | No obligatorias |

## ¿Cuándo usar cada una?

**Scrum** es ideal cuando el proyecto tiene un alcance definido, un equipo estable y se puede planificar por fases. Es muy útil en desarrollo de productos nuevos donde se necesita iterar rápido con feedback del cliente.

**Kanban** es ideal para equipos de soporte, mantenimiento o proyectos donde las tareas llegan de forma impredecible y necesitan gestionarse de forma flexible sin comprometerse a sprints fijos.

## Aplicación en SpottLyft

Para el desarrollo de SpottLyft se usará un enfoque inspirado en **Kanban** gestionado desde Trello, ya que el proyecto lo desarrolla una sola persona y las tareas pueden cambiar de prioridad según las necesidades del momento.