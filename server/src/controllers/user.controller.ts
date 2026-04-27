import { type Request, type Response } from 'express';
import { getUserById, createUser } from '../services/user.service.js';

export function getUser(req: Request, res: Response): void {
    try {
        const user = getUserById(String(req.params['id']));
        res.status(200).json({ success: true, data: user });
    } catch {
        res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
}

export function postUser(req: Request, res: Response): void {
    const { username, email, gymId } = req.body as { username?: string; email?: string; gymId?: string };

    if (!username || !email || !gymId) {
        res.status(400).json({ success: false, error: 'username, email y gymId son obligatorios' });
        return;
    }

    const user = createUser({ username, email, gymId });
    res.status(201).json({ success: true, data: user });
}