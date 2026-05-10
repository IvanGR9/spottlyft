import { useState, useCallback, useMemo } from 'react';
import type { Exercise, Set } from '../types/index.js';

interface WorkoutState {
    title: string;
    exercises: Exercise[];
}

export function useWorkout(initial?: WorkoutState) {
    const [workout, setWorkout] = useState<WorkoutState>(
        initial ?? { title: '', exercises: [] }
    );

    const addExercise = useCallback((name: string, muscleGroup: string, type?: string) => {
        setWorkout(prev => ({
            ...prev,
            exercises: [
                ...prev.exercises,
                {
                    id: crypto.randomUUID(),
                    name,
                    muscleGroup,
                    type,
                    sets: [{ reps: 0, weight: 0, rir: 0 }]
                }
            ]
        }));
    }, []);

    const replaceExercise = useCallback((id: string, name: string, muscleGroup: string, type?: string) => {
        setWorkout(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex =>
                ex.id === id ? { ...ex, name, muscleGroup, type } : ex
            )
        }));
    }, []);

    const addSet = useCallback((exerciseId: string) => {
        setWorkout(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex =>
                ex.id === exerciseId
                    ? { ...ex, sets: [...ex.sets, { reps: 0, weight: 0, rir: 0 }] }
                    : ex
            )
        }));
    }, []);

    const updateSet = useCallback((exerciseId: string, setIndex: number, field: keyof Set, value: number) => {
        setWorkout(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex =>
                ex.id === exerciseId
                    ? {
                        ...ex,
                        sets: ex.sets.map((s, i) =>
                            i === setIndex ? { ...s, [field]: value } : s
                        )
                    }
                    : ex
            )
        }));
    }, []);

    const totalVolume = useMemo(() => {
        return workout.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);
        }, 0);
    }, [workout.exercises]);

    const reset = useCallback(() => {
        setWorkout({ title: '', exercises: [] });
    }, []);

    const loadInitial = useCallback((state: WorkoutState) => {
        setWorkout(state);
    }, []);

    return {
        workout,
        setTitle: (title: string) => setWorkout(prev => ({ ...prev, title })),
        addExercise,
        replaceExercise,
        addSet,
        updateSet,
        totalVolume,
        reset,
        loadInitial,
    };
}