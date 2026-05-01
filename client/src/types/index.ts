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

export interface Workout {
    id: string;
    userId: string;
    gymId: string;
    exercises: Exercise[];
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