import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LeaderboardEntry } from '../types/index.js';
import { gymClient } from '../api/client.js';
import { useUser } from '../context/UserContext.js';

type FilterType = 'volumen' | 'entrenamientos' | 'racha';

function Avatar({ src, username, className }: { src?: string; username: string; className: string }) {
  return (
    <div className={`rounded-full overflow-hidden flex items-center justify-center font-bold text-white shrink-0 ${className}`}>
      {src ? <img src={src} alt={username} className="w-full h-full object-cover" /> : username.charAt(0)}
    </div>
  );
}

export default function Leaderboard() {
  const { gym, user } = useUser();
  const navigate = useNavigate();
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
                <button
                  onClick={() => navigate(`/user/${top3[1].userId}`)}
                  className="flex flex-col items-center gap-2 flex-1 group"
                >
                  <span className="text-lg">🥈</span>
                  <Avatar src={top3[1].avatar} username={top3[1].username} className="w-12 h-12 bg-[#1c1c1c] border-2 border-[#71717a] text-lg group-hover:border-white transition-colors" />
                  <p className="text-white text-xs font-semibold truncate max-w-full text-center">{top3[1].username}</p>
                  <p className="text-[#71717a] text-xs">{top3[1].totalVolume.toLocaleString()} kg</p>
                  <p className="text-[#52525b] text-[10px]">{top3[1].totalWorkouts} entrenos · {top3[1].streak}d racha</p>
                  <div className="bg-[#1c1c1c] rounded-t-xl w-full h-16 flex items-center justify-center">
                    <span className="text-[#71717a] font-bold text-xl">2</span>
                  </div>
                </button>
              )}
              {/* 1ro */}
              {top3[0] && (
                <button
                  onClick={() => navigate(`/user/${top3[0].userId}`)}
                  className="flex flex-col items-center gap-2 flex-1 group"
                >
                  <span className="text-lg">👑</span>
                  <Avatar src={top3[0].avatar} username={top3[0].username} className="w-14 h-14 bg-[#f97316] text-xl group-hover:opacity-90 transition-opacity" />
                  <p className="text-white text-xs font-bold truncate max-w-full text-center">{top3[0].username}</p>
                  <p className="text-[#f97316] text-xs font-bold">{top3[0].totalVolume.toLocaleString()} kg</p>
                  <p className="text-[#52525b] text-[10px]">{top3[0].totalWorkouts} entrenos · {top3[0].streak}d racha</p>
                  <div className="bg-[#f97316] rounded-t-xl w-full h-24 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                </button>
              )}
              {/* 3ro */}
              {top3[2] && (
                <button
                  onClick={() => navigate(`/user/${top3[2].userId}`)}
                  className="flex flex-col items-center gap-2 flex-1 group"
                >
                  <span className="text-lg">🥉</span>
                  <Avatar src={top3[2].avatar} username={top3[2].username} className="w-12 h-12 bg-[#1c1c1c] border-2 border-[#a16207] text-lg group-hover:border-orange-400 transition-colors" />
                  <p className="text-white text-xs font-semibold truncate max-w-full text-center">{top3[2].username}</p>
                  <p className="text-[#71717a] text-xs">{top3[2].totalVolume.toLocaleString()} kg</p>
                  <p className="text-[#52525b] text-[10px]">{top3[2].totalWorkouts} entrenos · {top3[2].streak}d racha</p>
                  <div className="bg-[#1c1c1c] rounded-t-xl w-full h-12 flex items-center justify-center">
                    <span className="text-[#a16207] font-bold text-xl">3</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Resto del ranking */}
          <div className="flex flex-col gap-2">
            {rest.map(entry => (
              <button
                key={entry.userId}
                onClick={() => navigate(`/user/${entry.userId}`)}
                className="bg-[#141414] border border-[#1c1c1c] hover:border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center gap-4 w-full text-left transition-colors"
              >
                <span className="text-[#71717a] font-bold text-sm w-6 text-center">{entry.rank}</span>
                <Avatar src={entry.avatar} username={entry.username} className="w-9 h-9 bg-[#1c1c1c] text-sm" />
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{entry.username}</p>
                  <p className="text-[#52525b] text-xs">{entry.totalWorkouts} entrenos · {entry.streak} días racha</p>
                </div>
                <p className="text-[#f97316] font-bold text-sm">{entry.totalVolume.toLocaleString()} kg</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}