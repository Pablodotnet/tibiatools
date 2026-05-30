import { AppDispatch, RootState } from '@/store';
import {
  setProjectsLoading, setProjects, addProject, updateProject, removeProject,
  setSelectedProjectId, setEntriesLoading, setEntries, addEntry, updateEntryInStore, removeEntry,
} from './tierProjectsSlice';
import * as api from '@/firebase/tierProjects';
import type { TierProject } from '@/types/tierProject';

type ThunkResult = { ok: true } | { ok: false; error: string };

export const startFetchUserProjects = () => async (dispatch: AppDispatch) => {
  dispatch(setProjectsLoading(true));
  try {
    const projects = await api.getUserProjects();
    dispatch(setProjects(projects));
  } catch (e) {
    dispatch(setProjectsLoading(false));
    throw e;
  }
};

export const startFetchPublicProjects = () => async (dispatch: AppDispatch) => {
  dispatch(setProjectsLoading(true));
  try {
    const projects = await api.getPublicProjects();
    dispatch(setProjects(projects));
  } catch (e) {
    dispatch(setProjectsLoading(false));
    throw e;
  }
};

export const startCreateProject = (data: { name: string; targetTier: number; isPublic: boolean }) => async (dispatch: AppDispatch): Promise<ThunkResult> => {
  try {
    const id = await api.createProject(data);
    const newProject: TierProject = {
      id,
      name: data.name,
      targetTier: data.targetTier,
      currentTier: 0,
      totalSpentGp: 0,
      isPublic: data.isPublic,
      ownerUid: '',
      ownerDisplayName: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch(addProject(newProject));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const startToggleVisibility = (projectId: string, isPublic: boolean) => async (dispatch: AppDispatch): Promise<ThunkResult> => {
  try {
    await api.updateProject(projectId, { isPublic });
    dispatch(updateProject({ id: projectId, changes: { isPublic } }));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const startDeleteProject = (projectId: string) => async (dispatch: AppDispatch): Promise<ThunkResult> => {
  try {
    await api.deleteProject(projectId);
    dispatch(removeProject(projectId));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const startDuplicateProject = (projectId: string, newName: string) => async (dispatch: AppDispatch): Promise<ThunkResult> => {
  try {
    const { project } = await api.duplicateProject(projectId, newName);
    dispatch(addProject(project));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const startSelectProject = (projectId: string | null) => (dispatch: AppDispatch) => {
  dispatch(setSelectedProjectId(projectId));
};

export const startFetchEntries = (projectId: string) => async (dispatch: AppDispatch) => {
  dispatch(setEntriesLoading(true));
  try {
    const data = await api.getProjectEntries(projectId);
    dispatch(setEntries({ projectId, entries: data }));
  } catch (e) {
    dispatch(setEntriesLoading(false));
    throw e;
  }
};

export const startAddEntry = (projectId: string, data: { fromTier: number; toTier: number; items: Array<{ name: string; costGp: number; marketPriceGp?: number }>; notes: string; method?: string; classification?: number; exaltedCores?: number; exaltedCorePriceGp?: number }) => async (dispatch: AppDispatch, getState: () => RootState): Promise<ThunkResult> => {
  try {
    const entryId = await api.addEntry(projectId, data);
    const entryTotal = data.items.reduce((sum, i) => sum + i.costGp, 0);
    dispatch(addEntry({
      projectId,
      entry: { id: entryId, projectId, ...data, createdAt: new Date() },
    }));
    const state = getState();
    const project = state.tierProjects.projects.find((p) => p.id === projectId);
    const currentTotal = project?.totalSpentGp ?? 0;
    dispatch(updateProject({ id: projectId, changes: { totalSpentGp: currentTotal + entryTotal } }));
    if (project && data.toTier > project.currentTier) {
      await api.updateProject(projectId, { currentTier: data.toTier });
      dispatch(updateProject({ id: projectId, changes: { currentTier: data.toTier } }));
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const startDeleteEntry = (projectId: string, entryId: string) => async (dispatch: AppDispatch, getState: () => RootState): Promise<ThunkResult> => {
  try {
    await api.deleteEntry(projectId, entryId);
    const state = getState();
    const projectEntries = state.tierProjects.entries[projectId] ?? [];
    const entry = projectEntries.find((e) => e.id === entryId);
    const entryTotal = entry ? entry.items.reduce((sum, i) => sum + i.costGp, 0) : 0;
    dispatch(removeEntry({ projectId, entryId }));
    const project = state.tierProjects.projects.find((p) => p.id === projectId);
    const currentTotal = project?.totalSpentGp ?? 0;
    dispatch(updateProject({ id: projectId, changes: { totalSpentGp: Math.max(0, currentTotal - entryTotal) } }));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const startUpdateEntry = (projectId: string, entryId: string, data: { fromTier?: number; toTier?: number; items?: Array<{ name: string; costGp: number; marketPriceGp?: number }>; notes?: string; method?: string; classification?: number; exaltedCores?: number; exaltedCorePriceGp?: number }) => async (dispatch: AppDispatch, getState: () => RootState): Promise<ThunkResult> => {
  try {
    await api.updateEntry(projectId, entryId, data);
    dispatch(updateEntryInStore({ projectId, entryId, changes: data }));
    const state = getState();
    const projectEntries = state.tierProjects.entries[projectId] ?? [];
    const total = projectEntries.reduce((sum, e) => sum + e.items.reduce((s, i) => s + i.costGp, 0), 0);
    await api.updateProject(projectId, { totalSpentGp: total });
    dispatch(updateProject({ id: projectId, changes: { totalSpentGp: total } }));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};
