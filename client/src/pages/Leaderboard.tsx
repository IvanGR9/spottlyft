import { useState, useEffect } from 'react';
import LeaderboardCard from '../components/LeaderboardCard.js';
import type { LeaderboardEntry } from '../types/index.js';
import { gymClient } from '../api/client.js';

type FilterType = 'volumen' | 'entrenamientos' | 'racha';

export default function Leaderboard() {
  const [filter, setFilter] = useState<FilterType>('volumen');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
        try {
            const result = await gymClient.getLeaderboard('gym-1');
            setData(result);
        } catch {
            setError('No se pudo cargar el ranking');
        } finally {
            setLoading(false);
        }
    }
    void fetchLeaderboard();
}, []);

  const sorted = [...data].sort((a, b) => {
    if (filter === 'volumen') return b.totalVolume - a.totalVolume;
    if (filter === 'entrenamientos') return b.totalWorkouts - a.totalWorkouts;
    return b.streak - a.streak;
  }).map((entry, i) => ({ ...entry, rank: i + 1 }));

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Ranking 🏆</h1>
      <p className="text-[#666] text-sm mb-6">Clasificación de tu gimnasio</p>

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

      {loading && (
        <div className="text-center text-[#666] py-10">Cargando ranking...</div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-red-400 text-sm">{error}</div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {sorted.map(entry => (
            <LeaderboardCard key={entry.userId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}