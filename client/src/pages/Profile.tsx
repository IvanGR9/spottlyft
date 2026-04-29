import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { workoutClient } from '../api/client.js';
import type { Workout } from '../types/index.js';

const tabs = ['Resumen', 'Historial', 'Logros'];

export default function Profile() {
  const { user, gym } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Resumen');

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const data = await workoutClient.getAll();
        setWorkouts(data);
      } catch {
        console.error('No se pudieron cargar los entrenamientos');
      } finally {
        setLoading(false);
      }
    }
    void fetchWorkouts();
  }, []);

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
              <span className="bg-[#f97316] text-white text-xs font-bold px-2.5 py-1 rounded-full">🥇 #1</span>
            </div>
            <p className="text-[#52525b] text-sm mt-0.5">{gym?.name} · Miembro</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[#52525b] text-xs">Miembro desde</p>
            <p className="text-white text-sm font-semibold">Mar 2024</p>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1c1c1c]">
          <div className="text-center">
            <p className="text-white font-bold text-xl">430K kg</p>
            <p className="text-[#52525b] text-xs mt-1">Volumen total</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">67</p>
            <p className="text-[#52525b] text-xs mt-1">Entrenamientos</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">6 días</p>
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

      {/* Contenido tabs */}
      {activeTab === 'Resumen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Mejores marcas</p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Prensa de piernas', value: '240 kg' },
                { name: 'Press inclinado Smith', value: '70 kg' },
                { name: 'Jalón al pecho', value: '83 kg' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-white text-sm">{r.name}</p>
                  <p className="text-[#f97316] font-bold text-sm">{r.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Logros recientes</p>
            <div className="flex flex-col gap-3">
              {[
                { icon: '🔥', title: 'Racha de 6 días', sub: '¡Imparable!' },
                { icon: '💪', title: 'Volumen semanal 33K kg', sub: 'Semana perfecta' },
                { icon: '🏆', title: '#1 del gimnasio', sub: 'Líder del ranking' },
              ].map((a, i) => (
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

      {activeTab === 'Historial' && (
        <div className="flex flex-col gap-3">
          {loading && <p className="text-[#71717a] text-sm text-center py-6">Cargando...</p>}
          {!loading && workouts.map(w => (
            <div key={w.id} className="bg-[#141414] border border-[#1c1c1c] rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">{w.exercises[0]?.name ?? 'Entrenamiento'}</p>
                <p className="text-[#52525b] text-xs mt-0.5">{w.date}</p>
              </div>
              <p className="text-[#f97316] font-bold text-sm">{w.totalVolume.toLocaleString()} kg</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Logros' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: '🔥', title: 'Racha de 6 días', locked: false },
            { icon: '💪', title: '50 entrenamientos', locked: false },
            { icon: '🏆', title: '#1 del gimnasio', locked: false },
            { icon: '⚡', title: 'Racha de 30 días', locked: true },
            { icon: '🎯', title: '100 entrenamientos', locked: true },
            { icon: '👑', title: 'Leyenda del gimnasio', locked: true },
          ].map((a, i) => (
            <div key={i} className={`bg-[#141414] border rounded-2xl p-4 text-center ${a.locked ? 'border-[#1c1c1c] opacity-40' : 'border-[#f97316]/30'}`}>
              <span className="text-3xl">{a.icon}</span>
              <p className={`text-sm font-semibold mt-2 ${a.locked ? 'text-[#52525b]' : 'text-white'}`}>{a.title}</p>
              {a.locked && <p className="text-[#52525b] text-xs mt-1">Bloqueado</p>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}