import Routine from '../models/Routine.js';

export async function getRoutinesByUser(userId: string) {
  return Routine.find({ userId });
}

export async function createRoutine(data: {
  userId: string;
  gymId: string;
  name: string;
  exercises: { name: string; muscleGroup?: string; type?: string; sets: { kg?: number; reps?: number; rir?: number }[] }[];
}) {
  return Routine.create(data);
}

export async function deleteRoutine(id: string) {
  return Routine.findByIdAndDelete(id);
}
