import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workoutClient } from '../api/client.js';
import type { Workout } from '../types/index.js';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}K kg`;
  return `${kg} kg`;
}

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const w = await workoutClient.getById(id);
        setWorkout(w);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#71717a]">Cargando...</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-[#71717a] text-sm mb-6 flex items-center gap-1 hover:text-white transition-colors">
          ‹ Volver
        </button>
        <p className="text-[#71717a]">No se encontró el entrenamiento.</p>
      </div>
    );
  }

  const title = workout.title ?? workout.exercises[0]?.name ?? 'Entrenamiento';

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">

      {/* Cabecera */}
      <button
        onClick={() => navigate(-1)}
        className="text-[#71717a] text-sm mb-6 flex items-center gap-1 hover:text-white transition-colors"
      >
        ‹ Volver
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-[#71717a] text-sm mt-1 capitalize">{formatDate(workout.date)}</p>
      </div>

      {/* Resumen */}
      <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-6">
        <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Resumen</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-white font-bold text-xl">{formatVolume(workout.totalVolume)}</p>
            <p className="text-[#52525b] text-xs mt-1">Volumen total</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl">{workout.exercises.length}</p>
            <p className="text-[#52525b] text-xs mt-1">Ejercicios</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl">
              {workout.duration ? `${workout.duration} min` : '—'}
            </p>
            <p className="text-[#52525b] text-xs mt-1">Duración</p>
          </div>
        </div>
      </div>

      {/* Ejercicios */}
      <div className="flex flex-col gap-4">
        {workout.exercises.map((ex, ei) => (
          <div key={ei} className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5">
            <p className="text-white font-semibold mb-3">{ex.name ?? `Ejercicio ${ei + 1}`}</p>
            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-3 gap-2 mb-1">
                <p className="text-[#52525b] text-xs font-medium">Serie</p>
                <p className="text-[#52525b] text-xs font-medium text-center">Peso</p>
                <p className="text-[#52525b] text-xs font-medium text-center">Reps</p>
              </div>
              {ex.sets.map((s, si) => (
                <div key={si} className="grid grid-cols-3 gap-2 bg-[#1c1c1c] rounded-lg px-3 py-2">
                  <p className="text-[#71717a] text-sm">{si + 1}</p>
                  <p className="text-white text-sm font-medium text-center">
                    {s.kg != null ? `${s.kg} kg` : '—'}
                  </p>
                  <p className="text-white text-sm font-medium text-center">
                    {s.reps != null ? s.reps : '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
