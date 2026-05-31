import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavBar } from '../nav-bar';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'nav.title': 'Tibia Tools',
        'nav.links.realMoney': 'Real Money',
        'nav.links.coinsToMoney': 'Coins to Money',
        'nav.links.imbuings': 'Imbuings',
        'nav.links.huntingSpots': 'Hunting Spots',
        'nav.links.exaltationForge': 'Exaltation Forge',
        'nav.links.tierProjects': 'Tier Projects',
        'nav.links.community': 'Community',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@/i18n', () => ({
  default: { language: 'en' },
}));

vi.mock('../mode-toggle', () => ({
  ModeToggle: () => <button aria-label="Toggle theme">Toggle</button>,
}));

vi.mock('../repository-button', () => ({
  RepositoryButton: () => <button aria-label="Go to GitHub Repository">Repo</button>,
}));

vi.mock('../auth-button', () => ({
  AuthButton: () => <button aria-label="Go to Account">Auth</button>,
}));

vi.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <select aria-label="Language"><option>EN</option></select>,
}));

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand name', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByText('Tibia Tools')).toBeInTheDocument();
  });

  it('renders desktop nav links with titles', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByTitle('Real Money')).toBeInTheDocument();
    expect(screen.getByTitle('Community')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Navigation menu')).toBeInTheDocument();
  });

  it('renders utility buttons', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to Account')).toBeInTheDocument();
  });
});
