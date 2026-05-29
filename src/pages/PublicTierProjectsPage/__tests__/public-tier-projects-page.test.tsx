import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PublicTierProjectsPage from '../index';

const { mockGetPublicProjects } = vi.hoisted(() => ({
  mockGetPublicProjects: vi.fn(),
}));

vi.mock('@/firebase/tierProjects', () => ({
  getPublicProjects: mockGetPublicProjects,
}));

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

describe('PublicTierProjectsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockGetPublicProjects.mockReturnValue(new Promise(() => {}));
    render(<PublicTierProjectsPage />);
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('shows empty state when no projects', async () => {
    mockGetPublicProjects.mockResolvedValue([]);
    render(<PublicTierProjectsPage />);
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
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
    ]);
    render(<PublicTierProjectsPage />);

    expect(await screen.findByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText(/Target/)).toBeInTheDocument();
    expect(screen.getByText(/By TestUser/)).toBeInTheDocument();
  });
});
