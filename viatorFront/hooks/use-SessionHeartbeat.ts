import { useEffect, useRef } from 'react';
import { authAPI } from '../lib/auth-api';

export const useSessionHeartbeat = (isLoggedIn: boolean, token: string | null, logout: () => void) => {
    const lastActivity = useRef(Date.now());

    useEffect(() => {
        if (!isLoggedIn || !token) return;

        // 1. Detectar actividad
        const handleActivity = () => {
            lastActivity.current = Date.now();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);

        // 2. Intervalo de Heartbeat (cada 2 minutos)
        const interval = setInterval(async () => {
            const now = Date.now();
            const inactiveTime = now - lastActivity.current;

            // Si hubo actividad en los últimos 2 minutos, avisamos al servidor
            if (inactiveTime < 2 * 60 * 1000) {
                try {
                    await authAPI.heartbeat(token);
                } catch (err: any) {
                    console.error("Error en heartbeat:", err);
                    // Si el error es de autorización (401), la sesión expiró o el token es inválido
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