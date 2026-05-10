import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';
import { routineClient } from '../api/client.js';
import type { Routine } from '../types/index.js';

export default function Routines() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user || user.id === 'guest') { setLoading(false); return; }
    (async () => {
      try {
        const data = await routineClient.getByUser(user.id);
        setRoutines(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (user?.id === 'guest') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-10 max-w-sm w-full text-center">
          <p className="text-6xl mb-6">🔒</p>
          <h2 className="text-white font-bold text-xl mb-3">Función exclusiva para miembros</h2>
          <p className="text-[#71717a] text-sm mb-8">
            Crea una cuenta gratuita para guardar y gestionar tus rutinas
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#71717a] text-sm mb-1">Tus rutinas guardadas</p>
          <h1 className="text-2xl font-bold text-white">Entrenar</h1>
        </div>
        <button
          onClick={() => navigate('/workout')}
          className="bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm shrink-0"
        >
          + Nueva rutina
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-[#71717a]">Cargando...</p>
        </div>
      )}

      {!loading && error && (
        <p className="text-[#71717a] text-sm text-center mt-16">
          No se pudieron cargar las rutinas.
        </p>
      )}

      {!loading && !error && routines.length === 0 && (
        <div className="bg-[#141414] border border-dashed border-[#2a2a2a] rounded-2xl p-10 text-center">
          <p className="text-3xl mb-4">📋</p>
          <p className="text-white font-semibold mb-2">Sin rutinas todavía</p>
          <p className="text-[#71717a] text-sm mb-6">
            Completa un entrenamiento para guardarlo como rutina o crea una desde cero.
          </p>
          <button
            onClick={() => navigate('/workout')}
            className="bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Crear rutina
          </button>
        </div>
      )}

      {!loading && !error && routines.length > 0 && (
        <div className="flex flex-col gap-3">
          {routines.map(routine => (
            <div
              key={routine.id}
              className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-white font-bold text-base truncate">{routine.name}</p>
                <p className="text-[#71717a] text-xs mt-0.5">
                  {routine.exercises.length} ejercicio{routine.exercises.length !== 1 ? 's' : ''} ·{' '}
                  {routine.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} series
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {routine.exercises.slice(0, 3).map(ex => (
                    <span
                      key={ex.name}
                      className="text-[10px] text-[#71717a] bg-[#1c1c1c] px-2 py-0.5 rounded-full border border-[#2a2a2a]"
                    >
                      {ex.name}
                    </span>
                  ))}
                  {routine.exercises.length > 3 && (
                    <span className="text-[10px] text-[#52525b] bg-[#1c1c1c] px-2 py-0.5 rounded-full border border-[#2a2a2a]">
                      +{routine.exercises.length - 3} más
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/workout', { state: { routine } })}
                className="shrink-0 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                Iniciar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
