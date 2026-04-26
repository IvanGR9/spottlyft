import { type Request, type Response } from 'express';
import { getLeaderboardByGym } from '../services/leaderboard.service.js';

export function getLeaderboard(req: Request, res: Response): void {
    const { gymId } = req.params;
    const leaderboard = getLeaderboardByGym(String(gymId));
    res.status(200).json({ success: true, data: leaderboard });
}