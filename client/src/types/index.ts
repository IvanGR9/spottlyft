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

export interface LeaderboardEntry {
    userId: string;
    username: string;
    avatarUrl?: string;
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