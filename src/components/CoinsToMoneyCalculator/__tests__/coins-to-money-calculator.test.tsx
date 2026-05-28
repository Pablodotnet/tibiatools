import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CoinsToMoneyCalculator } from '../coins-to-money-calculator';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'coinsToMoney.calculator.priceForOneTc': 'Price for One Tibia Coin',
        'coinsToMoney.calculator.priceForOneTcDesc': 'The price in real money, default is $0.84 pesos MXN.',
        'coinsToMoney.calculator.tcQuantity': 'Tibia Coins Quantity',
        'coinsToMoney.calculator.tcQuantityDesc': 'The amount of Tibia Coins you want to convert, default is 250.',
        'coinsToMoney.calculator.calculate': 'Calculate',
        'coinsToMoney.calculator.clear': 'Clear',
        'coinsToMoney.calculator.goBack': 'Go Back',
        'coinsToMoney.calculator.toGet': 'To get',
        'coinsToMoney.calculator.tcYouWould': 'Tibia Coins you would need',
        'coinsToMoney.calculator.realMoney': 'Real Money',
        'coinsToMoney.calculator.priceForOneTcMsg': 'Price for One Tibia Coin must be at least 1 character.',
        'coinsToMoney.calculator.tcQuantityMsg': 'Tibia Coins Quantity must be at least 1 character.',
        'errors.invalidStringFormat': 'Invalid string format',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe('CoinsToMoneyCalculator', () => {
  it('renders all form fields', () => {
    render(<CoinsToMoneyCalculator />);
    expect(screen.getByText('Price for One Tibia Coin')).toBeInTheDocument();
    expect(screen.getByText('Tibia Coins Quantity')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('shows result after valid calculation', async () => {
    const user = userEvent.setup();
    render(<CoinsToMoneyCalculator />);

    await user.click(screen.getByText('Calculate'));

    expect(screen.getByText(/To get/)).toBeInTheDocument();
  });

  it('shows result with custom TC quantity', async () => {
    const user = userEvent.setup();
    render(<CoinsToMoneyCalculator />);

    const tcInput = screen.getByPlaceholderText('250');
    await user.clear(tcInput);
    await user.type(tcInput, '500');

    await user.click(screen.getByText('Calculate'));

    expect(screen.getByText(/To get/)).toBeInTheDocument();
  });

  it('clears form and returns to input view on Go Back', async () => {
    const user = userEvent.setup();
    render(<CoinsToMoneyCalculator />);

    await user.click(screen.getByText('Calculate'));
    expect(screen.getByText(/To get/)).toBeInTheDocument();

    await user.click(screen.getByText('Go Back'));

    expect(screen.getByText('Price for One Tibia Coin')).toBeInTheDocument();
  });

  it('toasts error on invalid kk string in TC quantity', async () => {
    const { toast } = await import('sonner');
    const user = userEvent.setup();
    render(<CoinsToMoneyCalculator />);

    const tcInput = screen.getByPlaceholderText('250');
    await user.clear(tcInput);
    await user.type(tcInput, 'invalid!');

    await user.click(screen.getByText('Calculate'));

    expect(toast.error).toHaveBeenCalledWith('Invalid string format');
  });
});
