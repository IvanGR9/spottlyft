import { useState } from 'react';

interface SetData {
  kg: string;
  reps: string;
  done: boolean;
}

interface ExerciseData {
  name: string;
  sets: SetData[];
}

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
  const [started, setStarted] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [showExerciseList, setShowExerciseList] = useState(false);

  function addExercise(name: string) {
    setExercises(prev => [...prev, {
      name,
      sets: [{ kg: '', reps: '', done: false }]
    }]);
    setShowExerciseList(false);
  }

  function addSet(exIndex: number) {
    setExercises(prev => prev.map((ex, i) =>
      i === exIndex
        ? { ...ex, sets: [...ex.sets, { kg: '', reps: '', done: false }] }
        : ex
    ));
  }

  function updateSet(exIndex: number, setIndex: number, field: 'kg' | 'reps', value: string) {
    setExercises(prev => prev.map((ex, i) =>
      i === exIndex
        ? {
            ...ex,
            sets: ex.sets.map((s, j) =>
              j === setIndex ? { ...s, [field]: value } : s
            )
          }
        : ex
    ));
  }

  function toggleSet(exIndex: number, setIndex: number) {
    setExercises(prev => prev.map((ex, i) =>
      i === exIndex
        ? {
            ...ex,
            sets: ex.sets.map((s, j) =>
              j === setIndex ? { ...s, done: !s.done } : s
            )
          }
        : ex
    ));
  }

  if (!started) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Entrenar 💪</h1>
        <p className="text-[#666] text-sm mb-8">Registra tu sesión de hoy</p>

        <input
          type="text"
          placeholder="Nombre del entrenamiento (ej: PUSH 4)"
          value={workoutTitle}
          onChange={e => setWorkoutTitle(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#444] outline-none focus:border-[#e85d26] transition-colors mb-4"
        />

        <button
          onClick={() => workoutTitle.trim() && setStarted(true)}
          className="w-full bg-[#e85d26] hover:bg-[#d14e1a] text-white font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-40"
          disabled={!workoutTitle.trim()}
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
          <h1 className="text-xl font-bold text-white">{workoutTitle}</h1>
          <p className="text-[#666] text-xs mt-1">{exercises.length} ejercicio(s)</p>
        </div>
        <button className="bg-[#e85d26] text-white text-sm font-bold px-4 py-2 rounded-full">
          Finalizar
        </button>
      </div>

      {/* Ejercicios */}
      {exercises.map((ex, exIndex) => (
        <div key={exIndex} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-4">
          <p className="text-white font-semibold mb-3">{ex.name}</p>

          {/* Cabecera sets */}
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
                value={set.kg}
                onChange={e => updateSet(exIndex, setIndex, 'kg', e.target.value)}
                placeholder="0"
                className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-white text-sm text-center outline-none focus:border-[#e85d26]"
              />
              <input
                type="number"
                value={set.reps}
                onChange={e => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                placeholder="0"
                className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-white text-sm text-center outline-none focus:border-[#e85d26]"
              />
              <button
                onClick={() => toggleSet(exIndex, setIndex)}
                className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-sm font-bold transition-colors ${
                  set.done ? 'bg-[#e85d26] text-white' : 'bg-[#2a2a2a] text-[#666]'
                }`}
              >
                ✓
              </button>
            </div>
          ))}

          <button
            onClick={() => addSet(exIndex)}
            className="w-full mt-2 py-2 text-[#666] text-sm border border-dashed border-[#2a2a2a] rounded-lg hover:text-white hover:border-[#444] transition-colors"
          >
            + Añadir serie
          </button>
        </div>
      ))}

      {/* Añadir ejercicio */}
      {showExerciseList ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-white font-semibold mb-3">Selecciona un ejercicio</p>
          <div className="flex flex-col gap-2">
            {exerciseSuggestions.map(ex => (
              <button
                key={ex}
                onClick={() => addExercise(ex)}
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