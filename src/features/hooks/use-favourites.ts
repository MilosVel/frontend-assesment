import { useEffect, useMemo, useState, useRef } from "react";
import type { ILegislationItem } from "@/api/legislation/dto/legislation-dto";

export function useFavourites(legislationData?: { results: ILegislationItem[] }) {
    const [favourites, setFavourites] = useState<Set<string>>(() => new Set());
    const cacheRef = useRef<Record<string, ILegislationItem>>({});

    useEffect(() => {
        if (!legislationData?.results) return;


        legislationData.results.forEach(item => {
            const id = `${item.bill.billNo}-${item.bill.billYear}`;
            cacheRef.current[id] = item;
        });

    }, [legislationData?.results]);

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
            .map(id => cacheRef.current[id])
            .filter(Boolean);
    }, [favourites]);


    return {
        favourites,
        toggleFavourite,
        favouriteRows,
    };
}