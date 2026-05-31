import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ExaltationForgeSimulator } from '../exaltation-forge-simulator';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'exaltationForge.howToUse': 'How to use this tool?',
        'exaltationForge.howToUseDesc': 'Use this tool to estimate the cost.',
        'exaltationForge.fusionHelp1': 'Fill in the information:',
        'exaltationForge.fusionHelp1a': 'Desired tier',
        'exaltationForge.fusionHelp1b': 'Item classification (1-4)',
        'exaltationForge.fusionHelp1c': 'Value of the item (gp)',
        'exaltationForge.fusionHelp1d': 'Value of the Exalted Core (gp)',
        'exaltationForge.fusionHelp1e': 'Value of one Tibia Coin (gp)',
        'exaltationForge.fusionHelp1f': 'Price of 250 Tibia Coins (MXN)',
        'exaltationForge.fusionHelp2': 'In the tier table, choose which fusions use Exalted Cores.',
        'exaltationForge.fusionHelp3': 'Click Calculate to run simulations.',
        'exaltationForge.desiredTier': 'Desired tier',
        'exaltationForge.itemClassification': 'Item classification',
        'exaltationForge.itemValue': 'Item value (gp)',
        'exaltationForge.exaltedCoreValue': 'Exalted Core value (gp)',
        'exaltationForge.tibiaCoinValue': 'Tibia Coin value (gp)',
        'exaltationForge.priceOf250Tc': 'Price of 250 TC (MXN)',
        'exaltationForge.calculate': 'Calculate',
        'exaltationForge.calculating': 'Calculating...',
        'exaltationForge.tier': 'Tier',
        'exaltationForge.useCore1': 'Use Exalted Core 1',
        'exaltationForge.useCore2': 'Use Exalted Core 2',
        'exaltationForge.forgeGoldClass1': 'Forge gold (Class 1)',
        'exaltationForge.forgeGoldClass2': 'Forge gold (Class 2)',
        'exaltationForge.forgeGoldClass3': 'Forge gold (Class 3)',
        'exaltationForge.forgeGoldClass4': 'Forge gold (Class 4)',
        'exaltationForge.forgeGoldNote': 'Forge gold values follow Tibia Wiki.',
        'exaltationForge.class4ForgeGoldLabel': 'Class 4 forge gold for {{label}}',
        'exaltationForge.importToProject': 'Import to Project',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (s: { tierProjects: { projects: [] } }) => unknown) =>
    selector({ tierProjects: { projects: [] } }),
}));

vi.mock('@/store/tierProjects', () => ({
  startFetchUserProjects: vi.fn(),
  startAddEntry: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

function createStore() {
  return configureStore({
    reducer: {
      tierProjects: () => ({ projects: [], projectsLoading: false, selectedProjectId: null, entries: {}, entriesLoading: false }),
    },
  });
}

describe('ExaltationForgeSimulator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders how-to-use heading', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <ExaltationForgeSimulator />
      </Provider>,
    );
    expect(screen.getByText((content) => content.includes('How to use this tool?'))).toBeInTheDocument();
  });

  it('renders how-to-use description', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <ExaltationForgeSimulator />
      </Provider>,
    );
    expect(screen.getByText('Use this tool to estimate the cost.')).toBeInTheDocument();
  });

  it('renders form input labels', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <ExaltationForgeSimulator />
      </Provider>,
    );
    const allDesiredTier = screen.getAllByText('Desired tier');
    expect(allDesiredTier.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Item value (gp)')).toBeInTheDocument();
    expect(screen.getByText('Exalted Core value (gp)')).toBeInTheDocument();
    expect(screen.getByText('Tibia Coin value (gp)')).toBeInTheDocument();
    expect(screen.getByText('Price of 250 TC (MXN)')).toBeInTheDocument();
  });

  it('renders the forge gold table headers', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <ExaltationForgeSimulator />
      </Provider>,
    );
    expect(screen.getByText('Forge gold (Class 1)')).toBeInTheDocument();
    expect(screen.getByText('Forge gold (Class 2)')).toBeInTheDocument();
    expect(screen.getByText('Forge gold (Class 3)')).toBeInTheDocument();
    expect(screen.getByText('Forge gold (Class 4)')).toBeInTheDocument();
  });

  it('renders Calculate button', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <ExaltationForgeSimulator />
      </Provider>,
    );
    expect(screen.getByText('Calculate')).toBeInTheDocument();
  });

  it('shows forge gold note', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <ExaltationForgeSimulator />
      </Provider>,
    );
    expect(screen.getByText('Forge gold values follow Tibia Wiki.')).toBeInTheDocument();
  });
});
