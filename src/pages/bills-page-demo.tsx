// This is only for demo purpose 
import { useState } from "react";
import { TableComponent } from "@/components/table/table";
import { useGetLegislations } from "@/features/legislation/api/use-get-legislations";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import { useFilters } from "@/hooks/use-filters";
import type { Column } from "@/components/table/table";

interface BillTableRow {
    id: string;
    billNumber: string;
    billType: string;
    billStatus: string;
    sponsor: string;
    titleEn: string;
    titleGa: string;
    favourite: boolean;
}

export default function BillsPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [favouriteBill, setFavouriteBill] = useState<BillTableRow | null>(null);

    console.log("Favourite bill:", favouriteBill);


    const { filters } = useFilters({
        initialFilters: {
            bill_source: [],
            bill_status: null,
        },
    });

    const { data: legislationData, isLoading } = useGetLegislations({
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        bill_source:
            filters.bill_source.length > 0 ? filters.bill_source : undefined,
        bill_status: filters.bill_status ? [filters.bill_status] : undefined,
    });




    const billRows: BillTableRow[] =
        legislationData?.results.map((item) => ({
            id: `${item.bill.billNo}-${item.bill.billYear}`,
            billNumber: `${item.bill.billNo}/${item.bill.billYear}`,

            billType: item.bill.method ?? "-",

            billStatus: item.bill.mostRecentStage?.event?.showAs ?? "-",

            sponsor: item.bill.source ?? "-",

            titleEn: item.bill.shortTitleEn,
            titleGa: item.bill.shortTitleGa,

            favourite: false,
        })) ?? [];

    const billColumns: Column<BillTableRow>[] = [
        {
            id: "billNumber",
            label: "Bill Number",
            minWidth: 120,
        },
        {
            id: "billType",
            label: "Bill Type",
            minWidth: 150,
        },
        {
            id: "billStatus",
            label: "Bill Status",
            minWidth: 200,
        },
        {
            id: "sponsor",
            label: "Sponsor",
            minWidth: 200,
        },
        {
            id: "favourite",
            label: "Favourite",
            minWidth: 100,
            align: "center",
            render: (row) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();

                        console.log(`Dispatch favourite request for ${row.billNumber}`);
                    }}
                >
                    {row.favourite ? <StarIcon color="warning" /> : <StarBorderIcon />}
                </IconButton>
            ),
        },
    ];

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (rowsPerPage: number) => {
        setRowsPerPage(rowsPerPage);
        setPage(0);
    };

    return (
        <>
            <TableComponent
                columns={billColumns}
                rows={billRows}
                rowKey={(row) => row.id}
                loading={isLoading}
                onRowClick={(row) => setFavouriteBill(row)}
                rowsPerPageOptions={[10, 25, 50]}
                totalCount={legislationData?.head.counts.billCount ?? 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}
