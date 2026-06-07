import { useState } from 'react';
import { TableComponent } from '@/components/table/table';
import { useGetLegislations } from '@/features/legislation/api/use-get-legislations';
import { useFilters } from '@/hooks/use-filters';
import { Tabs, Tab } from '@mui/material';
import { useFavourites } from '@/features/hooks/use-favourites';
import { BILL_SOURCES, BILL_STATUS } from '@/features/utils/config';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import type { ILegislationItem } from '@/api/legislation/dto/legislation-dto';
import { createBillColumns } from '@/features/components/bills-columns';
import { BillDetailsModal } from '@/features/components/bill-details-modal';

export default function BillsPage() {
  const [tab, setTab] = useState<'all' | 'favourites'>('all');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBill, setSelectedBill] = useState<ILegislationItem | null>(
    null,
  );

  const { filters, setFilter } = useFilters({
    initialFilters: {
      bill_source: [] as string[],
      bill_status: null as string | null,
    },
  });

  const { data: legislationData, isLoading } = useGetLegislations({
    skip: page * rowsPerPage,
    limit: rowsPerPage,
    bill_source:
      filters.bill_source.length > 0 ? filters.bill_source : undefined,
    bill_status: filters.bill_status ? [filters.bill_status] : undefined,
  });

  const { favourites, toggleFavourite, favouriteRows } = useFavourites();

  const billColumns = createBillColumns({
    favourites,
    toggleFavourite,
  });

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setRowsPerPage(rowsPerPage);
    setPage(0);
  };

  const showAll = tab === 'all';
  const displayedRows = showAll
    ? (legislationData?.results ?? [])
    : favouriteRows;

  return (
    <>
      <Tabs
        value={tab}
        onChange={(_, value: 'all' | 'favourites') => setTab(value)}
        sx={{ mb: 3 }}
      >
        <Tab value="all" label="All Bills" />
        <Tab
          value="favourites"
          label={`Favourites (${favouriteRows.length})`}
        />
      </Tabs>

      <BillDetailsModal
        open={Boolean(selectedBill)}
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
      />

      {showAll && (
        <>
          <FormControl sx={{ minWidth: 250, mb: 2 }}>
            <InputLabel>Bill Source</InputLabel>

            <Select
              multiple
              label="Bill Source"
              value={filters.bill_source}
              onChange={(e) => {
                setPage(0);
                setFilter('bill_source', e.target.value as string[]);
              }}
              renderValue={(selected) => selected.join(', ')}
            >
              {BILL_SOURCES.map((source) => (
                <MenuItem key={source.value} value={source.value}>
                  {source.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 250, mb: 2 }}>
            <InputLabel>Bill Status</InputLabel>

            <Select
              label="Bill Status"
              value={filters.bill_status ?? ''}
              onChange={(e) => {
                setFilter('bill_status', e.target.value || null);
                setPage(0);
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>

              {BILL_STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      <TableComponent
        columns={billColumns}
        rows={displayedRows}
        rowKey={(row) => `${row.bill.billNo}-${row.bill.billYear}`}
        loading={isLoading}
        onRowClick={(row) => setSelectedBill(row)}
        showPagination={showAll}
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
