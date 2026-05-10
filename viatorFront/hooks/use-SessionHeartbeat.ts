import { useEffect, useRef } from 'react';
import { authAPI } from '../lib/auth-api';

export const useSessionHeartbeat = (isLoggedIn: boolean, token: string | null, logout: () => void) => {
    const lastActivity = useRef(Date.now());

    useEffect(() => {
        if (!isLoggedIn || !token) return;
        const handleActivity = () => {
            lastActivity.current = Date.now();
        };

        window.addEventListener('click', handleActivity);

        const interval = setInterval(async () => {
            const now = Date.now();
            const inactiveTime = now - lastActivity.current;

            if (inactiveTime < 5 * 60 * 1000) { // 5 minutos
                try {
                    await authAPI.heartbeat(token);
                } catch (err: any) {
                    console.error("Error en heartbeat:", err);
                    if (err.status === 401) {
                        logout();
                    }
                }
            }
        }, 2 * 60 * 1000);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            clearInterval(interval);
        };
    }, [isLoggedIn, token, logout]);
};