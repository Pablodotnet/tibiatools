import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VocationHuntSpotsPage from '../index';
const mockHuntingSpot = vi.hoisted(() => ({
  id: 'carlin-cults',
  name: 'Carlin Cults',
  levelRange: [50, 130] as [number, number],
  location: 'Carlin',
  expRaw: 350000,
  expBonus: 500000,
  profit: 50000,
  supplyCost: 20000,
  set: 'Set test',
  imbuements: ['Void'],
  notes: '',
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'huntingSpotsPage.title': 'Hunting Spots for',
        'huntingSpotsPage.comingSoon': 'Data coming soon for',
        'huntingSpotsPage.expRaw': 'Raw exp',
        'huntingSpotsPage.expBonus': 'With bonus',
        'huntingSpotsPage.profit': 'Profit',
        'huntingSpotsPage.set': 'Set',
        'huntingSpotsPage.imbuements': 'Imbuements',
        'huntingSpotsPage.level': 'Level',
        'huntingSpotsPage.location': 'Location',
        'huntingSpotsPage.showCalc': 'Show calculator',
        'huntingSpotsPage.hideCalc': 'Hide calculator',
        'huntingSpotsPage.loading': 'Loading spots...',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@/firebase/huntingSpots', () => ({
  getAllHuntingSpots: vi.fn().mockResolvedValue([]),
  deleteHuntingSpot: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', email: 'test@test.com' },
    isAuthenticated: true,
  }),
}));

vi.mock('@/helpers/huntingSpots', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/helpers/huntingSpots')>();
  return {
    ...actual,
    huntingSpotsByVocation: {
      knight: [mockHuntingSpot],
    },
  };
});

function renderAtRoute(vocationId: string) {
  const store = configureStore({
    reducer: {
      auth: () => ({ user: null, loading: false }),
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/hunting-spots/${vocationId}`]}>
        <Routes>
          <Route path="/hunting-spots/:vocationId" element={<VocationHuntSpotsPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('VocationHuntSpotsPage', () => {
  it('renders hunting spots for a known vocation', async () => {
    renderAtRoute('knight');
    expect(screen.getByRole('heading', { level: 1, name: /Hunting Spots for/ })).toBeInTheDocument();
    await screen.findByText('Carlin Cults');
  });

  it('redirects to not-found for unknown vocation', () => {
    renderAtRoute('unknown');
    expect(screen.queryByText(/Hunting Spots for/)).not.toBeInTheDocument();
  });
});
