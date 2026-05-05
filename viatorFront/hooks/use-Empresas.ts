import { useState, useEffect, useCallback } from "react";
import { getEmpresas, type Empresa } from "../lib/api";

interface UseEmpresasReturn {
    empresas: Empresa[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useEmpresas(): UseEmpresasReturn {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmpresas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getEmpresas();
            setEmpresas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]);

    return { empresas, isLoading, error, refetch: fetchEmpresas };
}