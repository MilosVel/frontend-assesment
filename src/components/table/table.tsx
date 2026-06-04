import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

type BaseColumn = {
    label: string;
    minWidth?: number;
    align?: "left" | "right" | "center";
};

export type Column<T> =
    | (BaseColumn & {
        id: keyof T;
        render?: never;
    })
    | (BaseColumn & {
        id: string;
        render: (row: T) => React.ReactNode;
    });

//// Simpler but less type-safe
// export interface Column<T> {
//   //   id: keyof T;
//   id: keyof T | string;
//   label: string;
//   minWidth?: number;
//   align?: "left" | "right" | "center";
//   render?: (row: T) => React.ReactNode; // custom cell rendering
// }

interface ReusableTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    onRowClick?: (row: T) => void;

    // pagination
    showPagination?: boolean;
    totalCount?: number;
    page?: number;
    rowsPerPage?: number;
    onPageChange?: (newPage: number) => void;
    onRowsPerPageChange?: (newRowsPerPage: number) => void;
    rowsPerPageOptions?: number[];

    //loading and no results
    loading?: boolean;
    noResultsMessage?: string;

}

export function TableComponent<T>({
    columns,
    rows,
    rowKey,
    onRowClick,
    totalCount,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [10, 25, 50],
    loading = false,
    noResultsMessage,
    showPagination = true
}: ReusableTableProps<T>) {
    const hasPagination = totalCount !== undefined && onPageChange !== undefined;

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="reusable table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.id)}
                                    align={column.align ?? "left"}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    align="center"
                                    sx={{ py: 4 }}
                                >
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    {noResultsMessage ?? "No results"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={String(rowKey(row))}
                                    onClick={() => onRowClick?.(row)}
                                    sx={{ cursor: onRowClick ? "pointer" : "default" }}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={String(column.id)}
                                            align={column.align ?? "left"}
                                        >
                                            {
                                                column.render
                                                    ? column.render(row) // custom render
                                                    : String(row[column.id as keyof T] ?? "") // default render
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {showPagination && hasPagination && (
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => onPageChange(newPage)}
                    onRowsPerPageChange={(e) => onRowsPerPageChange?.(+e.target.value)}
                />
            )}
        </Paper>
    );
}
