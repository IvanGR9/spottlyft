import { type Request, type Response } from 'express';
import { getAllWorkouts, addWorkout, removeWorkout } from '../services/workout.service.js';

export async function getWorkouts(_req: Request, res: Response): Promise<void> {
  const workouts = await getAllWorkouts();
  res.status(200).json({ success: true, data: workouts });
}

export async function createWorkout(req: Request, res: Response): Promise<void> {
  const { exercises, userId, gymId } = req.body;

  if (!userId || !gymId) {
    res.status(400).json({ success: false, error: 'userId y gymId son obligatorios' });
    return;
  }

  try {
    const workout = await addWorkout({ exercises: exercises ?? [], userId: String(userId), gymId: String(gymId) });
    res.status(201).json({ success: true, data: workout });
  } catch {
    res.status(500).json({ success: false, error: 'Error al crear el entrenamiento' });
  }
}

export async function deleteWorkout(req: Request, res: Response): Promise<void> {
  try {
    await removeWorkout(String(req.params['id']));
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      res.status(404).json({ success: false, error: 'Entrenamiento no encontrado' });
      return;
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}
