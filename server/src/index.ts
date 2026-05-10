import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import workoutRoutes from './routes/workout.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import gymRoutes from './routes/gym.routes.js';
import userRoutes from './routes/user.routes.js';
import routineRoutes from './routes/routine.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
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
app.use('/api/v1/routines', routineRoutes);

app.listen(PORT, () => {
    console.log(`✅ SpottLyft API corriendo en http://localhost:${PORT}`);
});