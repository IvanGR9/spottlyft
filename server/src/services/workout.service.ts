import type { Workout } from '../types/index.js';

let workouts: Workout[] = [
    {
        id: '1',
        userId: 'user-1',
        gymId: 'gym-1',
        date: '2026-04-25',
        totalVolume: 5748,
        exercises: [
            { id: 'ex-1', name: 'Curl Femoral Sentado', muscleGroup: 'Isquios', sets: [{ reps: 12, weight: 60 }, { reps: 10, weight: 60 }] },
            { id: 'ex-2', name: 'Prensa de Piernas', muscleGroup: 'Cuádriceps', sets: [{ reps: 8, weight: 240 }, { reps: 7, weight: 220 }] },
        ]
    },
    {
        id: '2',
        userId: 'user-1',
        gymId: 'gym-1',
        date: '2026-04-24',
        totalVolume: 3813,
        exercises: [
            { id: 'ex-3', name: 'Jalón al Pecho en Polea', muscleGroup: 'Espalda', sets: [{ reps: 7, weight: 77 }, { reps: 10, weight: 65 }] },
            { id: 'ex-4', name: 'Curl de Bíceps con Mancuerna', muscleGroup: 'Bíceps', sets: [{ reps: 10, weight: 15 }, { reps: 13, weight: 12.5 }] },
        ]
    }
];

export function getAllWorkouts(): Workout[] {
    return workouts;
}

export function addWorkout(data: Omit<Workout, 'id' | 'totalVolume' | 'date'>): Workout {
    const totalVolume = data.exercises.reduce((total, ex) => {
        return total + ex.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);
    }, 0);

    const newWorkout: Workout = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0] ?? '',
        totalVolume,
        ...data
    };

    workouts.push(newWorkout);
    return newWorkout;
}

export function removeWorkout(id: string): void {
    const index = workouts.findIndex(w => w.id === id);
    if (index === -1) throw new Error('NOT_FOUND');
    workouts.splice(index, 1);
}