import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from './config';
import type { TierProject, TierProjectEntry } from '@/types/tierProject';

function safeStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function safeNum(v: unknown, fallback = 0): number {
  return typeof v === 'number' ? v : fallback;
}

function optNum(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

function optStr(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function safeBool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function toMs(v: unknown): number {
  if (v && typeof v === 'object' && 'toDate' in v && typeof (v as { toDate: () => Date }).toDate === 'function') return (v as { toDate: () => Date }).toDate().getTime();
  if (typeof v === 'number') return v;
  return Date.now();
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      out[k] = v.map((item) =>
        item && typeof item === 'object' && !Array.isArray(item)
          ? Object.fromEntries(Object.entries(item).filter(([, vi]) => vi !== undefined))
          : item,
      );
    } else {
      out[k] = v;
    }
  }
  return out;
}

function mapProjectDoc(id: string, data: Record<string, unknown>): TierProject {
  return {
    id,
    name: safeStr(data.name),
    targetTier: safeNum(data.targetTier),
    currentTier: safeNum(data.currentTier),
    isPublic: safeBool(data.isPublic),
    ownerUid: safeStr(data.ownerUid),
    ownerDisplayName: safeStr(data.ownerDisplayName),
    totalSpentGp: safeNum(data.totalSpentGp),
    createdAt: toMs(data.createdAt),
    updatedAt: toMs(data.updatedAt),
  };
}

function mapEntryDoc(id: string, data: Record<string, unknown>): TierProjectEntry {
  const rawItems = data.items;
  const items: Array<Record<string, unknown>> = Array.isArray(rawItems) ? rawItems : [];
  return {
    id,
    projectId: safeStr(data.projectId),
    fromTier: safeNum(data.fromTier),
    toTier: safeNum(data.toTier),
    items: items.length > 0
      ? items.map((i) => ({ name: safeStr(i.name), costGp: safeNum(i.costGp), marketPriceGp: optNum(i.marketPriceGp) }))
      : [{ name: safeStr(data.itemsUsed), costGp: safeNum(data.costGp) }],
    notes: safeStr(data.notes),
    method: optStr(data.method),
    classification: optNum(data.classification),
    exaltedCores: optNum(data.exaltedCores),
    exaltedCorePriceGp: optNum(data.exaltedCorePriceGp),
    dust: optNum(data.dust),
    createdAt: toMs(data.createdAt),
  };
}

async function backfillProjectFields(project: TierProject): Promise<void> {
  if (project.totalSpentGp !== 0 && project.currentTier > 0) return;
  try {
    const entries = await getProjectEntries(project.id);
    let needsUpdate = false;
    const updates: Record<string, unknown> = {};

    if (project.totalSpentGp === 0) {
      const total = entries.reduce((sum, e) => sum + e.items.reduce((s, i) => s + i.costGp, 0), 0);
      if (total > 0) {
        project.totalSpentGp = total;
        updates.totalSpentGp = total;
        needsUpdate = true;
      }
    }

    if (project.currentTier === 0) {
      const maxTier = entries.reduce((max, e) => Math.max(max, e.toTier), 0);
      if (maxTier > 0) {
        project.currentTier = maxTier;
        updates.currentTier = maxTier;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      try {
        await updateDoc(doc(FirebaseDB, 'tierProjects', project.id), {
          ...stripUndefined(updates),
          updatedAt: Timestamp.now(),
        });
      } catch {
        // Not the owner — just set fields in memory without persisting
      }
    }
  } catch {
    // Can't read entries — skip backfill (e.g. unauthenticated, no permission)
  }
}

export async function createProject(data: {
  name: string;
  targetTier: number;
  isPublic: boolean;
}) {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const docRef = await addDoc(collection(FirebaseDB, 'tierProjects'), {
    ...data,
    currentTier: 0,
    totalSpentGp: 0,
    ownerUid: user.uid,
    ownerDisplayName: user.displayName || user.email || 'Unknown',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getUserProjects(): Promise<TierProject[]> {
  const user = FirebaseAuth.currentUser;
  if (!user) return [];

  const q = query(
    collection(FirebaseDB, 'tierProjects'),
    where('ownerUid', '==', user.uid),
    orderBy('updatedAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  const projects = snapshot.docs.map((d) => mapProjectDoc(d.id, d.data() as Record<string, unknown>));
  await Promise.all(projects.map(backfillProjectFields));
  return projects;
}

export async function getPublicProjects(): Promise<TierProject[]> {
  const q = query(
    collection(FirebaseDB, 'tierProjects'),
    where('isPublic', '==', true),
    orderBy('updatedAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  const projects = snapshot.docs.map((d) => mapProjectDoc(d.id, d.data() as Record<string, unknown>));
  await Promise.all(projects.map(backfillProjectFields));
  return projects;
}

export async function updateProject(
  projectId: string,
  data: Partial<{ name: string; targetTier: number; isPublic: boolean; currentTier: number; totalSpentGp: number }>,
) {
  await updateDoc(doc(FirebaseDB, 'tierProjects', projectId), {
    ...stripUndefined(data),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProject(projectId: string) {
  const entriesSnap = await getDocs(collection(FirebaseDB, 'tierProjects', projectId, 'entries'));
  await Promise.all(entriesSnap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(FirebaseDB, 'tierProjects', projectId));
}

export async function getProjectEntries(projectId: string): Promise<TierProjectEntry[]> {
  const q = query(
    collection(FirebaseDB, 'tierProjects', projectId, 'entries'),
    orderBy('createdAt', 'asc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapEntryDoc(d.id, d.data() as Record<string, unknown>));
}

export async function addEntry(
  projectId: string,
  data: {
    fromTier: number;
    toTier: number;
    items: Array<{ name: string; costGp: number; marketPriceGp?: number }>;
    notes: string;
    method?: string;
    classification?: number;
    exaltedCores?: number;
    exaltedCorePriceGp?: number;
    dust?: number;
  },
): Promise<string> {
  const docRef = await addDoc(
    collection(FirebaseDB, 'tierProjects', projectId, 'entries'),
    {
      ...stripUndefined(data),
      projectId,
      createdAt: Timestamp.now(),
    },
  );
  const entryTotal = data.items.reduce((sum, i) => sum + i.costGp, 0);
  const projectRef = doc(FirebaseDB, 'tierProjects', projectId);
  await updateDoc(projectRef, {
    totalSpentGp: increment(entryTotal),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateEntry(
  projectId: string,
  entryId: string,
  data: {
    fromTier?: number;
    toTier?: number;
    items?: Array<{ name: string; costGp: number; marketPriceGp?: number }>;
    notes?: string;
    method?: string;
    classification?: number;
    exaltedCores?: number;
    exaltedCorePriceGp?: number;
    dust?: number;
  },
) {
  await updateDoc(doc(FirebaseDB, 'tierProjects', projectId, 'entries', entryId), {
    ...stripUndefined(data),
    projectId,
  });
}

export async function duplicateProject(
  projectId: string,
  newName: string,
): Promise<{ project: TierProject; entryCount: number }> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const srcSnap = await getDoc(doc(FirebaseDB, 'tierProjects', projectId));
  if (!srcSnap.exists()) throw new Error('Source project not found');
  const src = srcSnap.data();

  const entriesSnap = await getDocs(collection(FirebaseDB, 'tierProjects', projectId, 'entries'));
  const entries = entriesSnap.docs.map((d) => d.data());

  const newRef = await addDoc(collection(FirebaseDB, 'tierProjects'), {
    name: newName,
    targetTier: src.targetTier as number,
    isPublic: false,
    currentTier: 0,
    totalSpentGp: 0,
    ownerUid: user.uid,
    ownerDisplayName: user.displayName || user.email || 'Unknown',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  const batch = entries.map((e) =>
    addDoc(collection(FirebaseDB, 'tierProjects', newRef.id, 'entries'), {
      ...e,
      createdAt: Timestamp.now(),
    }),
  );
  await Promise.all(batch);

  return {
    project: {
      id: newRef.id,
      name: newName,
      targetTier: src.targetTier as number,
      currentTier: 0,
      totalSpentGp: 0,
      isPublic: false,
      ownerUid: user.uid,
      ownerDisplayName: user.displayName || user.email || 'Unknown',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    entryCount: entries.length,
  };
}

export async function deleteEntry(projectId: string, entryId: string) {
  const entrySnap = await getDoc(doc(FirebaseDB, 'tierProjects', projectId, 'entries', entryId));
  if (entrySnap.exists()) {
    const entryData = entrySnap.data();
    const items = entryData.items as Array<{ costGp: number }> | undefined;
    const entryTotal = items ? items.reduce((sum, i) => sum + (i.costGp || 0), 0) : 0;
    await updateDoc(doc(FirebaseDB, 'tierProjects', projectId), {
      totalSpentGp: increment(-entryTotal),
      updatedAt: Timestamp.now(),
    });
  }
  await deleteDoc(doc(FirebaseDB, 'tierProjects', projectId, 'entries', entryId));
}
