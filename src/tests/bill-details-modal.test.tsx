import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BillDetailsModal } from '@/features/components/bill-details-modal';
import type { ILegislationItem } from '@/api/legislation/dto/legislation-dto';

const bill: ILegislationItem = {
  bill: {
    billNo: '42',
    billYear: '2024',
    billType: 'Public',
    billTypeURI: '',
    shortTitleEn: 'Some English Title',
    shortTitleGa: 'Some Irish Title',
    source: 'Government',
    sourceURI: '',
    status: 'Current',
    statusURI: '',
    method: '',
    methodURI: '',
    lastUpdated: '2024-01-01',
    uri: '',
    mostRecentStage: {
      event: {
        progressStage: 1,
        showAs: 'First Stage',
        stageCompleted: false,
        stageOutcome: null,
      },
    },
    sponsors: [],
  },
  contextDate: '2024-01-01',
};

describe('BillDetailsModal', () => {
  it('renders nothing when bill is null', () => {
    const { container } = render(
      <BillDetailsModal open={false} bill={null} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders bill number and year in title', () => {
    render(<BillDetailsModal open={true} bill={bill} onClose={vi.fn()} />);
    expect(screen.getByText('Bill 42/2024')).toBeInTheDocument();
  });

  it('shows English title by default', () => {
    render(<BillDetailsModal open={true} bill={bill} onClose={vi.fn()} />);
    expect(screen.getByText('Some English Title')).toBeInTheDocument();
  });

  it('switches to Irish title on Gaeilge tab', async () => {
    const user = userEvent.setup();

    render(<BillDetailsModal open={true} bill={bill} onClose={vi.fn()} />);

    await user.click(screen.getByRole('tab', { name: 'Gaeilge' }));

    expect(screen.getByText('Some Irish Title')).toBeInTheDocument();
  });

  it('calls onClose when dialog is closed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<BillDetailsModal open={true} bill={bill} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });
});
