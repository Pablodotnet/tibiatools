import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MySessionsPage from '../index';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'mySessions.title': 'My Sessions',
        'mySessions.description': 'View all your hunt sessions across every spot.',
        'mySessions.filters': 'Filters',
        'mySessions.spotFilter': 'Spot',
        'mySessions.spotFilterPlaceholder': 'Filter by spot name...',
        'mySessions.dateFrom': 'From',
        'mySessions.dateTo': 'To',
        'mySessions.empty': 'No sessions yet.',
        'mySessions.xpPerHourChart': 'XP/h per Session',
        'mySessions.profitChart': 'Profit per Session',
        'mySessions.lootSuppliesChart': 'Loot vs Supplies',
        'mySessions.noData': 'No data available',
        'auth.loginRequired': 'Please log in to view your sessions.',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@/firebase/huntSessions', () => ({
  getAllUserSessions: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
  }),
}));

vi.mock('@/lib/monitoring', () => ({
  captureError: vi.fn(),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

describe('MySessionsPage', () => {
  it('shows login required when not authenticated', () => {
    render(
      <MemoryRouter>
        <MySessionsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Please log in to view your sessions.')).toBeInTheDocument();
  });
});
