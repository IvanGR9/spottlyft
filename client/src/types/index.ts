export interface Gym {
    id: string;
    name: string;
    location: string;
    qrCode: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    gymId: string;
    streak?: number;
    avatarUrl?: string;
    bio?: string;
    avatarColor?: string;
    avatar?: string;
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    type?: string;
    sets: Set[];
}

export interface Set {
    reps: number;
    weight: number;
    rir?: number;
}

export interface WorkoutSet {
    kg?: number;
    reps?: number;
    rir?: number;
}

export interface WorkoutExercise {
    exerciseId?: string;
    name?: string;
    sets: WorkoutSet[];
}

export interface Workout {
    id: string;
    userId: string;
    gymId: string;
    title?: string;
    duration?: number;
    exercises: WorkoutExercise[];
    date: string;
    totalVolume: number;
}

export interface RoutineExercise {
    name: string;
    muscleGroup?: string;
    type?: string;
    sets: WorkoutSet[];
}

export interface Routine {
    _id?: string;
    id: string;
    userId: string;
    gymId: string;
    name: string;
    exercises: RoutineExercise[];
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    avatar?: string;
    totalVolume: number;
    totalWorkouts: number;
    streak: number;
    rank: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}