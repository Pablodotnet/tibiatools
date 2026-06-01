import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'exaltationForge.title': 'Exaltation Forge',
        'exaltationForge.description': 'Plan your upgrades',
        'exaltationForge.tabs.fusion.label': 'Fusion',
        'exaltationForge.tabs.fusion.badge': 'NEW',
        'exaltationForge.tabs.fusion.description': 'Fusion description',
        'exaltationForge.tabs.convergenceFusion.label': 'Conv. Fusion',
        'exaltationForge.tabs.convergenceFusion.badge': 'HOT',
        'exaltationForge.tabs.convergenceFusion.description': 'Conv fusion desc',
        'exaltationForge.tabs.transfer.label': 'Transfer',
        'exaltationForge.tabs.transfer.badge': 'TOP',
        'exaltationForge.tabs.transfer.description': 'Transfer desc',
        'exaltationForge.tabs.convergenceTransfer.label': 'Conv. Transfer',
        'exaltationForge.tabs.convergenceTransfer.badge': 'BEST',
        'exaltationForge.tabs.convergenceTransfer.description': 'Conv transfer desc',
      };
      return map[key] ?? key;
    },
  }),
}));

// Mock the lazy-loaded calculator components
vi.mock('@/components/ExaltationForgeSimulator', () => ({
  ExaltationForgeSimulator: () => <div data-testid="forge-simulator">ForgeSimulator</div>,
}));
vi.mock('@/components/ExaltationForgeSimulator/exaltation-transfer-simulator', () => ({
  TransferCalculator: () => <div data-testid="transfer-calc">TransferCalc</div>,
}));
vi.mock('@/components/ExaltationForgeSimulator/exaltation-convergence-fusion-simulator', () => ({
  ConvergenceFusionCalculator: () => <div data-testid="conv-fusion-calc">ConvFusionCalc</div>,
}));
vi.mock('@/components/ExaltationForgeSimulator/exaltation-convergence-transfer-simulator', () => ({
  ConvergenceTransferCalculator: () => <div data-testid="conv-transfer-calc">ConvTransferCalc</div>,
}));

describe('ExaltationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and description', async () => {
    const ExaltationPage = (await import('../index')).default;
    render(
      <MemoryRouter>
        <ExaltationPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Exaltation Forge')).toBeDefined();
    expect(screen.getByText('Plan your upgrades')).toBeDefined();
  });

  it('renders all 4 tab triggers', async () => {
    const ExaltationPage = (await import('../index')).default;
    render(
      <MemoryRouter>
        <ExaltationPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Fusion')).toBeDefined();
    expect(screen.getByText('Conv. Fusion')).toBeDefined();
    expect(screen.getByText('Transfer')).toBeDefined();
    expect(screen.getByText('Conv. Transfer')).toBeDefined();
  });

  it('renders the fusion tab by default with lazy component', async () => {
    const ExaltationPage = (await import('../index')).default;
    render(
      <MemoryRouter>
        <ExaltationPage />
      </MemoryRouter>,
    );
    const sim = await screen.findByTestId('forge-simulator');
    expect(sim).toBeDefined();
  });
});
