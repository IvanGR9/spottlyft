import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../hooks/useWorkout.js';
import { useUser } from '../context/UserContext.js';

const exerciseSuggestions = [
  { name: 'Press de Pecho en Máquina',        muscle: 'Pecho',       type: 'Compuesto' },
  { name: 'Aperturas en Máquina',              muscle: 'Pecho',       type: 'Aislado'   },
  { name: 'Jalón al Pecho en Polea',           muscle: 'Espalda',     type: 'Compuesto' },
  { name: 'Remo Unilateral en Polea con Banco',muscle: 'Espalda',     type: 'Compuesto' },
  { name: 'Sentadilla Belt Squat',             muscle: 'Cuádriceps',  type: 'Compuesto' },
  { name: 'Prensa de Piernas',                 muscle: 'Cuádriceps',  type: 'Compuesto' },
  { name: 'Curl Femoral Sentado',              muscle: 'Isquios',     type: 'Aislado'   },
  { name: 'Curl de Bíceps con Mancuerna',      muscle: 'Bíceps',      type: 'Aislado'   },
  { name: 'Extensiones de Tríceps en Polea',   muscle: 'Tríceps',     type: 'Aislado'   },
  { name: 'Elevaciones Laterales con Mancuerna',muscle: 'Hombro',     type: 'Aislado'   },
  { name: 'Press Militar en Smith',            muscle: 'Hombro',      type: 'Compuesto' },
  { name: 'Curl Predicador en Máquina',        muscle: 'Bíceps',      type: 'Aislado'   },
];

export default function Workout() {
  const { workout, setTitle, addExercise, replaceExercise, addSet, updateSet, totalVolume, reset } = useWorkout();
  const { user } = useUser();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(null);
  const [doneSets, setDoneSets] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [paused, setPaused] = useState(false);

  function startTimer() {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    setTimerInterval(interval);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
  }

  function togglePause() {
    if (paused) {
      startTimer();
      setPaused(false);
    } else {
      stopTimer();
      setPaused(true);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function toggleSet(exerciseId: string, setIndex: number) {
    const key = `${exerciseId}-${setIndex}`;
    setDoneSets(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleStart() {
    if (!workout.title.trim()) return;
    setStarted(true);
    startTimer();
  }

  function handleFinish() {
    stopTimer();
    reset();
    setStarted(false);
    setDoneSets({});
    setElapsed(0);
  }

  function handleSelectExercise(name: string, muscle: string, type: string) {
    if (replacingExerciseId) {
      replaceExercise(replacingExerciseId, name, muscle, type);
      setReplacingExerciseId(null);
    } else {
      addExercise(name, muscle, type);
      setShowExerciseList(false);
    }
  }

  function closeSelector() {
    setShowExerciseList(false);
    setReplacingExerciseId(null);
  }

  function completeExercise(exerciseId: string, setsCount: number) {
    setDoneSets(prev => {
      const updated = { ...prev };
      for (let i = 0; i < setsCount; i++) updated[`${exerciseId}-${i}`] = true;
      return updated;
    });
  }

  if (user?.id === 'guest') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-10 max-w-sm w-full text-center">
          <p className="text-6xl mb-6">🔒</p>
          <h2 className="text-white font-bold text-xl mb-3">Función exclusiva para miembros</h2>
          <p className="text-[#71717a] text-sm mb-8">
            Crea una cuenta gratuita para registrar tus entrenamientos y competir en el ranking
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

  if (!started) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#71717a] text-sm mb-1">Registra tu próxima sesión</p>
          <h1 className="text-2xl font-bold text-white">Entrenar 💪</h1>
        </div>

        {/* Input sesión */}
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-4">
          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-3">Nombre de la sesión</p>
          <input
            type="text"
            placeholder="Ej: PUSH 4, LEGS 5..."
            value={workout.title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#f97316] transition-colors"
          />
        </div>

        {/* Rutinas recientes */}
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-4">
          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Rutinas recientes</p>
          <div className="grid grid-cols-2 gap-2">
            {['PUSH 4', 'PULL 4', 'LEGS 5', 'UPPER 1'].map(r => (
              <button
                key={r}
                onClick={() => setTitle(r)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-sm font-semibold ${
                  workout.title === r
                    ? 'bg-[#f97316]/10 border-[#f97316]/40 text-[#f97316]'
                    : 'bg-[#1c1c1c] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]'
                }`}
              >
                <span>{r}</span>
                <span className="text-xs opacity-40">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Botón iniciar */}
        <button
          onClick={handleStart}
          disabled={!workout.title.trim()}
          className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition-colors text-base"
        >
          Iniciar entrenamiento
        </button>
      </div>
    );
  }

  const completedSets = Object.values(doneSets).filter(Boolean).length;
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">

      {/* Header sesión activa */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#71717a] text-xs mb-0.5">Sesión activa</p>
          <h1 className="text-xl font-bold text-white">{workout.title}</h1>
          <p className="text-[#52525b] text-xs mt-0.5">{workout.exercises.length} ejercicio(s) · {totalVolume.toLocaleString()} kg</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <p className={`font-bold text-2xl font-mono ${paused ? 'text-[#52525b]' : 'text-[#f97316]'}`}>{formatTime(elapsed)}</p>
          <button
            onClick={togglePause}
            className="text-xs px-3 py-1 rounded-lg border transition-colors font-medium border-[#2a2a2a] text-[#71717a] hover:text-white hover:border-[#444]"
          >
            {paused ? '▶ Reanudar' : '⏸ Pausar'}
          </button>
        </div>
      </div>

      {/* Progreso */}
      <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider">Progreso</p>
          <p className="text-white text-xs font-semibold">{completedSets}/{totalSets} series</p>
        </div>
        <div className="bg-[#1c1c1c] rounded-full h-2">
          <div
            className="bg-[#f97316] h-2 rounded-full transition-all"
            style={{ width: totalSets > 0 ? `${Math.min((completedSets / totalSets) * 100, 100)}%` : '0%' }}
          />
        </div>
      </div>

      {/* Ejercicios */}
      {workout.exercises.map((ex) => (
        <div key={ex.id} className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-white font-bold text-sm">{ex.name}</p>
              <p className="text-[#52525b] text-xs mt-0.5">
                {ex.muscleGroup}{ex.type ? ` · ${ex.type}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setReplacingExerciseId(ex.id)}
                className="text-xs text-[#71717a] hover:text-white border border-[#2a2a2a] hover:border-[#444] px-2.5 py-1 rounded-lg transition-colors"
              >
                Cambiar
              </button>
              <span className="text-xs bg-[#f97316]/10 text-[#f97316] px-3 py-1 rounded-full border border-[#f97316]/20 font-medium">
                {ex.sets.length} series
              </span>
            </div>
          </div>

          {/* Cabecera tabla */}
          <div className="grid grid-cols-5 gap-2 mb-2 px-1">
            <span className="text-[#52525b] text-xs text-center font-medium">SERIE</span>
            <span className="text-[#52525b] text-xs text-center font-medium">KG</span>
            <span className="text-[#52525b] text-xs text-center font-medium">REPS</span>
            <span className="text-[#52525b] text-xs text-center font-medium">RIR</span>
            <span className="text-[#52525b] text-xs text-center font-medium">✓</span>
          </div>

          {ex.sets.map((set, setIndex) => {
            const key = `${ex.id}-${setIndex}`;
            const done = doneSets[key];
            return (
              <div
                key={setIndex}
                className={`grid grid-cols-5 gap-2 mb-2 items-center px-1 py-1.5 rounded-xl transition-colors border ${
                  done ? 'bg-[#f97316]/5 border-[#f97316]/10' : 'border-transparent'
                }`}
              >
                <span className="text-[#71717a] text-sm text-center font-medium">{setIndex + 1}</span>
                <input
                  type="number"
                  value={set.weight || ''}
                  onChange={e => updateSet(ex.id, setIndex, 'weight', Number(e.target.value))}
                  placeholder="0"
                  className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-2 py-2 text-white text-sm text-center outline-none focus:border-[#f97316] transition-colors"
                />
                <input
                  type="number"
                  value={set.reps || ''}
                  onChange={e => updateSet(ex.id, setIndex, 'reps', Number(e.target.value))}
                  placeholder="0"
                  className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-2 py-2 text-white text-sm text-center outline-none focus:border-[#f97316] transition-colors"
                />
                <input
                  type="number"
                  value={set.rir ?? ''}
                  onChange={e => updateSet(ex.id, setIndex, 'rir', Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-2 py-2 text-white text-sm text-center outline-none focus:border-[#f97316] transition-colors"
                />
                <button
                  onClick={() => toggleSet(ex.id, setIndex)}
                  className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                    done ? 'bg-[#f97316] text-white scale-110' : 'bg-[#1c1c1c] text-[#52525b] hover:bg-[#2a2a2a]'
                  }`}
                >
                  ✓
                </button>
              </div>
            );
          })}

          <div className="flex flex-col gap-2 mt-3">
            <button
              onClick={() => addSet(ex.id)}
              className="w-full py-2.5 text-[#f97316] text-xs border border-[#f97316]/40 rounded-xl hover:bg-[#f97316]/5 transition-colors font-medium"
            >
              + Añadir serie
            </button>
            <button
              onClick={() => completeExercise(ex.id, ex.sets.length)}
              className="w-full py-2.5 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Completar ejercicio ✓
            </button>
          </div>
        </div>
      ))}

      {/* Selector ejercicio (añadir o cambiar) */}
      {(showExerciseList || replacingExerciseId) ? (
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider">
              {replacingExerciseId ? 'Cambiar ejercicio' : 'Selecciona un ejercicio'}
            </p>
            <button onClick={closeSelector} className="text-[#52525b] hover:text-white text-lg leading-none transition-colors">
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {exerciseSuggestions.map(ex => (
              <button
                key={ex.name}
                onClick={() => handleSelectExercise(ex.name, ex.muscle, ex.type)}
                className="flex items-center justify-between text-left px-3 py-3 text-white text-sm hover:bg-[#1c1c1c] rounded-xl transition-colors"
              >
                <div>
                  <span className="font-medium">{ex.name}</span>
                  <span className="block text-[#52525b] text-xs mt-0.5">{ex.type}</span>
                </div>
                <span className="text-[#52525b] text-xs bg-[#1c1c1c] px-2 py-0.5 rounded-full shrink-0 ml-2">{ex.muscle}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowExerciseList(true)}
          className="w-full py-3.5 text-[#f97316] font-semibold border border-dashed border-[#f97316]/40 rounded-2xl hover:bg-[#f97316]/5 transition-colors mb-4 text-sm"
        >
          + Añadir ejercicio
        </button>
      )}

      {/* Ejercicios restantes */}
      {(() => {
        const remaining = workout.exercises
          .map(ex => ({
            name: ex.name,
            pending: ex.sets.filter((_, i) => !doneSets[`${ex.id}-${i}`]).length,
          }))
          .filter(ex => ex.pending > 0);
        if (remaining.length === 0) return null;
        return (
          <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-4 mb-4">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-3">Ejercicios restantes</p>
            <div className="flex flex-col gap-2">
              {remaining.map(ex => (
                <div key={ex.name} className="flex items-center justify-between">
                  <span className="text-white text-sm">{ex.name}</span>
                  <span className="text-[#52525b] text-xs bg-[#1c1c1c] px-2.5 py-1 rounded-full">
                    {ex.pending} serie{ex.pending > 1 ? 's' : ''} pendiente{ex.pending > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Finalizar */}
      <button
        onClick={handleFinish}
        className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-4 rounded-2xl transition-colors"
      >
        Finalizar entrenamiento ✓
      </button>
    </div>
  );
}
