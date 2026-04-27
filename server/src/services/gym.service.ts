import type { Gym, LeaderboardEntry } from '../types/index.js';

const gyms: Gym[] = [
    {
        id: 'gym-1',
        name: 'Gimnasio Local',
        location: 'Madrid',
        qrCode: 'QR-GYM-001'
    },
    {
        id: 'gym-2',
        name: 'FitZone Centro',
        location: 'Barcelona',
        qrCode: 'QR-GYM-002'
    }
];

export function getGymById(id: string): Gym {
    const gym = gyms.find(g => g.id === id);
    if (!gym) throw new Error('NOT_FOUND');
    return gym;
}

export function getAllGyms(): Gym[] {
    return gyms;
}