import { useState } from 'react';
import LeaderboardCard from '../components/LeaderboardCard.js';
import type { LeaderboardEntry } from '../types/index.js';

const mockData: LeaderboardEntry[] = [
    { userId: '1', username: 'IvanGR9', totalVolume: 5765510, totalWorkouts: 67, streak: 6, rank: 1 },
    { userId: '2', username: 'CarlosF', totalVolume: 4200000, totalWorkouts: 54, streak: 5, rank: 2 },
    { userId: '3', username: 'MartaLP', totalVolume: 3800000, totalWorkouts: 48, streak: 12, rank: 3 },
    { userId: '4', username: 'PabloM', totalVolume: 2900000, totalWorkouts: 39, streak: 3, rank: 4 },
    { userId: '5', username: 'LauraS', totalVolume: 1950000, totalWorkouts: 28, streak: 6, rank: 5 },
  ];

type FilterType = 'volumen' | 'entrenamientos' | 'racha';

export default function Leaderboard() {
  const [filter, setFilter] = useState<FilterType>('volumen');

  const sorted = [...mockData].sort((a, b) => {
    if (filter === 'volumen') return b.totalVolume - a.totalVolume;
    if (filter === 'entrenamientos') return b.totalWorkouts - a.totalWorkouts;
    return b.streak - a.streak;
  }).map((entry, i) => ({ ...entry, rank: i + 1 }));

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Ranking 🏆</h1>
      <p className="text-[#666] text-sm mb-6">Clasificación de tu gimnasio</p>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['volumen', 'entrenamientos', 'racha'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
              filter === f
                ? 'bg-[#e85d26] text-white'
                : 'bg-[#1a1a1a] text-[#666] border border-[#2a2a2a] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {sorted.map(entry => (
          <LeaderboardCard key={entry.userId} entry={entry} />
        ))}
      </div>
    </div>
  );
}