'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse, authAPI } from '../lib/auth-api';
import { useSessionHeartbeat } from '../hooks/use-SessionHeartbeat';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    setSession: (data: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);

            try {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Error parsing stored user:", e);

                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
            }
        }

        const handleSessionExpired = () => {
            logout();
        };

        window.addEventListener(
            'sesion-expirada',
            handleSessionExpired
        );

        setIsLoading(false);

        return () => {
            window.removeEventListener(
                'sesion-expirada',
                handleSessionExpired
            );
        };
    }, []);

    const setSession = (data: LoginResponse) => {
        setToken(data.access_token);
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const logout = async () => {
        if (token) {
            try {
                await authAPI.logout(token);
            } catch (err) {
                console.warn("Advertencia al cerrar sesión:", err);
            }
        }
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, isLoading, setSession, logout }}>
            {children}
            <HeartbeatManager />
        </AuthContext.Provider>
    );
}

// Componente helper para inicializar el heartbeat dentro del contexto
function HeartbeatManager() {
    const { isLoggedIn, token, logout } = useAuth();
    useSessionHeartbeat(isLoggedIn, token, logout);
    return null;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
