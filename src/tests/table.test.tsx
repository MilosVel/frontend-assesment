import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { TableComponent } from "@/components/table/table";
import type { Column } from "@/components/table/table";

type User = {
    id: number;
    name: string;
};

const rows: User[] = [
    { id: 1, name: "Milos" },
    { id: 2, name: "John" },
];

const columns: Column<User>[] = [
    {
        id: "name",
        label: "Name",
    },
];

describe("TableComponent", () => {
    it("renders column headers", () => {
        render(
            <TableComponent
                columns={columns}
                rows={rows}
                rowKey={(row) => row.id.toString()}
            />
        );

        expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("renders rows correctly", () => {
        render(
            <TableComponent
                columns={columns}
                rows={rows}
                rowKey={(row) => row.id.toString()}
            />
        );

        expect(screen.getByText("Milos")).toBeInTheDocument();
        expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("shows loading spinner", () => {
        render(
            <TableComponent
                columns={columns}
                rows={[]}
                rowKey={(row) => row.id.toString()}
                loading
            />
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("shows default no results message", () => {
        render(
            <TableComponent
                columns={columns}
                rows={[]}
                rowKey={(row) => row.id.toString()}
            />
        );

        expect(screen.getByText("No results")).toBeInTheDocument();
    });

    it("shows custom noResultsMessage", () => {
        render(
            <TableComponent
                columns={columns}
                rows={[]}
                rowKey={(row) => row.id.toString()}
                noResultsMessage="Nothing found"
            />
        );

        expect(screen.getByText("Nothing found")).toBeInTheDocument();
    });

    it("calls onRowClick with correct row", async () => {
        const user = userEvent.setup();
        const onRowClick = vi.fn();

        render(
            <TableComponent
                columns={columns}
                rows={rows}
                rowKey={(row) => row.id.toString()}
                onRowClick={onRowClick}
            />
        );

        await user.click(screen.getByText("Milos"));

        expect(onRowClick).toHaveBeenCalledWith(rows[0]);
    });
});