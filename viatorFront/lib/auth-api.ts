import ApiResponseError from "./error";

const NEXT_PUBLIC_AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:3000";

export interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface LoginError {
    message: string;
}

type LoginResult = LoginResponse | LoginError;

export const authAPI = {
    login: async (email: string, password: string): Promise<LoginResult> => {
        const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return {
                message: errorData?.message || "Credenciales inválidas"
            }
        }

        return await res.json();
    },

    register: async (email: string, password: string, name: string): Promise<User> => {
        const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/auth/users/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const errorMessage = errorData?.message || res.statusText;
            throw new ApiResponseError(`Error al registrar usuario: ${errorMessage}`, res.status);
        }

        return await res.json();
    },

    heartbeat: async (token: string): Promise<void> => {
        const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/auth/heartbeat`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 401) {
            window.dispatchEvent(new Event('sesion-expirada'));
            return;
        };

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const errorMessage = errorData?.message || res.statusText;
            throw new ApiResponseError(`Error en heartbeat: ${errorMessage}`, res.status);
        }
    },

    logout: async (token: string): Promise<void> => {
        const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 401) return;
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const errorMessage = errorData?.message || res.statusText;
            throw new ApiResponseError(`Error al cerrar sesión: ${errorMessage}`, res.status);
        }
    }
};
