import { type Request, type Response } from 'express';
import { getAllWorkouts, addWorkout, removeWorkout } from '../services/workout.service.js';

export function getWorkouts(req: Request, res: Response): void {
    const workouts = getAllWorkouts();
    res.status(200).json({ success: true, data: workouts });
}

export function createWorkout(req: Request, res: Response): void {
    const { title, exercises, userId, gymId } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 2) {
        res.status(400).json({ success: false, error: 'El título debe tener al menos 2 caracteres' });
        return;
    }

    if (!userId || !gymId) {
        res.status(400).json({ success: false, error: 'userId y gymId son obligatorios' });
        return;
    }

    const workout = addWorkout({ exercises: exercises ?? [], userId: String(userId), gymId: String(gymId) });
    res.status(201).json({ success: true, data: workout });
}

export function deleteWorkout(req: Request, res: Response): void {
    try {
        const { id } = req.params;
        removeWorkout(String(id));
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error && error.message === 'NOT_FOUND') {
            res.status(404).json({ success: false, error: 'Entrenamiento no encontrado' });
            return;
        }
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
}