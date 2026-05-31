import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VocationHuntSpotsPage from '../index';

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
      };
      return map[key] ?? key;
    },
  }),
}));

function renderAtRoute(vocationId: string) {
  return render(
    <MemoryRouter initialEntries={[`/hunting-spots/${vocationId}`]}>
      <Routes>
        <Route path="/hunting-spots/:vocationId" element={<VocationHuntSpotsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('VocationHuntSpotsPage', () => {
  it('renders hunting spots for a known vocation', () => {
    renderAtRoute('knight');
    expect(screen.getByText(/Hunting Spots for/)).toBeInTheDocument();
    expect(screen.getByText('Carlin Cults')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Level') && content.includes('Carlin'))).toBeInTheDocument();
  });

  it('shows coming soon for unknown vocation', () => {
    renderAtRoute('unknown');
    expect(screen.getByText(/Data coming soon for/)).toBeInTheDocument();
  });
});
