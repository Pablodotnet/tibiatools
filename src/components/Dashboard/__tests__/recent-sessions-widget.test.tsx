import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockData = vi.hoisted(() => ({ data: undefined as unknown, isLoading: true, isError: false }));

vi.mock('@/hooks/queries/useHuntSessions', () => ({
  useRecentSessions: () => ({ ...mockData, refetch: vi.fn() }),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderWidget(node: React.ReactNode) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{node}</MemoryRouter>
    </QueryClientProvider>,
  );
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'dashboard.recentSessionsTitle': 'Recent Sessions',
        'dashboard.noRecentSessions': 'No sessions yet.',
        'dashboard.level': 'Level',
        'dashboard.viewAllSpots': 'View all spots',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('RecentSessionsWidget', () => {
  beforeEach(() => {
    mockData.data = undefined;
    mockData.isLoading = true;
    mockData.isError = false;
  });

  it('shows loading skeletons initially', async () => {
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    expect(screen.getByText('Recent Sessions')).toBeDefined();
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('shows empty state when no sessions', async () => {
    mockData.data = [];
    mockData.isLoading = false;
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    await screen.findByText('No sessions yet.');
  });

  it('renders sessions when data arrives', async () => {
    mockData.data = [
      {
        id: 's1',
        spotName: 'Lava Lurkers',
        vocation: 'Elder Druid',
        level: 250,
        balance: 50000,
        xpPerHour: 1200000,
        ownerUid: 'u1',
        ownerDisplayName: 'Player1',
        spotId: 'spot1',
        sessionDate: '2025-01-01',
        durationMinutes: 60,
        isParty: false,
        damage: null,
        healing: null,
        damageReceived: null,
        loot: null,
        supplies: null,
        xpGain: null,
        rawXpPerHour: null,
        players: null,
        killedMonsters: null,
        lootItems: null,
        supplyItems: null,
        rawText: '',
      },
    ];
    mockData.isLoading = false;
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    await screen.findByText('Lava Lurkers');
    expect(screen.getByText(/Elder Druid/)).toBeDefined();
    expect(screen.getByText(/50,000 gp/)).toBeDefined();
  });

  it('shows view all spots link', async () => {
    mockData.data = [];
    mockData.isLoading = false;
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    await screen.findByText('View all spots');
  });

  it('handles errors gracefully', async () => {
    mockData.data = undefined;
    mockData.isLoading = false;
    mockData.isError = true;
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    await screen.findByText('No sessions yet.');
  });
});
