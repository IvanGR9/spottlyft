import { useState } from 'react';
import { useWorkout } from '../hooks/useWorkout.js';

const exerciseSuggestions = [
  { name: 'Press de Pecho en Máquina', muscle: 'Pecho' },
  { name: 'Aperturas en Máquina', muscle: 'Pecho' },
  { name: 'Jalón al Pecho en Polea', muscle: 'Espalda' },
  { name: 'Remo Unilateral en Polea con Banco', muscle: 'Espalda' },
  { name: 'Sentadilla Belt Squat', muscle: 'Cuádriceps' },
  { name: 'Prensa de Piernas', muscle: 'Cuádriceps' },
  { name: 'Curl Femoral Sentado', muscle: 'Isquios' },
  { name: 'Curl de Bíceps con Mancuerna', muscle: 'Bíceps' },
  { name: 'Extensiones de Tríceps en Polea', muscle: 'Tríceps' },
  { name: 'Elevaciones Laterales con Mancuerna', muscle: 'Hombro' },
  { name: 'Press Militar en Smith', muscle: 'Hombro' },
  { name: 'Curl Predicador en Máquina', muscle: 'Bíceps' },
];

export default function Workout() {
  const { workout, setTitle, addExercise, addSet, updateSet, totalVolume, reset } = useWorkout();
  const [started, setStarted] = useState(false);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [doneSets, setDoneSets] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    setTimerInterval(interval);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
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

  if (!started) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-[#71717a] text-sm mb-1">Registra tu entrenamiento</p>
          <h1 className="text-2xl font-bold text-white">Entrenar 💪</h1>
        </div>

        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6">
          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-4">Nombre de la sesión</p>
          <input
            type="text"
            placeholder="Ej: PUSH 4, LEGS 5..."
            value={workout.title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#f97316] transition-colors mb-6"
          />

          <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-3">Rutinas recientes</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {['PUSH 4', 'PULL 4', 'LEGS 5', 'UPPER 1'].map(r => (
              <button
                key={r}
                onClick={() => setTitle(r)}
                className="bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white text-sm font-medium py-2.5 rounded-xl transition-colors border border-[#2a2a2a]"
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={!workout.title.trim()}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-bold py-4 rounded-xl transition-colors"
          >
            Iniciar entrenamiento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">

      {/* Header sesión activa */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#71717a] text-xs mb-0.5">Sesión activa</p>
          <h1 className="text-xl font-bold text-white">{workout.title}</h1>
          <p className="text-[#52525b] text-xs mt-0.5">{workout.exercises.length} ejercicio(s) · {totalVolume.toLocaleString()} kg</p>
        </div>
        <div className="text-right">
          <p className="text-[#f97316] font-bold text-xl font-mono">{formatTime(elapsed)}</p>
          <p className="text-[#52525b] text-xs">Tiempo de sesión</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-[#1c1c1c] rounded-full h-1.5 mb-6">
        <div
          className="bg-[#f97316] h-1.5 rounded-full transition-all"
          style={{ width: `${Math.min((workout.exercises.length / 8) * 100, 100)}%` }}
        />
      </div>

      {/* Ejercicios */}
      {workout.exercises.map((ex) => (
        <div key={ex.id} className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-bold text-sm">{ex.name}</p>
              <p className="text-[#52525b] text-xs mt-0.5">{ex.muscleGroup}</p>
            </div>
            <span className="text-xs bg-[#f97316]/10 text-[#f97316] px-2 py-1 rounded-full border border-[#f97316]/20">
              {ex.sets.length} series
            </span>
          </div>

          {/* Cabecera tabla */}
          <div className="grid grid-cols-4 gap-2 mb-2 px-1">
            <span className="text-[#52525b] text-xs text-center">SERIE</span>
            <span className="text-[#52525b] text-xs text-center">KG</span>
            <span className="text-[#52525b] text-xs text-center">REPS</span>
            <span className="text-[#52525b] text-xs text-center">✓</span>
          </div>

          {ex.sets.map((set, setIndex) => {
            const key = `${ex.id}-${setIndex}`;
            const done = doneSets[key];
            return (
              <div key={setIndex} className={`grid grid-cols-4 gap-2 mb-2 items-center px-1 py-1 rounded-lg transition-colors ${done ? 'bg-[#f97316]/5' : ''}`}>
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

          <button
            onClick={() => addSet(ex.id)}
            className="w-full mt-2 py-2 text-[#52525b] text-xs border border-dashed border-[#2a2a2a] rounded-xl hover:text-white hover:border-[#444] transition-colors"
          >
            + Añadir serie
          </button>
        </div>
      ))}

      {/* Añadir ejercicio */}
      {showExerciseList ? (
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold text-sm">Selecciona un ejercicio</p>
            <button onClick={() => setShowExerciseList(false)} className="text-[#52525b] hover:text-white text-sm">✕</button>
          </div>
          <div className="flex flex-col gap-1">
            {exerciseSuggestions.map(ex => (
              <button
                key={ex.name}
                onClick={() => { addExercise(ex.name, ex.muscle); setShowExerciseList(false); }}
                className="flex items-center justify-between text-left px-3 py-2.5 text-white text-sm hover:bg-[#1c1c1c] rounded-xl transition-colors"
              >
                <span>{ex.name}</span>
                <span className="text-[#52525b] text-xs">{ex.muscle}</span>
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