import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TibiaLootSplit } from '../tibia-loot-split';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'tibiaLootSplit.pasteLabel': 'Paste party hunt analyser data',
        'tibiaLootSplit.pastePlaceholder': 'Paste here...',
        'tibiaLootSplit.submit': 'Submit',
        'tibiaLootSplit.reset': 'Reset',
        'tibiaLootSplit.noPlayers': 'No player data found',
        'tibiaLootSplit.tcValue': 'TC value (gp)',
        'tibiaLootSplit.player': 'Player',
        'tibiaLootSplit.players': 'Players',
        'tibiaLootSplit.extraTc': 'Extra TC',
        'tibiaLootSplit.extraGoldK': 'Extra gold (k)',
        'tibiaLootSplit.balance': 'Balance',
        'tibiaLootSplit.transfer': 'Transfer',
        'tibiaLootSplit.totalLoot': 'Total Loot',
        'tibiaLootSplit.totalSupplies': 'Total Supplies',
        'tibiaLootSplit.net': 'Net (gp)',
        'tibiaLootSplit.netProfit': 'Net Profit',
        'tibiaLootSplit.totalExtra': 'Total Extra Expenses',
        'tibiaLootSplit.perPlayer': 'Per player',
        'tibiaLootSplit.pay': 'Pay',
        'tibiaLootSplit.receive': 'Receive',
        'tibiaLootSplit.even': 'Even',
        'tibiaLootSplit.fairShare': 'Fair Share',
        'tibiaLootSplit.partyBalance': 'Party Balance',
        'tibiaLootSplit.settlements': 'Settlements',
        'tibiaLootSplit.result': 'Result',
        'tibiaLootSplit.value': 'Value',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const partyHuntText = `Session: 2024-01-01 14:30 (1:00)
Party Hunt Analysis
Player: Knight (Level 200)
Damage: 1000000
Healing: 50000
Loot: 200000
Supplies: 50000
Balance: 150000
Player: Druid (Level 180)
Damage: 800000
Healing: 300000
Loot: 100000
Supplies: 40000
Balance: 60000`;

describe('TibiaLootSplit', () => {
  it('shows Pay/Receive correctly for two players with different loot', async () => {
    const user = userEvent.setup();
    render(<TibiaLootSplit />);

    const textarea = screen.getByPlaceholderText('Paste here...');
    await user.type(textarea, partyHuntText);

    const submit = screen.getByText('Submit');
    await user.click(submit);

    expect(screen.getByText(/Pay/)).toBeInTheDocument();
    expect(screen.getByText(/Receive/)).toBeInTheDocument();
  });

  it('transfers sum to zero (pay total equals receive total)', async () => {
    const user = userEvent.setup();
    render(<TibiaLootSplit />);

    const textarea = screen.getByPlaceholderText('Paste here...');
    await user.type(textarea, partyHuntText);

    const submit = screen.getByText('Submit');
    await user.click(submit);

    const payText = screen.getByText(/Pay/).textContent || '';
    const receiveText = screen.getByText(/Receive/).textContent || '';

    const payMatch = payText.match(/[\d,]+/);
    const receiveMatch = receiveText.match(/[\d,]+/);

    expect(payMatch).toBeTruthy();
    expect(receiveMatch).toBeTruthy();

    const payAmount = parseInt(payMatch![0].replace(/,/g, ''), 10);
    const receiveAmount = parseInt(receiveMatch![0].replace(/,/g, ''), 10);

    expect(payAmount).toBe(receiveAmount);
  });

  it('shows Fair Share and Party Balance in summary', async () => {
    const user = userEvent.setup();
    render(<TibiaLootSplit />);

    const textarea = screen.getByPlaceholderText('Paste here...');
    await user.type(textarea, partyHuntText);

    const submit = screen.getByText('Submit');
    await user.click(submit);

    expect(screen.getByText('Party Balance')).toBeInTheDocument();
    expect(screen.getByText('Fair Share')).toBeInTheDocument();
  });
});
