import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { tierProjectsSlice } from '@/store/tierProjects';
import PublicTierProjectsPage from '../index';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'publicTierProjects.title': 'Public Projects',
        'publicTierProjects.description': 'Browse tier projects shared by the community.',
        'publicTierProjects.loading': 'Loading projects...',
        'publicTierProjects.empty': 'No public projects yet.',
        'publicTierProjects.target': 'Target',
        'publicTierProjects.current': 'Current',
        'publicTierProjects.by': 'By',
      };
      return map[key] ?? key;
    },
  }),
}));

const { mockGetPublicProjects } = vi.hoisted(() => ({
  mockGetPublicProjects: vi.fn(),
}));

vi.mock('@/firebase/tierProjects', () => ({
  getPublicProjects: mockGetPublicProjects,
}));

function createStore() {
  return configureStore({
    reducer: { tierProjects: tierProjectsSlice.reducer },
  });
}

describe('PublicTierProjectsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when projectsLoading is true', () => {
    mockGetPublicProjects.mockReturnValue(new Promise(() => {}));
    const store = createStore();
    render(<Provider store={store}><MemoryRouter><PublicTierProjectsPage /></MemoryRouter></Provider>);
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('shows empty state when no projects', async () => {
    mockGetPublicProjects.mockResolvedValue([]);
    const store = createStore();
    render(<Provider store={store}><MemoryRouter><PublicTierProjectsPage /></MemoryRouter></Provider>);
    expect(await screen.findByText('No public projects yet.')).toBeInTheDocument();
  });

  it('renders list of public projects', async () => {
    mockGetPublicProjects.mockResolvedValue([
      {
        id: 'p1',
        name: 'Test Project',
        targetTier: 10,
        currentTier: 3,
        isPublic: true,
        ownerUid: 'u1',
        ownerDisplayName: 'TestUser',
        createdAt: new Date('2025-01-01').getTime(),
        updatedAt: new Date('2025-01-01').getTime(),
      },
    ]);
    const store = createStore();
    render(<Provider store={store}><MemoryRouter><PublicTierProjectsPage /></MemoryRouter></Provider>);
    expect(await screen.findByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText(/Target/)).toBeInTheDocument();
    expect(screen.getByText(/By TestUser/)).toBeInTheDocument();
  });
});
