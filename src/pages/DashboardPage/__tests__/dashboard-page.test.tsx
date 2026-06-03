import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import DashboardPage from '@/pages/DashboardPage';

vi.mock('@/firebase/tierProjects', () => ({
  getUserProjects: vi.fn().mockResolvedValue([]),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}));

vi.mock('@/components/Dashboard/hunting-spots-widget', () => ({
  HuntingSpotsWidget: () => <div data-testid='hunting-spots-widget' />,
}));
vi.mock('@/components/Dashboard/gangrena-banner', () => ({
  GangrenaBanner: () => <div data-testid='gangrena-banner' />,
}));
vi.mock('@/components/Dashboard/tier-projects-widget', () => ({
  TierProjectsWidget: () => <div data-testid='tier-projects-widget' />,
}));
vi.mock('@/components/Dashboard/quick-tools-widget', () => ({
  QuickToolsWidget: () => <div data-testid='quick-tools-widget' />,
}));
vi.mock('@/components/Dashboard/recent-sessions-widget', () => ({
  RecentSessionsWidget: () => <div data-testid='recent-sessions-widget' />,
}));

const store = configureStore({ reducer: (s = {}) => s });
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('DashboardPage', () => {
  it('renders all widgets', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>,
    );
    expect(screen.getByTestId('hunting-spots-widget')).toBeDefined();
    expect(screen.getByTestId('gangrena-banner')).toBeDefined();
    expect(screen.getByTestId('tier-projects-widget')).toBeDefined();
    expect(screen.getByTestId('quick-tools-widget')).toBeDefined();
    expect(screen.getByTestId('recent-sessions-widget')).toBeDefined();
  });
});
