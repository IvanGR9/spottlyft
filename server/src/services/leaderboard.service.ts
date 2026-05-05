import Workout from '../models/Workout.js';
import type { LeaderboardEntry } from '../types/index.js';

function toLocalDay(d: Date): number {
  const local = new Date(d);
  local.setHours(0, 0, 0, 0);
  return local.getTime();
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = [...new Set(dates.map(d => toLocalDay(new Date(d))))]
    .sort((a, b) => b - a);

  const todayMs     = toLocalDay(new Date());
  const yesterdayMs = todayMs - 86_400_000;

  if (uniqueDays[0] !== todayMs && uniqueDays[0] !== yesterdayMs) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i - 1]! - uniqueDays[i]! === 86_400_000) streak++;
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
