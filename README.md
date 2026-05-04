# SpottLyft 🏋️‍♂️

SpottLyft es una app de fitness social fullstack donde los miembros de un gimnasio compiten en un ranking en tiempo real. Registra tus entrenamientos, acumula volumen y escala posiciones entre los usuarios de tu centro.

- Frontend: https://spottlyft.vercel.app
- Backend: https://spottlyft-production.up.railway.app
- Repositorio: https://github.com/IvanGR9/spottlyft

---

## Stack técnico

- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Node.js + Express + TypeScript
- Base de datos: MongoDB Atlas + Mongoose
- Despliegue: Vercel (frontend) y Railway (backend)

---

## Estructura del proyecto

El proyecto está dividido en dos carpetas principales: client para el frontend y server para el backend.

client/src contiene:
- pages — Home, Leaderboard, Workout, Profile, Login
- components — Navbar, StatCard, LeaderboardCard
- context — UserContext, gestiona el usuario y gimnasio de forma global
- hooks — useWorkout, lógica del entrenamiento activo
- api — client.ts, cliente HTTP tipado
- types — index.ts, interfaces globales

server/src contiene:
- routes — workout, leaderboard, gym, user
- controllers — workout, leaderboard, gym, user
- services — workout, leaderboard, gym, user
- models — User, Workout, Exercise, Gym
- db.ts — conexión a MongoDB Atlas
- seed.ts — script para poblar la base de datos con datos de ejemplo

---

## Cómo ejecutarlo en local

Clona el repositorio y entra en la carpeta:

    git clone https://github.com/IvanGR9/spottlyft.git
    cd spottlyft

Instala las dependencias del frontend y del backend:

    cd client && npm install
    cd ../server && npm install

Crea el archivo server/.env con tu connection string de MongoDB Atlas:

    MONGODB_URI=tu_connection_string_aqui

Arranca el backend y el frontend en terminales separadas:

    cd server && npm run dev    (http://localhost:3000)
    cd client && npm run dev    (http://localhost:5173)

Si quieres poblar la base de datos con usuarios y entrenamientos de ejemplo:

    cd server && npx tsx src/seed.ts

---

## Funcionalidades

- Registro e inicio de sesión con acceso por QR del gimnasio
- Ranking en tiempo real por volumen, entrenamientos y racha de días
- Podio top 3 con clasificación completa del resto de miembros
- Registro de entrenamientos con series, kg, repeticiones y RIR
- Timer de sesión con pausa y barra de progreso por ejercicio
- Perfil personal con historial, estadísticas y logros
- Estado vacío motivacional para usuarios nuevos sin entrenamientos
- Diseño dark mode inspirado en Hevy, responsive para móvil y escritorio

---

## Gestión del proyecto

Tablero Trello: https://trello.com/invite/b/69e93b2ee4fbd922812bf7e7/ATTIb8525223bf6ef11095fa062350f8cadb173B11E0/spottlyft

---