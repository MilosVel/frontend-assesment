import { useEffect, useMemo, useState } from "react";
import type { ILegislationItem } from "@/api/legislation/dto/legislation-dto";

export function useFavourites(legislationData?: { results: ILegislationItem[] }) {
    const [favourites, setFavourites] = useState<Set<string>>(() => new Set());
    const [cache, setCache] = useState<Record<string, ILegislationItem>>({});

    useEffect(() => {
        if (!legislationData?.results) return;

        setCache(prev => {
            const next = { ...prev };

            legislationData.results.forEach(item => {
                const id = `${item.bill.billNo}-${item.bill.billYear}`;
                next[id] = item;
            });

            return next;
        });
    }, [legislationData]);

    const toggleFavourite = (item: ILegislationItem) => {
        const id = `${item.bill.billNo}-${item.bill.billYear}`;

        console.log("Dispatch favourite request:", id);

        setFavourites(prev => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };
    const favouriteRows = useMemo(() => {
        return Array.from(favourites)
            .map(id => cache[id])
            .filter(Boolean);
    }, [favourites, cache]);


    return {
        favourites,
        toggleFavourite,
        favouriteRows,
    };
}