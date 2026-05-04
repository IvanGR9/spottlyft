import { type Request, type Response } from 'express';
import { getLeaderboardByGym } from '../services/leaderboard.service.js';
import { getGymById } from '../services/gym.service.js';

export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  try {
    const gym = await getGymById(String(req.params['gymId']));
    const leaderboard = await getLeaderboardByGym(gym.id as string);
    res.status(200).json({ success: true, data: leaderboard });
  } catch {
    res.status(500).json({ success: false, error: 'Error al obtener el leaderboard' });
  }
}
