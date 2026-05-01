import Workout from '../models/Workout.js';

export async function getAllWorkouts() {
  return Workout.find().sort({ date: -1 });
}

export async function addWorkout(data: {
  userId: string;
  gymId: string;
  exercises: { exerciseId?: string; name?: string; sets: { kg?: number; reps?: number; rir?: number }[] }[];
}) {
  const totalVolume = data.exercises.reduce((total, ex) =>
    total + ex.sets.reduce((sum, s) => sum + (s.kg ?? 0) * (s.reps ?? 0), 0), 0);

  return Workout.create({ ...data, date: new Date(), totalVolume });
}

export async function removeWorkout(id: string): Promise<void> {
  const result = await Workout.findByIdAndDelete(id);
  if (!result) throw new Error('NOT_FOUND');
}
