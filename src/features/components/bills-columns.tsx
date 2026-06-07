import type { Column } from '@/components/table/table';
import type { ILegislationItem } from '@/api/legislation/dto/legislation-dto';

import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

interface Props {
  favourites: Set<string>;
  toggleFavourite: (item: ILegislationItem) => void;
}

export const createBillColumns = ({
  favourites,
  toggleFavourite,
}: Props): Column<ILegislationItem>[] => [
  {
    id: 'billNumber',
    label: 'Bill Number',
    minWidth: 120,
    render: (row) => row.bill.billNo,
  },
  {
    id: 'billType',
    label: 'Bill Type',
    minWidth: 150,
    render: (row) => row.bill.billType,
  },
  {
    id: 'billStatus',
    label: 'Bill Status',
    minWidth: 200,
    render: (row) => row.bill.status,
  },
  {
    id: 'sponsor',
    label: 'Sponsor',
    minWidth: 200,
    render: (row) => {
      const primary = row.bill.sponsors?.find((s) => s.sponsor.isPrimary);
      return primary?.sponsor.as.showAs ?? row.bill.source ?? '-';
    },
  },
  {
    id: 'favourite',
    label: 'Favourite',
    minWidth: 100,
    align: 'center',
    render: (row) => {
      const id = `${row.bill.billNo}-${row.bill.billYear}`;
      const isFav = favourites.has(id);

      return (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(row);
          }}
        >
          {isFav ? <StarIcon color="warning" /> : <StarBorderIcon />}
        </IconButton>
      );
    },
  },
];
