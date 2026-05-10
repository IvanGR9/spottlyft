import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.js';
import { routineClient } from '../api/client.js';

interface RoutineSet { kg: number; reps: number; rir: number; }
interface RoutineExercise { id: string; name: string; muscleGroup: string; type: string; sets: RoutineSet[]; }

const exerciseSuggestions = [
  { name: 'Press de Pecho en Máquina',         muscle: 'Pecho',       type: 'Compuesto' },
  { name: 'Aperturas en Máquina',               muscle: 'Pecho',       type: 'Aislado'   },
  { name: 'Press Inclinado en Smith',           muscle: 'Pecho',       type: 'Compuesto' },
  { name: 'Jalón al Pecho en Polea',            muscle: 'Espalda',     type: 'Compuesto' },
  { name: 'Remo Unilateral en Polea con Banco', muscle: 'Espalda',     type: 'Compuesto' },
  { name: 'Remo con Barra',                     muscle: 'Espalda',     type: 'Compuesto' },
  { name: 'Sentadilla Belt Squat',              muscle: 'Cuádriceps',  type: 'Compuesto' },
  { name: 'Prensa de Piernas',                  muscle: 'Cuádriceps',  type: 'Compuesto' },
  { name: 'Extensión de Cuádriceps',            muscle: 'Cuádriceps',  type: 'Aislado'   },
  { name: 'Curl Femoral Sentado',               muscle: 'Isquios',     type: 'Aislado'   },
  { name: 'Peso Muerto Rumano',                 muscle: 'Isquios',     type: 'Compuesto' },
  { name: 'Curl de Bíceps con Mancuerna',       muscle: 'Bíceps',      type: 'Aislado'   },
  { name: 'Curl Predicador en Máquina',         muscle: 'Bíceps',      type: 'Aislado'   },
  { name: 'Extensiones de Tríceps en Polea',    muscle: 'Tríceps',     type: 'Aislado'   },
  { name: 'Elevaciones Laterales con Mancuerna',muscle: 'Hombro',      type: 'Aislado'   },
  { name: 'Press Militar en Smith',             muscle: 'Hombro',      type: 'Compuesto' },
  { name: 'Elevaciones de Talones',             muscle: 'Gemelos',     type: 'Aislado'   },
  { name: 'Hip Thrust en Máquina',              muscle: 'Glúteos',     type: 'Compuesto' },
];

function emptySet(): RoutineSet { return { kg: 0, reps: 0, rir: 0 }; }

export default function CreateRoutine() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function addExercise(ex: typeof exerciseSuggestions[number]) {
    setExercises(prev => [...prev, {
      id: crypto.randomUUID(),
      name: ex.name,
      muscleGroup: ex.muscle,
      type: ex.type,
      sets: [emptySet()],
    }]);
    setShowSelector(false);
  }

  function removeExercise(id: string) {
    setExercises(prev => prev.filter(e => e.id !== id));
  }

  function addSet(exerciseId: string) {
    setExercises(prev => prev.map(e =>
      e.id === exerciseId ? { ...e, sets: [...e.sets, emptySet()] } : e
    ));
  }

  function removeSet(exerciseId: string, setIndex: number) {
    setExercises(prev => prev.map(e =>
      e.id === exerciseId
        ? { ...e, sets: e.sets.filter((_, i) => i !== setIndex) }
        : e
    ));
  }

  function updateSet(exerciseId: string, setIndex: number, field: keyof RoutineSet, value: number) {
    setExercises(prev => prev.map(e =>
      e.id === exerciseId
        ? { ...e, sets: e.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s) }
        : e
    ));
  }

  async function handleSave() {
    if (!name.trim()) { setError('El nombre de la rutina es obligatorio'); return; }
    if (exercises.length === 0) { setError('Añade al menos un ejercicio'); return; }
    setError('');
    setSaving(true);
    try {
      await routineClient.create({
        userId: user!.id,
        gymId: user!.gymId,
        name: name.trim(),
        exercises: exercises.map(e => ({
          name: e.name,
          muscleGroup: e.muscleGroup,
          type: e.type,
          sets: e.sets.map(s => ({ kg: s.kg, reps: s.reps, rir: s.rir })),
        })),
      });
      navigate('/routines');
    } catch {
      setError('No se pudo guardar la rutina. Inténtalo de nuevo.');
      setSaving(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">

      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/routines')}
          className="text-[#71717a] hover:text-white transition-colors text-sm"
        >
          ‹ Volver
        </button>
        <div>
          <p className="text-[#71717a] text-xs">Nueva rutina</p>
          <h1 className="text-xl font-bold text-white leading-tight">Crear rutina</h1>
        </div>
      </div>

      {/* Nombre */}
      <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-6 mb-4">
        <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider mb-3">Nombre de la rutina</p>
        <input
          type="text"
          placeholder="Ej: PUSH A, LEGS 1, UPPER..."
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#f97316] transition-colors"
        />
      </div>

      {/* Ejercicios */}
      {exercises.map((ex) => (
        <div key={ex.id} className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-4">

          {/* Cabecera ejercicio */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white font-bold text-sm">{ex.name}</p>
              <p className="text-[#52525b] text-xs mt-0.5">{ex.muscleGroup}{ex.type ? ` · ${ex.type}` : ''}</p>
            </div>
            <button
              onClick={() => removeExercise(ex.id)}
              className="text-[#52525b] hover:text-red-400 transition-colors text-lg leading-none ml-3"
              aria-label="Eliminar ejercicio"
            >
              ✕
            </button>
          </div>

          {/* Cabecera tabla */}
          <div className="grid grid-cols-5 gap-2 mb-2 px-1">
            <span className="text-[#52525b] text-xs text-center font-medium">SERIE</span>
            <span className="text-[#52525b] text-xs text-center font-medium">KG</span>
            <span className="text-[#52525b] text-xs text-center font-medium">REPS</span>
            <span className="text-[#52525b] text-xs text-center font-medium">RIR</span>
            <span className="text-[#52525b] text-xs text-center font-medium">✕</span>
          </div>

          {/* Series */}
          {ex.sets.map((set, si) => (
            <div key={si} className="grid grid-cols-5 gap-2 mb-2 items-center px-1">
              <span className="text-[#71717a] text-sm text-center font-medium">{si + 1}</span>
              <input
                type="number"
                value={set.kg || ''}
                onChange={e => updateSet(ex.id, si, 'kg', Number(e.target.value))}
                placeholder="0"
                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-2 py-2 text-white text-sm text-center outline-none focus:border-[#f97316] transition-colors"
              />
              <input
                type="number"
                value={set.reps || ''}
                onChange={e => updateSet(ex.id, si, 'reps', Number(e.target.value))}
                placeholder="0"
                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-2 py-2 text-white text-sm text-center outline-none focus:border-[#f97316] transition-colors"
              />
              <input
                type="number"
                value={set.rir || ''}
                onChange={e => updateSet(ex.id, si, 'rir', Number(e.target.value))}
                placeholder="0"
                min={0}
                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-2 py-2 text-white text-sm text-center outline-none focus:border-[#f97316] transition-colors"
              />
              <button
                onClick={() => removeSet(ex.id, si)}
                disabled={ex.sets.length === 1}
                className="text-[#52525b] hover:text-red-400 disabled:opacity-20 transition-colors text-sm mx-auto"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => addSet(ex.id)}
            className="w-full mt-3 py-2.5 text-[#f97316] text-xs border border-[#f97316]/40 rounded-xl hover:bg-[#f97316]/5 transition-colors font-medium"
          >
            + Añadir serie
          </button>
        </div>
      ))}

      {/* Selector de ejercicios */}
      {showSelector ? (
        <div className="bg-[#141414] border border-[#1c1c1c] rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#71717a] text-xs font-medium uppercase tracking-wider">Selecciona un ejercicio</p>
            <button onClick={() => setShowSelector(false)} className="text-[#52525b] hover:text-white text-lg leading-none transition-colors">✕</button>
          </div>
          <div className="flex flex-col gap-1">
            {exerciseSuggestions.map(ex => (
              <button
                key={ex.name}
                onClick={() => addExercise(ex)}
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
          onClick={() => setShowSelector(true)}
          className="w-full py-3.5 text-[#f97316] font-semibold border border-dashed border-[#f97316]/40 rounded-2xl hover:bg-[#f97316]/5 transition-colors mb-4 text-sm"
        >
          + Añadir ejercicio
        </button>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

      {/* Guardar */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors text-base"
      >
        {saving ? 'Guardando...' : 'Guardar rutina'}
      </button>

    </div>
  );
}
