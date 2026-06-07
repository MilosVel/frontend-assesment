import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@mui/material';

import type { ILegislationItem } from '@/api/legislation/dto/legislation-dto';

interface BillDetailsModalProps {
  open: boolean;
  bill: ILegislationItem | null;
  onClose: () => void;
}

export function BillDetailsModal({
  open,
  bill,
  onClose,
}: BillDetailsModalProps) {
  const [tab, setTab] = useState<'en' | 'ga'>('en');

  if (!bill) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Bill {bill.bill.billNo}/{bill.bill.billYear}
      </DialogTitle>

      <DialogContent>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
          <Tab value="en" label="English" />
          <Tab value="ga" label="Gaeilge" />
        </Tabs>

        <Box>
          {tab === 'en' && <Typography>{bill.bill.shortTitleEn}</Typography>}

          {tab === 'ga' && <Typography>{bill.bill.shortTitleGa}</Typography>}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
