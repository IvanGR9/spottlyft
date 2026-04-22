import { createContext, useContext, useState } from 'react';
import type { User, Gym } from '../types/index.js';

interface UserContextType {
    user: User | null;
    gym: Gym | null;
    setUser: (user: User | null) => void;
    setGym: (gym: Gym | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [gym, setGym] = useState<Gym | null>(null);

    return (
        <UserContext.Provider value={{ user, gym, setUser, setGym }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
    return context;
}