import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpShareCalculator } from '../exp-share-calculator';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'expShareCalculator.yourLevel': 'Your Level',
        'expShareCalculator.result': 'Result',
        'expShareCalculator.value': 'Value',
        'expShareCalculator.minLevel': 'Min Level',
        'expShareCalculator.maxLevel': 'Max Level',
        'expShareCalculator.enterValidLevel': 'Enter a valid level',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('ExpShareCalculator', () => {
  const getInput = () => screen.getByDisplayValue('100');

  it('shows correct min/max for level 100 (min 67, max 150)', async () => {
    const user = userEvent.setup();
    render(<ExpShareCalculator />);
    const input = getInput();
    await user.clear(input);
    await user.type(input, '100');
    expect(screen.getByText('67')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('shows correct min/max for level 99 (min 66, max 148)', async () => {
    const user = userEvent.setup();
    render(<ExpShareCalculator />);
    const input = getInput();
    await user.clear(input);
    await user.type(input, '99');
    expect(screen.getByText('66')).toBeInTheDocument();
    expect(screen.getByText('148')).toBeInTheDocument();
  });

  it('shows correct min/max for level 1 (min 1, max 1)', async () => {
    const user = userEvent.setup();
    render(<ExpShareCalculator />);
    const input = getInput();
    await user.clear(input);
    await user.type(input, '1');
    expect(screen.getAllByText('1')).toHaveLength(3);
  });
});
