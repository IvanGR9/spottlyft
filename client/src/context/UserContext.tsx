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

function loadFromStorage<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(() => loadFromStorage<User>('sl_user'));
    const [gym, setGymState] = useState<Gym | null>(() => loadFromStorage<Gym>('sl_gym'));

    const setUser = useCallback((u: User | null) => {
        setUserState(u);
        if (u) localStorage.setItem('sl_user', JSON.stringify(u));
        else localStorage.removeItem('sl_user');
    }, []);

    const setGym = useCallback((g: Gym | null) => {
        setGymState(g);
        if (g) localStorage.setItem('sl_gym', JSON.stringify(g));
        else localStorage.removeItem('sl_gym');
    }, []);

    const logout = useCallback(() => {
        setUserState(null);
        setGymState(null);
        localStorage.removeItem('sl_user');
        localStorage.removeItem('sl_gym');
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