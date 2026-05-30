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

function mapProjectDoc(id: string, data: Record<string, unknown>): TierProject {
  return {
    id,
    name: data.name as string,
    targetTier: data.targetTier as number,
    currentTier: data.currentTier as number,
    isPublic: data.isPublic as boolean,
    ownerUid: data.ownerUid as string,
    ownerDisplayName: data.ownerDisplayName as string,
    totalSpentGp: (data.totalSpentGp as number) ?? 0,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

function mapEntryDoc(id: string, data: Record<string, unknown>): TierProjectEntry {
  const items = data.items as Array<Record<string, unknown>> | undefined;
  return {
    id,
    projectId: data.projectId as string,
    fromTier: data.fromTier as number,
    toTier: data.toTier as number,
    items: items
      ? items.map((i) => ({ name: i.name as string, costGp: i.costGp as number }))
      : [{ name: (data.itemsUsed as string) || '', costGp: (data.costGp as number) || 0 }],
    notes: data.notes as string,
    method: data.method as string | undefined,
    classification: data.classification as number | undefined,
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
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
  return snapshot.docs.map((d) => mapProjectDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getPublicProjects(): Promise<TierProject[]> {
  const q = query(
    collection(FirebaseDB, 'tierProjects'),
    where('isPublic', '==', true),
    orderBy('updatedAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapProjectDoc(d.id, d.data() as Record<string, unknown>));
}

export async function updateProject(
  projectId: string,
  data: Partial<{ name: string; targetTier: number; isPublic: boolean; currentTier: number }>,
) {
  await updateDoc(doc(FirebaseDB, 'tierProjects', projectId), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProject(projectId: string) {
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
    items: Array<{ name: string; costGp: number }>;
    notes: string;
    method?: string;
    classification?: number;
  },
): Promise<string> {
  const docRef = await addDoc(
    collection(FirebaseDB, 'tierProjects', projectId, 'entries'),
    {
      ...data,
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
