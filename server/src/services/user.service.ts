import type { User } from '../types/index.js';

let users: User[] = [
    { id: 'user-1', username: 'IvanGR9', email: 'ivan@spottlyft.com', gymId: 'gym-1' },
    { id: 'user-2', username: 'CarlosF', email: 'carlos@spottlyft.com', gymId: 'gym-1' },
    { id: 'user-3', username: 'MartaLP', email: 'marta@spottlyft.com', gymId: 'gym-1' },
    { id: 'user-4', username: 'PabloM', email: 'pablo@spottlyft.com', gymId: 'gym-1' },
    { id: 'user-5', username: 'LauraS', email: 'laura@spottlyft.com', gymId: 'gym-1' },
];

export function getUserById(id: string): User {
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('NOT_FOUND');
    return user;
}

export function createUser(data: Omit<User, 'id'>): User {
    const newUser: User = { id: crypto.randomUUID(), ...data };
    users.push(newUser);
    return newUser;
}