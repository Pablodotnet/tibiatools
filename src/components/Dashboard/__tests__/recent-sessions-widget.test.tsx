import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

function renderWidget(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

const mockGetRecentSessions = vi.fn();

vi.mock('@/firebase/huntSessions', () => ({
  getRecentSessions: mockGetRecentSessions,
}));

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
    vi.clearAllMocks();
  });

  it('shows loading skeletons initially', async () => {
    mockGetRecentSessions.mockReturnValue(new Promise(() => void 0));
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    expect(screen.getByText('Recent Sessions')).toBeDefined();
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('shows empty state when no sessions', async () => {
    mockGetRecentSessions.mockResolvedValue([]);
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    const empty = await screen.findByText('No sessions yet.');
    expect(empty).toBeDefined();
  });

  it('renders sessions when data arrives', async () => {
    mockGetRecentSessions.mockResolvedValue([
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
    ]);
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    const spotName = await screen.findByText('Lava Lurkers');
    expect(spotName).toBeDefined();
    expect(screen.getByText(/Elder Druid/)).toBeDefined();
    expect(screen.getByText(/50,000 gp/)).toBeDefined();
  });

  it('shows view all spots link', async () => {
    mockGetRecentSessions.mockResolvedValue([]);
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    const link = await screen.findByText('View all spots');
    expect(link).toBeDefined();
  });

  it('handles errors gracefully', async () => {
    mockGetRecentSessions.mockRejectedValue(new Error('fail'));
    const { RecentSessionsWidget } = await import('../recent-sessions-widget');
    renderWidget(<RecentSessionsWidget />);
    const empty = await screen.findByText('No sessions yet.');
    expect(empty).toBeDefined();
  });
});
