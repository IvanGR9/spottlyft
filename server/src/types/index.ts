export interface Set {
    reps: number;
    weight: number;
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    sets: Set[];
}

export interface Workout {
    id: string;
    userId: string;
    gymId: string;
    date: string;
    totalVolume: number;
    exercises: Exercise[];
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    totalVolume: number;
    totalWorkouts: number;
    streak: number;
    rank: number;
}

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
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}