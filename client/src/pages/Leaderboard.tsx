import { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../types/index.js';
import { gymClient } from '../api/client.js';
import { useUser } from '../context/UserContext.js';

type FilterType = 'volumen' | 'entrenamientos' | 'racha';

export default function Leaderboard() {
  const { gym, user } = useUser();
  const gymId = gym?.id ?? user?.gymId ?? 'lowgim';

  const [filter, setFilter] = useState<FilterType>('volumen');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const result = await gymClient.getLeaderboard(gymId);
        setData(result);
      } catch {
        setError('No se pudo cargar el ranking');
      } finally {
        setLoading(false);
      }
    }
    void fetchLeaderboard();
  }, [gymId]);

  const sorted = [...data].sort((a, b) => {
    if (filter === 'volumen') return b.totalVolume - a.totalVolume;
    if (filter === 'entrenamientos') return b.totalWorkouts - a.totalWorkouts;
    return b.streak - a.streak;
  }).map((entry, i) => ({ ...entry, rank: i + 1 }));

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#71717a] text-sm mb-1">Compite contra los miembros de tu gimnasio</p>
          <h1 className="text-2xl font-bold text-white">Ranking 🏆</h1>
        </div>
        <select
          className="bg-[#141414] border border-[#1c1c1c] text-white text-sm rounded-xl px-3 py-2 outline-none"
          defaultValue="semana"
        >
          <option value="semana">Esta semana</option>
          <option value="mes">Este mes</option>
          <option value="total">Todo el tiempo</option>
        </select>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['volumen', 'entrenamientos', 'racha'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? 'bg-[#f97316] text-white'
                : 'bg-[#141414] text-[#71717a] border border-[#1c1c1c] hover:text-white'
            }`}
          >
            {f === 'volumen' ? 'Volumen total' : f === 'entrenamientos' ? 'Entrenamientos' : 'Racha de días'}
          </button>
        ))}
      </div>

      {loading && <p className="text-[#71717a] text-sm text-center py-10">Cargando ranking...</p>}
      {error && <p className="text-red-400 text-sm text-center py-10">{error}</p>}

      {!loading && !error && (
        <>
          {/* Top 3 podio */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-4">
            <div className="flex items-end justify-center gap-4">
              {/* 2do */}
              {top3[1] && (
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border-2 border-[#71717a] flex items-center justify-center text-white font-bold text-lg">
                    {top3[1].username.charAt(0)}
                  </div>
                  <p className="text-white text-xs font-semibold truncate max-w-full text-center">{top3[1].username}</p>
                  <p className="text-[#71717a] text-xs">{top3[1].totalVolume.toLocaleString()} kg</p>
                  <div className="bg-[#1c1c1c] rounded-t-xl w-full h-16 flex items-center justify-center">
                    <span className="text-[#71717a] font-bold text-xl">2</span>
                  </div>
                </div>
              )}
              {/* 1ro */}
              {top3[0] && (
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-lg">👑</span>
                  <div className="w-14 h-14 rounded-full bg-[#f97316] flex items-center justify-center text-white font-bold text-xl">
                    {top3[0].username.charAt(0)}
                  </div>
                  <p className="text-white text-xs font-bold truncate max-w-full text-center">{top3[0].username}</p>
                  <p className="text-[#f97316] text-xs font-bold">{top3[0].totalVolume.toLocaleString()} kg</p>
                  <div className="bg-[#f97316] rounded-t-xl w-full h-24 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                </div>
              )}
              {/* 3ro */}
              {top3[2] && (
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border-2 border-[#a16207] flex items-center justify-center text-white font-bold text-lg">
                    {top3[2].username.charAt(0)}
                  </div>
                  <p className="text-white text-xs font-semibold truncate max-w-full text-center">{top3[2].username}</p>
                  <p className="text-[#71717a] text-xs">{top3[2].totalVolume.toLocaleString()} kg</p>
                  <div className="bg-[#1c1c1c] rounded-t-xl w-full h-12 flex items-center justify-center">
                    <span className="text-[#a16207] font-bold text-xl">3</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resto del ranking */}
          <div className="flex flex-col gap-2">
            {rest.map(entry => (
              <div key={entry.userId} className="bg-[#141414] border border-[#1c1c1c] rounded-xl px-4 py-3 flex items-center gap-4">
                <span className="text-[#71717a] font-bold text-sm w-6 text-center">{entry.rank}</span>
                <div className="w-9 h-9 rounded-full bg-[#1c1c1c] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {entry.username.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{entry.username}</p>
                  <p className="text-[#52525b] text-xs">{entry.totalWorkouts} entrenos · {entry.streak} días racha</p>
                </div>
                <p className="text-[#f97316] font-bold text-sm">{entry.totalVolume.toLocaleString()} kg</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}