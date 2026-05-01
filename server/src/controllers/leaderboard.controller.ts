import { type Request, type Response } from 'express';
import { getLeaderboardByGym } from '../services/leaderboard.service.js';

export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  try {
    const leaderboard = await getLeaderboardByGym(String(req.params['gymId']));
    res.status(200).json({ success: true, data: leaderboard });
  } catch {
    res.status(500).json({ success: false, error: 'Error al obtener el leaderboard' });
  }
}
