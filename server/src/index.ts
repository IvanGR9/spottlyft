import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workout.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', app: 'SpottLyft API' });
});

app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

app.listen(PORT, () => {
    console.log(`✅ SpottLyft API corriendo en http://localhost:${PORT}`);
});