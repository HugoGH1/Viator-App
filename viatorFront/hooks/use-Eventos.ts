import { useState, useEffect, useCallback, useMemo } from "react";
import { getEventos, type Evento } from "../lib/api";

export function useEventos(empresaId?: string) {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEventos = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getEventos();
            setEventos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    const filteredEventos = useMemo(() => {
        if (!empresaId) return eventos;
        return eventos.filter(e => e.idEmpresa === empresaId);
    }, [eventos, empresaId]);

    return { eventos: filteredEventos, isLoading, error, refetch: fetchEventos };
}
