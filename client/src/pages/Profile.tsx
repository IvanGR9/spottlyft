import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';
import { workoutClient, gymClient } from '../api/client.js';
import type { Workout, LeaderboardEntry } from '../types/index.js';

const tabs = ['Resumen', 'Historial', 'Logros'];

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}K kg`;
  return `${kg} kg`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function rankOf(list: LeaderboardEntry[], userId: string, key: keyof LeaderboardEntry): number {
  return [...list]
    .sort((a, b) => (b[key] as number) - (a[key] as number))
    .findIndex(e => e.userId === userId) + 1;
}

function computeBestMarks(workouts: Workout[]): { name: string; kg: number }[] {
  const map = new Map<string, number>();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      if (!ex.name) continue;
      for (const s of ex.sets) {
        const kg = s.kg ?? 0;
        if (kg > (map.get(ex.name) ?? 0)) map.set(ex.name, kg);
      }
    }
  }
  return [...map.entries()]
    .map(([name, kg]) => ({ name, kg }))
    .sort((a, b) => b.kg - a.kg)
    .slice(0, 5);
}

export default function Profile() {
  const { user, gym } = useUser();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Resumen');
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!user || user.id === 'guest') { setLoading(false); return; }
    (async () => {
      try {
        console.log('[Profile] user.id:', user.id);
        const w = await workoutClient.getByUser(user.id);
        console.log('[Profile] workouts response:', w);
        setWorkouts(w);
      } catch (err) {
        console.error('[Profile] workouts fetch failed:', err);
      }

      try {
        const lb = await gymClient.getLeaderboard(user.gymId);
        setLeaderboard(lb);
      } catch (err) {
        console.error('[Profile] leaderboard fetch failed, usando streak del contexto:', err);
      }

      setLoading(false);
    })();
  }, [user?.id, user?.gymId]);

  if (user?.id === 'guest') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-10 max-w-sm w-full text-center">
          <p className="text-6xl mb-6">👤</p>
          <h2 className="text-white font-bold text-xl mb-3">Crea tu perfil en SpottLyft</h2>
          <p className="text-[#71717a] text-sm mb-8">
            Regístrate para ver tu historial, estadísticas y posición en el ranking
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-3.5 rounded-xl transition-colors text-sm mb-3"
          >
            Crear cuenta
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full bg-[#141414] hover:bg-[#1c1c1c] text-white font-semibold py-3.5 rounded-xl border border-[#2a2a2a] transition-colors text-sm"
          >
            Ver ranking
          </button>
        </div>
      </div>
    );
  }

  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolume ?? 0), 0);
  const totalWorkouts = workouts.length;
  const myEntry = leaderboard.find(e => e.userId === user?.id);
  const streak = myEntry?.streak ?? user?.streak ?? 0;
  const rankVol = rankOf(leaderboard, user!.id, 'totalVolume');
  const rankDisplay = rankVol > 0 ? `#${rankVol}` : '—';

  const bestMarks = computeBestMarks(workouts);

  const achievements = [
    { icon: '🔥', title: `Racha de 6 días`,    unlocked: streak >= 6 },
    { icon: '💪', title: '50 entrenamientos',   unlocked: totalWorkouts >= 50 },
    { icon: '🏆', title: '#1 del gimnasio',      unlocked: rankVol === 1 },
    { icon: '⚡', title: 'Racha de 30 días',     unlocked: streak >= 30 },
    { icon: '🎯', title: '100 entrenamientos',   unlocked: totalWorkouts >= 100 },
    { icon: '👑', title: 'Leyenda del gimnasio', unlocked: totalWorkouts >= 200 && streak >= 60 },
  ];

  const recentAchievements = [
    streak > 0 ? { icon: '🔥', title: `Racha de ${streak} días`, sub: streak >= 7 ? '¡Imparable!' : '¡Sigue así!' } : null,
    totalVolume > 0 ? { icon: '💪', title: `${formatVolume(totalVolume)} acumulados`, sub: 'Volumen total' } : null,
    rankVol > 0 ? { icon: '🏆', title: `${rankDisplay} del gimnasio`, sub: 'Posición en ranking' } : null,
  ].filter((a): a is { icon: string; title: string; sub: string } => a !== null);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">

      {/* Cabecera */}
      <div className="mb-8">
        <p className="text-[#71717a] text-sm mb-1">Tu historial y estadísticas</p>
        <h1 className="text-2xl font-bold text-white">Perfil</h1>
      </div>

      {/* Info usuario */}
      <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-[#f97316] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-bold text-xl">{user?.username}</h2>
              {rankVol > 0 && (
                <span className="bg-[#f97316] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {rankVol === 1 ? '🥇' : rankVol === 2 ? '🥈' : rankVol === 3 ? '🥉' : '🏅'} {rankDisplay}
                </span>
              )}
            </div>
            <p className="text-[#52525b] text-sm mt-0.5">{gym?.name ?? 'Gimnasio'} · Miembro</p>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1c1c1c]">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{formatVolume(totalVolume)}</p>
            <p className="text-[#52525b] text-xs mt-1">Volumen total</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{loading ? '—' : totalWorkouts}</p>
            <p className="text-[#52525b] text-xs mt-1">Entrenamientos</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{streak} días</p>
            <p className="text-[#52525b] text-xs mt-1">Racha actual</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#141414] border border-[#1c1c1c] rounded-xl p-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-[#f97316] text-white' : 'text-[#71717a] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Resumen */}
      {activeTab === 'Resumen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Mejores marcas</p>
            {loading && <p className="text-[#52525b] text-sm">Cargando...</p>}
            {!loading && bestMarks.length === 0 && (
              <p className="text-[#52525b] text-sm">Sin registros aún</p>
            )}
            <div className="flex flex-col gap-3">
              {bestMarks.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <p className="text-white text-sm truncate mr-2">{r.name}</p>
                  <p className="text-[#f97316] font-bold text-sm shrink-0">{r.kg} kg</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Logros recientes</p>
            {!loading && recentAchievements.length === 0 && (
              <p className="text-[#52525b] text-sm">Empieza a entrenar para desbloquear logros</p>
            )}
            <div className="flex flex-col gap-3">
              {recentAchievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{a.title}</p>
                    <p className="text-[#52525b] text-xs">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Historial */}
      {activeTab === 'Historial' && (
        <div className="flex flex-col gap-2">
          {loading && <p className="text-[#71717a] text-sm text-center py-6">Cargando...</p>}
          {!loading && workouts.length === 0 && (
            <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">🏋️</p>
              <p className="text-white font-semibold mb-1">Sin entrenamientos aún</p>
              <p className="text-[#71717a] text-sm">Completa tu primer entrenamiento para verlo aquí</p>
            </div>
          )}
          {!loading && workouts.slice(0, visibleCount).map(w => {
            const key = w.id ?? String((w as Record<string, unknown>)._id);
            return (
              <button
                key={key}
                onClick={() => navigate(`/workout/${key}`)}
                className="bg-[#141414] border border-[#1c1c1c] rounded-xl px-4 py-3 flex items-center justify-between w-full text-left hover:border-[#f97316]/30 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {w.title ?? w.exercises[0]?.name ?? 'Entrenamiento'}
                  </p>
                  <p className="text-[#52525b] text-xs mt-0.5">
                    {formatDate(w.date)}{w.duration ? ` · ${w.duration} min` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <p className="text-[#f97316] font-bold text-sm">{formatVolume(w.totalVolume)}</p>
                  <span className="text-[#52525b] group-hover:text-[#f97316] transition-colors text-xs">›</span>
                </div>
              </button>
            );
          })}
          {!loading && visibleCount < workouts.length && (
            <button
              onClick={() => setVisibleCount(c => c + 5)}
              className="w-full py-3 text-[#71717a] hover:text-white text-sm font-medium transition-colors border border-[#1c1c1c] rounded-xl hover:border-[#f97316]/30"
            >
              Ver más ({workouts.length - visibleCount} restantes)
            </button>
          )}
        </div>
      )}

      {/* Tab: Logros */}
      {activeTab === 'Logros' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`bg-[#141414] border rounded-2xl p-4 text-center ${
                a.unlocked ? 'border-[#f97316]/30' : 'border-[#1c1c1c] opacity-40'
              }`}
            >
              <span className="text-3xl">{a.icon}</span>
              <p className={`text-sm font-semibold mt-2 ${a.unlocked ? 'text-white' : 'text-[#52525b]'}`}>
                {a.title}
              </p>
              {!a.unlocked && <p className="text-[#52525b] text-xs mt-1">Bloqueado</p>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
