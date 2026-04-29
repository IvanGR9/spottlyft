import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workout.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import gymRoutes from './routes/gym.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            'https://spottlyft.vercel.app',
            'http://localhost:5173',
        ];
        if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', app: 'SpottLyft API' });
});

app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/gyms', gymRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
    console.log(`✅ SpottLyft API corriendo en http://localhost:${PORT}`);
});