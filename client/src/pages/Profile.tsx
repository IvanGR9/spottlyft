import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard.js';
import { useUser } from '../context/UserContext.js';
import { workoutClient } from '../api/client.js';
import type { Workout } from '../types/index.js';

export default function Profile() {
  const { user, gym } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="px-4 py-6 max-w-2xl mx-auto">

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#e85d26] flex items-center justify-center text-white font-bold text-2xl">
          {user?.username.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{user?.username ?? 'Usuario'}</h1>
          <p className="text-[#666] text-sm">SpottLyft · {gym?.name ?? 'Sin gimnasio'}</p>
        </div>
        <div className="ml-auto bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
          🥇 #1 Ranking
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Entrenamientos" value="67" />
        <StatCard label="Volumen total" value="430K kg" />
        <StatCard label="Racha actual" value="6 días" />
      </div>

      <h2 className="text-lg font-semibold text-white mb-3">Historial reciente</h2>

      {loading && (
        <div className="text-center text-[#666] py-6">Cargando historial...</div>
      )}

      {!loading && (
        <div className="flex flex-col gap-3">
          {workouts.map(w => (
            <div key={w.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{w.exercises[0]?.name ?? 'Entrenamiento'}</p>
                <p className="text-[#666] text-xs mt-1">{w.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[#e85d26] font-bold">{w.totalVolume.toLocaleString()} kg</p>
                <p className="text-[#666] text-xs">volumen</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}