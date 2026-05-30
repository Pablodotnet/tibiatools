import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TierProject, TierProjectEntry } from '@/types/tierProject';

interface TierProjectsState {
  projects: TierProject[];
  selectedProjectId: string | null;
  entries: Record<string, TierProjectEntry[]>;
  projectsLoading: boolean;
  entriesLoading: boolean;
  error: string | null;
}

const initialState: TierProjectsState = {
  projects: [],
  selectedProjectId: null,
  entries: {},
  projectsLoading: false,
  entriesLoading: false,
  error: null,
};

export const tierProjectsSlice = createSlice({
  name: 'tierProjects',
  initialState,
  reducers: {
    setProjectsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.projectsLoading = payload;
    },
    setProjects: (state, { payload }: PayloadAction<TierProject[]>) => {
      state.projects = payload;
      state.projectsLoading = false;
      state.error = null;
    },
    addProject: (state, { payload }: PayloadAction<TierProject>) => {
      state.projects.unshift(payload);
    },
    updateProject: (state, { payload }: PayloadAction<{ id: string; changes: Partial<TierProject> }>) => {
      const idx = state.projects.findIndex((p) => p.id === payload.id);
      if (idx !== -1) {
        state.projects[idx] = { ...state.projects[idx], ...payload.changes };
      }
    },
    removeProject: (state, { payload }: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== payload);
      if (state.selectedProjectId === payload) {
        state.selectedProjectId = null;
        delete state.entries[payload];
      }
    },
    setSelectedProjectId: (state, { payload }: PayloadAction<string | null>) => {
      state.selectedProjectId = payload;
    },
    setEntriesLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.entriesLoading = payload;
    },
    setEntries: (state, { payload }: PayloadAction<{ projectId: string; entries: TierProjectEntry[] }>) => {
      state.entries[payload.projectId] = payload.entries;
      state.entriesLoading = false;
    },
    addEntry: (state, { payload }: PayloadAction<{ projectId: string; entry: TierProjectEntry }>) => {
      const existing = state.entries[payload.projectId];
      if (existing) {
        existing.push(payload.entry);
      } else {
        state.entries[payload.projectId] = [payload.entry];
      }
    },
    updateEntryInStore: (state, { payload }: PayloadAction<{ projectId: string; entryId: string; changes: Partial<TierProjectEntry> }>) => {
      const projectEntries = state.entries[payload.projectId];
      if (projectEntries) {
        const idx = projectEntries.findIndex((e) => e.id === payload.entryId);
        if (idx !== -1) {
          projectEntries[idx] = { ...projectEntries[idx], ...payload.changes };
        }
      }
    },
    removeEntry: (state, { payload }: PayloadAction<{ projectId: string; entryId: string }>) => {
      const existing = state.entries[payload.projectId];
      if (existing) {
        state.entries[payload.projectId] = existing.filter((e) => e.id !== payload.entryId);
      }
    },
    setError: (state, { payload }: PayloadAction<string | null>) => {
      state.error = payload;
    },
  },
});

export const {
  setProjectsLoading,
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setSelectedProjectId,
  setEntriesLoading,
  setEntries,
  addEntry,
  updateEntryInStore,
  removeEntry,
  setError,
} = tierProjectsSlice.actions;
