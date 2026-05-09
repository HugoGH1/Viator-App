import { useState, useEffect, useCallback } from "react";
import { getCategorias, type Categoria } from "../lib/api";

interface UseCategoriasReturn {
    categorias: Categoria[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useCategorias(): UseCategoriasReturn {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategorias = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCategorias();
            setCategorias(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    return { categorias, isLoading, error, refetch: fetchCategorias };
}
