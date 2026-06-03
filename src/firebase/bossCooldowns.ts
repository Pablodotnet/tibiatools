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
  writeBatch,
} from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from './config';
import { safeStr, toMs } from '@/lib/firestore-helpers';

export interface BossCooldownDoc {
  id: string;
  ownerUid: string;
  bossKey: string;
  killedAtMs: number;
}

function mapDoc(id: string, data: Record<string, unknown>): BossCooldownDoc {
  return {
    id,
    ownerUid: safeStr(data.ownerUid),
    bossKey: safeStr(data.bossKey),
    killedAtMs: toMs(data.killedAt),
  };
}

export async function getUserBossCooldowns(): Promise<BossCooldownDoc[]> {
  const user = FirebaseAuth.currentUser;
  if (!user) return [];

  const q = query(
    collection(FirebaseDB, 'bossCooldowns'),
    where('ownerUid', '==', user.uid),
    orderBy('killedAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
}

export async function markBossKilled(bossKey: string): Promise<void> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  await addDoc(collection(FirebaseDB, 'bossCooldowns'), {
    ownerUid: user.uid,
    bossKey,
    killedAt: Timestamp.now(),
  });
}

export async function clearBossCooldown(docId: string): Promise<void> {
  await deleteDoc(doc(FirebaseDB, 'bossCooldowns', docId));
}

export async function clearAllBossCooldowns(): Promise<void> {
  const user = FirebaseAuth.currentUser;
  if (!user) return;

  const q = query(
    collection(FirebaseDB, 'bossCooldowns'),
    where('ownerUid', '==', user.uid),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  const batch = writeBatch(FirebaseDB);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
