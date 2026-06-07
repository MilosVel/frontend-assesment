import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import BillsPage from "@/pages/bills-page";
import type { ILegislationResponse } from "@/api/legislation/dto/legislation-dto";

vi.mock("@/features/legislation/api/use-get-legislations", () => ({
    useGetLegislations: vi.fn(),
}));

import { useGetLegislations } from "@/features/legislation/api/use-get-legislations";

const mockData: ILegislationResponse = {
    head: { counts: { billCount: 1, resultCount: 1 } },
    results: [
        {
            bill: {
                billNo: "1",
                billYear: "2024",
                billType: "Public",
                billTypeURI: "",
                shortTitleEn: "First Bill EN",
                shortTitleGa: "First Bill GA",
                source: "Government",
                sourceURI: "",
                status: "Current",
                statusURI: "",
                method: "",
                methodURI: "",
                lastUpdated: "2024-01-01",
                uri: "",
                mostRecentStage: {
                    event: {
                        progressStage: 1,
                        showAs: "First Stage",
                        stageCompleted: false,
                        stageOutcome: null,
                    },
                },
                sponsors: [],
            },
            contextDate: "2024-01-01",
        },
    ],
};

const mockQuery = (
    data: ILegislationResponse | undefined,
    isLoading: boolean,
) => ({ data, isLoading }) as Partial<UseQueryResult<ILegislationResponse>> as UseQueryResult<ILegislationResponse>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
        {children}
    </QueryClientProvider>
);

describe("BillsPage", () => {
    it("shows loading spinner while fetching", () => {
        vi.mocked(useGetLegislations).mockReturnValue(mockQuery(undefined, true));

        render(<BillsPage />, { wrapper });

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders bill after loading", () => {
        vi.mocked(useGetLegislations).mockReturnValue(mockQuery(mockData, false));

        render(<BillsPage />, { wrapper });

        expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
    });

    it("opens modal on row click", async () => {
        const user = userEvent.setup();

        vi.mocked(useGetLegislations).mockReturnValue(mockQuery(mockData, false));

        render(<BillsPage />, { wrapper });

        await user.click(screen.getByRole("cell", { name: "1" }));

        expect(screen.getByText("Bill 1/2024")).toBeInTheDocument();
    });

    it("switches to favourites tab showing no results when none favourited", async () => {
        const user = userEvent.setup();

        vi.mocked(useGetLegislations).mockReturnValue(mockQuery(mockData, false));

        render(<BillsPage />, { wrapper });

        await user.click(screen.getByRole("tab", { name: /favourites/i }));

        expect(screen.getByText("No results")).toBeInTheDocument();
    });

    it("shows favourited bill in favourites tab", async () => {
        const user = userEvent.setup();

        vi.mocked(useGetLegislations).mockReturnValue(mockQuery(mockData, false));

        render(<BillsPage />, { wrapper });

        const row = screen.getByRole("row", { name: /1/i });
        await user.click(within(row).getByRole("button"));

        await user.click(screen.getByRole("tab", { name: /favourites/i }));

        expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
    });

    it("removes bill from favourites tab after unfavouriting", async () => {
        const user = userEvent.setup();

        vi.mocked(useGetLegislations).mockReturnValue(mockQuery(mockData, false));

        render(<BillsPage />, { wrapper });

        const row = screen.getByRole("row", { name: /1/i });
        const starButton = within(row).getByRole("button");

        await user.click(starButton);
        await user.click(starButton);

        await user.click(screen.getByRole("tab", { name: /favourites/i }));

        expect(screen.getByText("No results")).toBeInTheDocument();
    });
});