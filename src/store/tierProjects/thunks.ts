import { AppDispatch } from '@/store';
import {
  setProjectsLoading, setProjects, addProject, updateProject, removeProject,
  setSelectedProjectId, setEntriesLoading, setEntries, addEntry, removeEntry,
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

export const startAddEntry = (projectId: string, data: { fromTier: number; toTier: number; items: Array<{ name: string; costGp: number }>; notes: string; method?: string; classification?: number }) => async (dispatch: AppDispatch): Promise<ThunkResult> => {
  try {
    const entryId = await api.addEntry(projectId, data);
    dispatch(addEntry({
      projectId,
      entry: { id: entryId, projectId, ...data, createdAt: new Date() },
    }));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const startDeleteEntry = (projectId: string, entryId: string) => async (dispatch: AppDispatch): Promise<ThunkResult> => {
  try {
    await api.deleteEntry(projectId, entryId);
    dispatch(removeEntry({ projectId, entryId }));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};
