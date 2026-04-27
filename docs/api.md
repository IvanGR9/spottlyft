# API — SpottLyft

Base URL (desarrollo): `http://localhost:3000/api/v1`

## Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /health | Comprueba que el servidor está activo |

**Response:**
```json
{ "status": "OK", "app": "SpottLyft API" }
```

## Gimnasios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /gyms | Lista todos los gimnasios |
| GET | /gyms/:id | Obtiene un gimnasio por ID |

**GET /gyms/:id — Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "gym-1",
    "name": "Gimnasio Local",
    "location": "Madrid",
    "qrCode": "QR-GYM-001"
  }
}
```

## Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /users/:id | Obtiene un usuario por ID |
| POST | /users | Crea un nuevo usuario |

**POST /users — Body:**
```json
{
  "username": "NuevoUsuario",
  "email": "usuario@spottlyft.com",
  "gymId": "gym-1"
}
```

## Entrenamientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /workouts | Lista todos los entrenamientos |
| POST | /workouts | Crea un nuevo entrenamiento |
| DELETE | /workouts/:id | Elimina un entrenamiento |

**POST /workouts — Body:**
```json
{
  "userId": "user-1",
  "gymId": "gym-1",
  "exercises": [
    {
      "id": "ex-1",
      "name": "Prensa de Piernas",
      "muscleGroup": "Cuádriceps",
      "sets": [
        { "reps": 8, "weight": 240 }
      ]
    }
  ]
}
```

## Leaderboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /leaderboard/:gymId | Ranking de un gimnasio |

**GET /leaderboard/gym-1 — Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user-1",
      "username": "IvanGR9",
      "totalVolume": 430247,
      "totalWorkouts": 67,
      "streak": 6,
      "rank": 1
    }
  ]
}
```

## Códigos de respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado correctamente |
| 204 | Eliminado correctamente |
| 400 | Datos inválidos |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |