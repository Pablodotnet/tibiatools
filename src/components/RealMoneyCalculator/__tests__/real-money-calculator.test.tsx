import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RealMoneyCalculator } from '../real-money-calculator';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'realMoney.calculator.priceFor250Tc': 'Price for 250 Tibia Coins',
        'realMoney.calculator.priceFor250TcDesc': 'The price in real money, default is $200 pesos MXN.',
        'realMoney.calculator.tibiaGoldForOneTc': 'Tibia Gold for ONE Tibia Coin',
        'realMoney.calculator.tibiaGoldForOneTcDesc': 'The amount of Tibia Gold for ONE Tibia Coin, default is 40k gold.',
        'realMoney.calculator.goldToConvert': 'Gold to Convert',
        'realMoney.calculator.goldToConvertDesc': 'Enter the amount of gold you want to convert, with format "10kk", for example.',
        'realMoney.calculator.calculate': 'Calculate',
        'realMoney.calculator.clear': 'Clear',
        'realMoney.calculator.goBack': 'Go Back',
        'realMoney.calculator.toGet': 'To get',
        'realMoney.calculator.goldYouWould': 'gold you would need',
        'realMoney.calculator.tibiaCoins': 'Tibia Coins',
        'realMoney.calculator.realMoney': 'Real Money',
        'realMoney.calculator.priceFor250TcMsg': 'Price for 250 Tibia Coins must be at least 2 characters.',
        'realMoney.calculator.tibiaGoldForOneTcMsg': 'Tibia gold for one Tibia Coin must be at least 2 characters.',
        'realMoney.calculator.goldToConvertMsg': 'Gold to convert must be at least 2 characters.',
        'errors.invalidStringFormat': 'Invalid string format',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe('RealMoneyCalculator', () => {
  it('renders all form fields', () => {
    render(<RealMoneyCalculator />);
    expect(screen.getByText('Price for 250 Tibia Coins')).toBeInTheDocument();
    expect(screen.getByText('Tibia Gold for ONE Tibia Coin')).toBeInTheDocument();
    expect(screen.getByText('Gold to Convert')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('shows result after valid calculation with kk format', async () => {
    const user = userEvent.setup();
    render(<RealMoneyCalculator />);

    const goldInput = screen.getByPlaceholderText('Enter amount');
    await user.clear(goldInput);
    await user.type(goldInput, '10kk');

    await user.click(screen.getByText('Calculate'));

    expect(screen.getByText(/To get/)).toBeInTheDocument();
    expect(screen.getByText(/Go Back/)).toBeInTheDocument();
  });

  it('shows result after valid calculation with plain number', async () => {
    const user = userEvent.setup();
    render(<RealMoneyCalculator />);

    const goldInput = screen.getByPlaceholderText('Enter amount');
    await user.clear(goldInput);
    await user.type(goldInput, '10000000');

    await user.click(screen.getByText('Calculate'));

    expect(screen.getByText(/To get/)).toBeInTheDocument();
  });

  it('clears form and returns to input view on Go Back', async () => {
    const user = userEvent.setup();
    render(<RealMoneyCalculator />);

    const goldInput = screen.getByPlaceholderText('Enter amount');
    await user.clear(goldInput);
    await user.type(goldInput, '10kk');
    await user.click(screen.getByText('Calculate'));

    expect(screen.getByText(/To get/)).toBeInTheDocument();

    await user.click(screen.getByText('Go Back'));

    expect(screen.getByText('Price for 250 Tibia Coins')).toBeInTheDocument();
  });

  it('toasts error on invalid kk string', async () => {
    const { toast } = await import('sonner');
    const user = userEvent.setup();
    render(<RealMoneyCalculator />);

    const goldInput = screen.getByPlaceholderText('Enter amount');
    await user.clear(goldInput);
    await user.type(goldInput, 'invalid!');

    await user.click(screen.getByText('Calculate'));

    expect(toast.error).toHaveBeenCalledWith('Invalid string format');
  });
});
