import type { LeaderboardEntry } from '../types/index.js';

const leaderboardData: LeaderboardEntry[] = [
    { userId: 'user-1', username: 'IvanGR9', totalVolume: 430247, totalWorkouts: 67, streak: 6, rank: 1 },
    { userId: 'user-2', username: 'CarlosF', totalVolume: 381934, totalWorkouts: 54, streak: 5, rank: 2 },
    { userId: 'user-3', username: 'MartaLP', totalVolume: 312581, totalWorkouts: 48, streak: 12, rank: 3 },
    { userId: 'user-4', username: 'PabloM', totalVolume: 243763, totalWorkouts: 39, streak: 3, rank: 4 },
    { userId: 'user-5', username: 'LauraS', totalVolume: 178412, totalWorkouts: 28, streak: 6, rank: 5 },
];

export function getLeaderboardByGym(gymId: string): LeaderboardEntry[] {
    console.log(`Obteniendo leaderboard para gimnasio: ${gymId}`);
    return leaderboardData;
}