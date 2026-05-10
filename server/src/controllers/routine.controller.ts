import { type Request, type Response } from 'express';
import { getRoutinesByUser, createRoutine, deleteRoutine } from '../services/routine.service.js';

export async function getRoutinesByUserHandler(req: Request, res: Response): Promise<void> {
  const userId = req.query['userId'];
  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ success: false, error: 'userId es obligatorio' });
    return;
  }
  try {
    const routines = await getRoutinesByUser(userId);
    res.status(200).json({ success: true, data: routines });
  } catch {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}

export async function createRoutineHandler(req: Request, res: Response): Promise<void> {
  const { userId, gymId, name, exercises } = req.body;
  if (!userId || !gymId || !name) {
    res.status(400).json({ success: false, error: 'userId, gymId y name son obligatorios' });
    return;
  }
  try {
    const routine = await createRoutine({ userId, gymId, name, exercises: exercises ?? [] });
    res.status(201).json({ success: true, data: routine });
  } catch {
    res.status(500).json({ success: false, error: 'Error al crear la rutina' });
  }
}

export async function deleteRoutineHandler(req: Request, res: Response): Promise<void> {
  const id = req.params['id'];
  if (!id) {
    res.status(400).json({ success: false, error: 'id es obligatorio' });
    return;
  }
  try {
    const deleted = await deleteRoutine(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Rutina no encontrada' });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}
