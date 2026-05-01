import { type Request, type Response } from 'express';
import { getAllGyms, getGymById } from '../services/gym.service.js';

export async function getGyms(_req: Request, res: Response): Promise<void> {
  const gyms = await getAllGyms();
  res.status(200).json({ success: true, data: gyms });
}

export async function getGym(req: Request, res: Response): Promise<void> {
  try {
    const gym = await getGymById(String(req.params['id']));
    res.status(200).json({ success: true, data: gym });
  } catch {
    res.status(404).json({ success: false, error: 'Gimnasio no encontrado' });
  }
}
