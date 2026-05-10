import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';
import { workoutClient, gymClient } from '../api/client.js';
import type { Workout, LeaderboardEntry } from '../types/index.js';

const GUEST_TOP3 = [
  { name: 'IvanGR9', weight: '33.060 kg', kg: 33.060, medal: '🥇' },
  { name: 'CarlosF', weight: '28.450 kg', kg: 28.450, medal: '🥈' },
  { name: 'MartaLP', weight: '22.180 kg', kg: 22.180, medal: '🥉' },
];

const GUEST_STATS = [
  { value: '238+', label: 'miembros activos' },
  { value: '33K kg', label: 'levantados esta semana' },
  { value: '6 días', label: 'mejor racha activa' },
];

function GuestHome({ navigate }: { navigate: (path: string) => void }) {
  const maxKg = GUEST_TOP3[0].kg;
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-6 py-14 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <img src="/logo.png" className="w-20 h-20 mb-6" alt="SpottLyft logo" />
        <h1 className="text-3xl font-black text-white leading-tight mb-3">
          ¿Eres el más fuerte<br />de tu gimnasio?
        </h1>
        <p className="text-[#71717a] text-base">Únete a SpottLyft y descúbrelo</p>
      </div>

      <div className="w-full bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-4">
        <p className="text-white font-bold text-base mb-5">🏆 Ranking esta semana</p>
        <div className="flex flex-col gap-5">
          {GUEST_TOP3.map((entry) => {
            const pct = Math.round((entry.kg / maxKg) * 100);
            return (
              <div key={entry.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.medal}</span>
                    <p className="text-white font-bold text-sm">{entry.name}</p>
                  </div>
                  <p className="text-[#f97316] font-black text-lg">{entry.weight}</p>
                </div>
                <div className="w-full h-1.5 bg-[#1c1c1c] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f97316] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-3 gap-2 text-center">
          {GUEST_STATS.map((s) => (
            <div key={s.label}>
              <p className="text-white font-black text-2xl">{s.value}</p>
              <p className="text-[#52525b] text-xs mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/login')}
        className="w-full bg-[#f97316] hover:bg-[#ea6c0a] active:scale-95 text-white font-black py-4 rounded-2xl text-base transition-all mb-4"
      >
        Empieza gratis ahora →
      </button>
      <p className="text-[#71717a] text-sm">
        ¿Ya tienes cuenta?{' '}
        <span className="text-[#f97316] cursor-pointer hover:underline" onClick={() => navigate('/login')}>
          Inicia sesión
        </span>
      </p>
    </div>
  );
}

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}K kg`;
  return `${kg} kg`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function rankOf(list: LeaderboardEntry[], userId: string, key: keyof LeaderboardEntry): number {
  return [...list]
    .sort((a, b) => (b[key] as number) - (a[key] as number))
    .findIndex(e => e.userId === userId) + 1;
}

export default function Home() {
  const { user, gym } = useUser();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user || user.id === 'guest') {
        setLoading(false);
        return;
      }
      try {
        const [w, lb] = await Promise.all([
          workoutClient.getByUser(user.id),
          gymClient.getLeaderboard(user.gymId),
        ]);
        setWorkouts(w);
        setLeaderboard(lb);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, user?.gymId]);

  if (user?.id === 'guest') return <GuestHome navigate={navigate} />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#71717a]">Cargando...</p>
      </div>
    );
  }

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolume ?? 0), 0);
  const myEntry = leaderboard.find(e => e.userId === user?.id);
  const streak = myEntry?.streak ?? 0;

  if (totalWorkouts === 0) {
    const gymName = gym?.name ?? 'tu gimnasio';
    const medals = ['🥇', '🥈', '🥉'];
    const top3 = [...leaderboard]
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 3);
    const maxVol = top3[0]?.totalVolume ?? 1;

    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">

        {/* Cabecera */}
        <div className="mb-8">
          <p className="text-[#71717a] text-sm mb-1">Bienvenido a SpottLyft</p>
          <h1 className="text-2xl font-bold text-white">¡Hola, {user?.username}! 👋</h1>
          <p className="text-[#52525b] text-sm mt-1">Tu historia empieza hoy. No hay excusas.</p>
        </div>

        {/* Hero */}
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-7 mb-4 relative overflow-hidden">
          <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-3">Tu reto</p>
          <h2 className="text-white font-black text-2xl leading-tight mb-2">
            ¿Eres el más fuerte<br />de {gymName}?
          </h2>
          <p className="text-[#71717a] text-sm mb-6">
            Hay gente levantando kilos ahora mismo. Cada día que no entrenas, alguien te supera.
          </p>
          <button
            onClick={() => navigate('/routines')}
            className="bg-[#f97316] hover:bg-[#ea6c0a] active:scale-95 text-white font-bold py-3 px-7 rounded-xl text-sm transition-all"
          >
            Empezar ahora →
          </button>
        </div>

        {/* Preview ranking */}
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-4">
          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">
            Así está {gymName} ahora mismo
          </p>
          {top3.length === 0 ? (
            <p className="text-[#52525b] text-sm">Sin datos de ranking todavía.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {top3.map((entry, i) => {
                const pct = Math.round((entry.totalVolume / maxVol) * 100);
                return (
                  <div key={entry.userId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{medals[i]}</span>
                        <p className="text-white font-semibold text-sm">{entry.username}</p>
                      </div>
                      <p className="text-[#f97316] font-bold text-sm">{formatVolume(entry.totalVolume)}</p>
                    </div>
                    <div className="w-full h-1.5 bg-[#1c1c1c] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f97316] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => navigate('/leaderboard')}
            className="mt-4 text-[#71717a] hover:text-white text-xs transition-colors"
          >
            Ver ranking completo →
          </button>
        </div>

        {/* CTA rutinas */}
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm mb-1">Crea tu primera rutina</p>
            <p className="text-[#71717a] text-xs">
              Elige ejercicios, define series y empieza a registrar tu progreso.
            </p>
          </div>
          <button
            onClick={() => navigate('/routines')}
            className="shrink-0 border border-[#f97316]/50 text-[#f97316] hover:bg-[#f97316]/10 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            Crear
          </button>
        </div>

      </div>
    );
  }

  const stats = [
    { label: 'Entrenamientos', value: String(totalWorkouts) },
    { label: 'Volumen total', value: formatVolume(totalVolume) },
    { label: 'Racha actual', value: `${streak} días` },
  ];

  const ranking = [
    { label: 'Volumen total', value: rankOf(leaderboard, user!.id, 'totalVolume') },
    { label: 'Entrenamientos', value: rankOf(leaderboard, user!.id, 'totalWorkouts') },
    { label: 'Racha de días', value: rankOf(leaderboard, user!.id, 'streak') },
  ].map(r => ({ ...r, value: r.value > 0 ? `#${r.value}` : '-' }));

  const recentActivity = workouts.slice(0, 3).map(w => ({
    id: w.id,
    title: w.title ?? w.exercises[0]?.name ?? 'Entrenamiento',
    date: formatDate(w.date),
    duration: w.duration ? `${w.duration} min` : null,
    volume: formatVolume(w.totalVolume),
  }));

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-[#71717a] text-sm mb-1">Resumen de tu progreso esta semana</p>
        <h1 className="text-2xl font-bold text-white">Inicio ⚡</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {/* Estadísticas */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Estadísticas</p>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-white font-bold text-xl">{s.value}</p>
                  <p className="text-[#52525b] text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Racha */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold text-sm">Racha actual</p>
              <span className="text-[#f97316] font-bold text-sm">🔥 {streak} días</span>
            </div>
            <div className="flex gap-1.5">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-full h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i < streak ? 'bg-[#f97316] text-white' : 'bg-[#1c1c1c] text-[#52525b]'}`}>
                    {i < streak ? '✓' : '·'}
                  </div>
                  <span className="text-[#52525b] text-xs">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Actividad reciente</p>
            <div className="flex flex-col gap-1">
              {recentActivity.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/workout/${a.id}`)}
                  className="flex items-center justify-between gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1c1c1c] transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{a.title}</p>
                    <p className="text-[#52525b] text-xs mt-0.5">
                      {a.date}{a.duration ? ` · ${a.duration}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-[#f97316] text-sm font-bold">{a.volume}</p>
                    <span className="text-[#52525b] group-hover:text-[#f97316] transition-colors text-xs">›</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Tu posición */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Tu posición</p>
            <div className="flex flex-col gap-3">
              {ranking.map(r => (
                <div key={r.label} className="flex items-center justify-between bg-[#1c1c1c] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏆</span>
                    <p className="text-white text-sm font-medium">{r.label}</p>
                  </div>
                  <p className="text-[#f97316] font-bold text-lg">{r.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botón entrenar */}
          <button
            onClick={() => navigate('/workout')}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-4 rounded-2xl text-base transition-colors"
          >
            + Iniciar entrenamiento
          </button>

          {/* Perfil */}
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f97316] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold">{user?.username}</p>
                <p className="text-[#52525b] text-xs mt-0.5">Miembro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
