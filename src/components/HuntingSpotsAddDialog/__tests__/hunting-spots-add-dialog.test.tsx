import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HuntingSpotsAddDialog } from '@/components/HuntingSpotsAddDialog/hunting-spots-add-dialog';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'test-uid' }, isAuthenticated: true }),
}));

vi.mock('@/firebase/huntingSpots', () => ({
  addHuntingSpot: vi.fn().mockResolvedValue('new-spot-id'),
}));

vi.mock('@/lib/monitoring', () => ({
  captureError: vi.fn(),
  captureEvent: vi.fn(),
}));

vi.mock('@/helpers', () => ({
  vocations: [],
}));

describe('HuntingSpotsAddDialog', () => {
  it('renders the trigger button', () => {
    render(<HuntingSpotsAddDialog />);
    expect(screen.getByText('huntingSpotsAdd.addSpot')).toBeDefined();
  });
});
