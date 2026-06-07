import { useState, useMemo } from "react";
import type { ILegislationItem } from "@/api/legislation/dto/legislation-dto";

export function useFavourites() {
    const [favourites, setFavourites] = useState<Map<string, ILegislationItem>>(
        () => new Map()
    );

    const toggleFavourite = (item: ILegislationItem) => {
        const id = `${item.bill.billNo}-${item.bill.billYear}`;

        console.log("Dispatch favourite request:", id);

        setFavourites(prev => {
            const next = new Map(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.set(id, item);
            }
            return next;
        });
    };

    const favouriteIds = useMemo(() => new Set(favourites.keys()), [favourites]);

    const favouriteRows = useMemo(() => Array.from(favourites.values()), [favourites]);

    return {
        favourites: favouriteIds,
        toggleFavourite,
        favouriteRows,
    };
}