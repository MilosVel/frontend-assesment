import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFavourites } from "@/features/hooks/use-favourites";
import type { ILegislationItem } from "@/api/legislation/dto/legislation-dto";

const makeBill = (
    billNo: string,
    billYear: string
): ILegislationItem => ({
    bill: {
        billNo,
        billYear,
        billType: "Public",
        billTypeURI: "",
        shortTitleEn: `Bill ${billNo}`,
        shortTitleGa: "",
        source: "",
        sourceURI: "",
        status: "",
        statusURI: "",
        method: "",
        methodURI: "",
        lastUpdated: "",
        uri: "",
        mostRecentStage: {
            event: {
                progressStage: 1,
                showAs: "",
                stageCompleted: false,
                stageOutcome: null,
            },
        },
        sponsors: [],
    },
    contextDate: "",
});

const bill1 = makeBill("1", "2024");
const bill2 = makeBill("2", "2024");

describe("useFavourites", () => {
    it("starts empty", () => {
        const { result } = renderHook(() => useFavourites());

        expect(result.current.favourites.size).toBe(0);
        expect(result.current.favouriteRows).toEqual([]);
    });

    it("adds a favourite", () => {
        const { result } = renderHook(() =>
            useFavourites({
                results: [bill1, bill2],
            })
        );

        act(() => {
            result.current.toggleFavourite(bill1);
        });

        expect(result.current.favourites.has("1-2024")).toBe(true);
        expect(result.current.favouriteRows).toEqual([bill1]);
    });

    it("removes a favourite when toggled twice", () => {
        const { result } = renderHook(() =>
            useFavourites({
                results: [bill1, bill2],
            })
        );

        act(() => {
            result.current.toggleFavourite(bill1);
        });

        act(() => {
            result.current.toggleFavourite(bill1);
        });

        expect(result.current.favourites.size).toBe(0);
        expect(result.current.favouriteRows).toEqual([]);
    });

    it("supports multiple favourites", () => {
        const { result } = renderHook(() =>
            useFavourites({
                results: [bill1, bill2],
            })
        );

        act(() => {
            result.current.toggleFavourite(bill1);
        });

        act(() => {
            result.current.toggleFavourite(bill2);
        });

        expect(result.current.favourites.size).toBe(2);
        expect(result.current.favouriteRows).toEqual([bill1, bill2]);
    });

    it("returns only favourited rows", () => {
        const { result } = renderHook(() =>
            useFavourites({
                results: [bill1, bill2],
            })
        );

        act(() => {
            result.current.toggleFavourite(bill2);
        });

        expect(result.current.favouriteRows).toEqual([bill2]);
    });
});