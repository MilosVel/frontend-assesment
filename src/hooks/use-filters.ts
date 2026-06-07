import { useCallback, useState } from "react";

export type GlobalFilters = Record<string, string | string[] | null>;

export function useFilters<T extends GlobalFilters>({
    initialFilters,
}: {
    initialFilters: T;
}) {
    const [filters, setFilters] = useState<T>(initialFilters);

    const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const setFiltersBulk = useCallback((next: Partial<T>) => {
        setFilters((prev) => ({
            ...prev,
            ...next,
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const removeFilter = useCallback(<K extends keyof T>(key: K) => {
        setFilters((prev) => ({
            ...prev,
            [key]: initialFilters[key],
        }));
    }, [initialFilters]);

    return {
        filters,
        setFilter,
        setFilters: setFiltersBulk,
        resetFilters,
        removeFilter,
    };
}