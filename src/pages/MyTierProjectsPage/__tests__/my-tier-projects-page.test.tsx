import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MyTierProjectsPage from '@/pages/MyTierProjectsPage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'test-uid' }, isAuthenticated: true }),
}));

vi.mock('@/firebase/tierProjects', () => ({
  addTierProject: vi.fn(),
  updateTierProject: vi.fn(),
  deleteTierProject: vi.fn(),
  addTierEntry: vi.fn(),
  updateTierEntry: vi.fn(),
  deleteTierEntry: vi.fn(),
  getUserTierProjectsWithEntries: vi.fn().mockResolvedValue([]),
  getUserProjects: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/monitoring', () => ({
  captureError: vi.fn(),
  captureEvent: vi.fn(),
}));

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogAction: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { combineReducers } from 'redux';

function tierProjectsReducer(state = { projects: [], status: 'idle', entries: [] }) {
  return state;
}

const rootReducer = combineReducers({ tierProjects: tierProjectsReducer });

const store = configureStore({
  reducer: rootReducer,
});

describe('MyTierProjectsPage', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MyTierProjectsPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('myTierProjects.addProject')).toBeDefined();
  });
});
