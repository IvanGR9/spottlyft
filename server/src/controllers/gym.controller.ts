import { type Request, type Response } from 'express';
import { getGymById, getAllGyms } from '../services/gym.service.js';

export function getGyms(_req: Request, res: Response): void {
    const gyms = getAllGyms();
    res.status(200).json({ success: true, data: gyms });
}

export function getGym(req: Request, res: Response): void {
    try {
        const gym = getGymById(String(req.params['id']));
        res.status(200).json({ success: true, data: gym });
    } catch {
        res.status(404).json({ success: false, error: 'Gimnasio no encontrado' });
    }
}