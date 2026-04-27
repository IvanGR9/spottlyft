import { createContext, useContext, useState, useCallback } from 'react';
import type { User, Gym } from '../types/index.js';

interface UserContextType {
    user: User | null;
    gym: Gym | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setGym: (gym: Gym | null) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>({
        id: 'user-1',
        username: 'IvanGR9',
        email: 'ivan@spottlyft.com',
        gymId: 'gym-1'
    });

    const [gym, setGym] = useState<Gym | null>({
        id: 'gym-1',
        name: 'Gimnasio Local',
        location: 'Madrid',
        qrCode: 'QR-GYM-001'
    });

    const logout = useCallback(() => {
        setUser(null);
        setGym(null);
    }, []);

    const isAuthenticated = user !== null;

    return (
        <UserContext.Provider value={{ user, gym, isAuthenticated, setUser, setGym, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
    return context;
}