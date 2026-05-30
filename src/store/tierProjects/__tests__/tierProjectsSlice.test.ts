import { describe, it, expect } from 'vitest';
import { tierProjectsSlice, setProjectsLoading, setProjects, addProject, updateProject, removeProject, setSelectedProjectId, setEntries, addEntry, removeEntry, setError } from '../tierProjectsSlice';
import type { TierProject, TierProjectEntry } from '@/types/tierProject';

const { reducer, getInitialState } = tierProjectsSlice;

function initial() {
  return getInitialState();
}

const mockProject = (overrides: Partial<TierProject> = {}): TierProject => ({
  id: 'p1',
  name: 'Test',
  targetTier: 5,
  currentTier: 1,
  totalSpentGp: 0,
  isPublic: false,
  ownerUid: 'u1',
  ownerDisplayName: 'User',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  ...overrides,
});

const mockEntry = (overrides: Partial<TierProjectEntry> = {}): TierProjectEntry => ({
  id: 'e1',
  projectId: 'p1',
  fromTier: 0,
  toTier: 1,
  items: [{ name: '2 items', costGp: 50000 }],
  notes: '',
  dust: 100,
  createdAt: new Date('2025-01-01'),
  ...overrides,
});

describe('tierProjectsSlice', () => {
  describe('setProjectsLoading', () => {
    it('sets loading true', () => {
      const state = reducer(initial(), setProjectsLoading(true));
      expect(state.projectsLoading).toBe(true);
    });

    it('sets loading false', () => {
      const state = reducer({ ...initial(), projectsLoading: true }, setProjectsLoading(false));
      expect(state.projectsLoading).toBe(false);
    });
  });

  describe('setProjects', () => {
    it('replaces projects and clears loading/error', () => {
      const projects = [mockProject()];
      const state = reducer({ ...initial(), projectsLoading: true, error: 'old error' }, setProjects(projects));
      expect(state.projects).toEqual(projects);
      expect(state.projectsLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('addProject', () => {
    it('prepends project', () => {
      const p1 = mockProject({ id: 'p1' });
      const p2 = mockProject({ id: 'p2' });
      const state = reducer({ ...initial(), projects: [p1] }, addProject(p2));
      expect(state.projects).toHaveLength(2);
      expect(state.projects[0].id).toBe('p2');
    });
  });

  describe('updateProject', () => {
    it('updates existing project', () => {
      const state = reducer(
        { ...initial(), projects: [mockProject({ id: 'p1', name: 'Old' })] },
        updateProject({ id: 'p1', changes: { name: 'New', currentTier: 3 } }),
      );
      expect(state.projects[0].name).toBe('New');
      expect(state.projects[0].currentTier).toBe(3);
    });

    it('does nothing if id not found', () => {
      const state = reducer(
        { ...initial(), projects: [mockProject({ id: 'p1' })] },
        updateProject({ id: 'p2', changes: { name: 'New' } }),
      );
      expect(state.projects).toHaveLength(1);
      expect(state.projects[0].name).toBe('Test');
    });
  });

  describe('removeProject', () => {
    it('removes project and clears selection if selected', () => {
      const state = reducer(
        { ...initial(), projects: [mockProject({ id: 'p1' }), mockProject({ id: 'p2' })], selectedProjectId: 'p1', entries: { p1: [mockEntry()] } },
        removeProject('p1'),
      );
      expect(state.projects).toHaveLength(1);
      expect(state.projects[0].id).toBe('p2');
      expect(state.selectedProjectId).toBeNull();
      expect(state.entries.p1).toBeUndefined();
    });

    it('keeps selection if different project removed', () => {
      const state = reducer(
        { ...initial(), projects: [mockProject({ id: 'p1' }), mockProject({ id: 'p2' })], selectedProjectId: 'p2' },
        removeProject('p1'),
      );
      expect(state.selectedProjectId).toBe('p2');
    });
  });

  describe('setSelectedProjectId', () => {
    it('sets selected id', () => {
      const state = reducer(initial(), setSelectedProjectId('p1'));
      expect(state.selectedProjectId).toBe('p1');
    });

    it('clears selected id', () => {
      const state = reducer({ ...initial(), selectedProjectId: 'p1' }, setSelectedProjectId(null));
      expect(state.selectedProjectId).toBeNull();
    });
  });

  describe('entries', () => {
    it('setEntries stores entries for project', () => {
      const entries = [mockEntry()];
      const state = reducer({ ...initial(), entriesLoading: true }, setEntries({ projectId: 'p1', entries }));
      expect(state.entries.p1).toEqual(entries);
      expect(state.entriesLoading).toBe(false);
    });

    it('addEntry appends to existing list', () => {
      const e1 = mockEntry({ id: 'e1' });
      const e2 = mockEntry({ id: 'e2' });
      const state = reducer(
        { ...initial(), entries: { p1: [e1] } },
        addEntry({ projectId: 'p1', entry: e2 }),
      );
      expect(state.entries.p1).toHaveLength(2);
      expect(state.entries.p1[1].id).toBe('e2');
    });

    it('addEntry creates new list if none exists', () => {
      const e1 = mockEntry();
      const state = reducer(initial(), addEntry({ projectId: 'p1', entry: e1 }));
      expect(state.entries.p1).toHaveLength(1);
    });

    it('addEntry preserves dust field', () => {
      const state = reducer(initial(), addEntry({
        projectId: 'p1',
        entry: mockEntry({ id: 'e1', dust: 250 }),
      }));
      expect(state.entries.p1![0].dust).toBe(250);
    });

    it('removeEntry filters entry from list', () => {
      const e1 = mockEntry({ id: 'e1' });
      const e2 = mockEntry({ id: 'e2' });
      const state = reducer(
        { ...initial(), entries: { p1: [e1, e2] } },
        removeEntry({ projectId: 'p1', entryId: 'e1' }),
      );
      expect(state.entries.p1).toHaveLength(1);
      expect(state.entries.p1[0].id).toBe('e2');
    });

    it('removeEntry does nothing if project not found', () => {
      const state = reducer(initial(), removeEntry({ projectId: 'p1', entryId: 'e1' }));
      expect(state.entries.p1).toBeUndefined();
    });
  });

  describe('setError', () => {
    it('sets error', () => {
      const state = reducer(initial(), setError('Something went wrong'));
      expect(state.error).toBe('Something went wrong');
    });

    it('clears error', () => {
      const state = reducer({ ...initial(), error: 'old' }, setError(null));
      expect(state.error).toBeNull();
    });
  });
});
