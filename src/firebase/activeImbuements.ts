import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from './config';
import { safeStr, toMs } from '@/lib/firestore-helpers';

export interface ActiveImbuementDoc {
  id: string;
  ownerUid: string;
  slot: string;
  tier: string;
  appliedAtMs: number;
  durationHours: number;
  note?: string;
}

function mapDoc(id: string, data: Record<string, unknown>): ActiveImbuementDoc {
  return {
    id,
    ownerUid: safeStr(data.ownerUid),
    slot: safeStr(data.slot),
    tier: safeStr(data.tier),
    appliedAtMs: toMs(data.appliedAt),
    durationHours: typeof data.durationHours === 'number' ? data.durationHours : 20,
    note: typeof data.note === 'string' ? data.note : undefined,
  };
}

export async function getUserImbuements(): Promise<ActiveImbuementDoc[]> {
  const user = FirebaseAuth.currentUser;
  if (!user) return [];

  const q = query(
    collection(FirebaseDB, 'activeImbuements'),
    where('ownerUid', '==', user.uid),
    orderBy('appliedAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
}

export async function addImbuement(data: {
  slot: string;
  tier: string;
  durationHours: number;
  note?: string;
}): Promise<string> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const docRef = await addDoc(collection(FirebaseDB, 'activeImbuements'), {
    ownerUid: user.uid,
    slot: data.slot,
    tier: data.tier,
    durationHours: data.durationHours,
    appliedAt: Timestamp.now(),
    note: data.note || '',
  });
  return docRef.id;
}

export async function removeImbuement(docId: string): Promise<void> {
  await deleteDoc(doc(FirebaseDB, 'activeImbuements', docId));
}
