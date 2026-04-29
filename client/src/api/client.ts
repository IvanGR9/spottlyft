import type { ApiResponse, Workout, LeaderboardEntry, User, Gym } from '../types/index.js';

const API_URL = import.meta.env.VITE_API_URL ?? 
    (['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? 'http://localhost:3000/api/v1'
        : '/api/v1');

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data: ApiResponse<T> = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.error ?? `Error ${res.status}`);
    }

    return data.data;
}

export const gymClient = {
    getAll: () => request<Gym[]>('GET', '/gyms'),
    getById: (id: string) => request<Gym>('GET', `/gyms/${id}`),
    getLeaderboard: (id: string) => request<LeaderboardEntry[]>('GET', `/leaderboard/${id}`),
};

export const userClient = {
    getById: (id: string) => request<User>('GET', `/users/${id}`),
    create: (user: Omit<User, 'id'>) => request<User>('POST', '/users', user),
};

export const workoutClient = {
    getAll: () => request<Workout[]>('GET', '/workouts'),
    create: (workout: Omit<Workout, 'id'>) => request<Workout>('POST', '/workouts', workout),
    delete: (id: string) => request<void>('DELETE', `/workouts/${id}`),
};