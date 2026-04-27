import { useState } from 'react';
import { useWorkout } from '../hooks/useWorkout.js';

const exerciseSuggestions = [
  'Aperturas en Máquina',
  'Press de Pecho en Máquina',
  'Jalón al Pecho en Polea',
  'Remo Unilateral en Polea con Banco',
  'Sentadilla Belt Squat',
  'Prensa de Piernas',
  'Curl Femoral Sentado',
  'Curl de Bíceps con Mancuerna',
  'Extensiones de Tríceps en Polea',
  'Elevaciones Laterales con Mancuerna',
  'Press Militar en Smith',
  'Curl Predicador en Máquina',
];

export default function Workout() {
  const { workout, setTitle, addExercise, addSet, updateSet, totalVolume, reset } = useWorkout();
  const [started, setStarted] = useState(false);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [doneSets, setDoneSets] = useState<Record<string, boolean>>({});

  function toggleSet(exerciseId: string, setIndex: number) {
    const key = `${exerciseId}-${setIndex}`;
    setDoneSets(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleFinish() {
    reset();
    setStarted(false);
    setDoneSets({});
  }

  if (!started) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Entrenar 💪</h1>
        <p className="text-[#666] text-sm mb-8">Registra tu sesión de hoy</p>

        <input
          type="text"
          placeholder="Nombre del entrenamiento (ej: PUSH 4)"
          value={workout.title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#444] outline-none focus:border-[#e85d26] transition-colors mb-4"
        />

        <button
          onClick={() => workout.title.trim() && setStarted(true)}
          disabled={!workout.title.trim()}
          className="w-full bg-[#e85d26] hover:bg-[#d14e1a] text-white font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-40"
        >
          Iniciar entrenamiento
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">{workout.title}</h1>
          <p className="text-[#666] text-xs mt-1">{workout.exercises.length} ejercicio(s) · {totalVolume.toLocaleString()} kg</p>
        </div>
        <button
          onClick={handleFinish}
          className="bg-[#e85d26] text-white text-sm font-bold px-4 py-2 rounded-full"
        >
          Finalizar
        </button>
      </div>

      {workout.exercises.map((ex) => (
        <div key={ex.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <p className="text-white font-semibold mb-3">{ex.name}</p>

          <div className="grid grid-cols-4 gap-2 mb-2">
            <span className="text-[#666] text-xs text-center">Serie</span>
            <span className="text-[#666] text-xs text-center">Kg</span>
            <span className="text-[#666] text-xs text-center">Reps</span>
            <span className="text-[#666] text-xs text-center">✓</span>
          </div>

          {ex.sets.map((set, setIndex) => (
            <div key={setIndex} className="grid grid-cols-4 gap-2 mb-2 items-center">
              <span className="text-[#666] text-sm text-center">{setIndex + 1}</span>
              <input
                type="number"
                value={set.weight || ''}
                onChange={e => updateSet(ex.id, setIndex, 'weight', Number(e.target.value))}
                placeholder="0"
                className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-white text-sm text-center outline-none focus:border-[#e85d26]"
              />
              <input
                type="number"
                value={set.reps || ''}
                onChange={e => updateSet(ex.id, setIndex, 'reps', Number(e.target.value))}
                placeholder="0"
                className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-white text-sm text-center outline-none focus:border-[#e85d26]"
              />
              <button
                onClick={() => toggleSet(ex.id, setIndex)}
                className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-sm font-bold transition-colors ${
                  doneSets[`${ex.id}-${setIndex}`] ? 'bg-[#e85d26] text-white' : 'bg-[#2a2a2a] text-[#666]'
                }`}
              >
                ✓
              </button>
            </div>
          ))}

          <button
            onClick={() => addSet(ex.id)}
            className="w-full mt-2 py-2 text-[#666] text-sm border border-dashed border-[#2a2a2a] rounded-lg hover:text-white hover:border-[#444] transition-colors"
          >
            + Añadir serie
          </button>
        </div>
      ))}

      {showExerciseList ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-white font-semibold mb-3">Selecciona un ejercicio</p>
          <div className="flex flex-col gap-2">
            {exerciseSuggestions.map(ex => (
              <button
                key={ex}
                onClick={() => { addExercise(ex, ''); setShowExerciseList(false); }}
                className="text-left px-3 py-2 text-[#ccc] text-sm hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowExerciseList(true)}
          className="w-full py-3 text-[#e85d26] font-semibold border border-dashed border-[#e85d26] rounded-xl hover:bg-[#e85d26] hover:text-white transition-colors"
        >
          + Añadir ejercicio
        </button>
      )}
    </div>
  );
}