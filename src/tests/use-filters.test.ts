import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useFilters } from "@/hooks/use-filters";

const initialFilters = {
    bill_source: [] as string[],
    bill_status: null as string | null,
};

describe("useFilters", () => {
    it("returns initial filters", () => {
        const { result } = renderHook(() => useFilters({ initialFilters }));
        expect(result.current.filters).toEqual(initialFilters);
    });

    it("sets a single filter", () => {
        const { result } = renderHook(() => useFilters({ initialFilters }));

        act(() => {
            result.current.setFilter("bill_status", "Current");
        });

        expect(result.current.filters.bill_status).toBe("Current");
    });

    it("sets filters in bulk", () => {
        const { result } = renderHook(() => useFilters({ initialFilters }));

        act(() => {
            result.current.setFilters({
                bill_source: ["Government"],
                bill_status: "Enacted",
            });
        });

        expect(result.current.filters.bill_source).toEqual(["Government"]);
        expect(result.current.filters.bill_status).toBe("Enacted");
    });

    it("resets filters to initial values", () => {
        const { result } = renderHook(() => useFilters({ initialFilters }));

        act(() => {
            result.current.setFilter("bill_status", "Current");
        });

        act(() => {
            result.current.resetFilters();
        });

        expect(result.current.filters).toEqual(initialFilters);
    });

    it("removes a single filter back to initial value", () => {
        const { result } = renderHook(() => useFilters({ initialFilters }));

        act(() => {
            result.current.setFilter("bill_status", "Current");
        });

        act(() => {
            result.current.removeFilter("bill_status");
        });

        expect(result.current.filters.bill_status).toBeNull();
    });
});