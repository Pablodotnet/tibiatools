import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImbuingChecker } from '../imbuing-checker';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'imbuingChecker.itemType': 'Item type',
        'imbuingChecker.selectType': 'Select the type',
        'imbuingChecker.searchItem': 'Search item',
        'imbuingChecker.filterPlaceholder': 'Type to filter items...',
        'imbuingChecker.item': 'Item',
        'imbuingChecker.selectItem': 'Select the item',
        'imbuingChecker.noMatch': 'No items match your search',
        'imbuingChecker.clear': 'Clear',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('ImbuingChecker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders item type selector', () => {
    render(<ImbuingChecker />);
    expect(screen.getByText('Select the type')).toBeInTheDocument();
  });

  it('renders clear button', () => {
    render(<ImbuingChecker />);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('shows item search after selecting a type', async () => {
    const user = userEvent.setup();
    render(<ImbuingChecker />);

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const helmetOption = screen.getByText('Helmets');
    await user.click(helmetOption);

    expect(screen.getByText('Search item')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type to filter items...')).toBeInTheDocument();
  });
});
