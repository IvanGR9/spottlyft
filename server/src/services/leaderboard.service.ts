import Workout from '../models/Workout.js';
import type { LeaderboardEntry } from '../types/index.js';

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = [...new Set(
    dates.map(d => new Date(d).toISOString().split('T')[0])
  )].sort().reverse() as string[];

  const today = new Date().toISOString().split('T')[0]!;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]!;

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff =
      (new Date(uniqueDays[i - 1]!).getTime() - new Date(uniqueDays[i]!).getTime()) / 86_400_000;
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}

export async function getLeaderboardByGym(gymId: string): Promise<LeaderboardEntry[]> {
  const rows = await Workout.aggregate([
    { $match: { gymId } },
    {
      $group: {
        _id: '$userId',
        totalVolume:   { $sum: '$totalVolume' },
        totalWorkouts: { $sum: 1 },
        dates:         { $push: '$date' },
      },
    },
    {
      $lookup: {
        from:         'users',
        localField:   '_id',
        foreignField: '_id',
        as:           'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id:           0,
        userId:        { $toString: '$_id' },
        username:      '$user.username',
        totalVolume:   1,
        totalWorkouts: 1,
        dates:         1,
      },
    },
    { $sort: { totalVolume: -1 } },
  ]);

  return rows.map((row, index) => ({
    userId:        row.userId,
    username:      row.username,
    totalVolume:   row.totalVolume,
    totalWorkouts: row.totalWorkouts,
    streak:        calculateStreak(row.dates),
    rank:          index + 1,
  }));
}
