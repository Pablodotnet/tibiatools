import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from './config';
import { safeStr, safeBool } from '@/lib/firestore-helpers';

export interface BestiaryProgressDoc {
  id: string;
  ownerUid: string;
  monsterKey: string;
  completed: boolean;
}

function mapDoc(id: string, data: Record<string, unknown>): BestiaryProgressDoc {
  return {
    id,
    ownerUid: safeStr(data.ownerUid),
    monsterKey: safeStr(data.monsterKey),
    completed: safeBool(data.completed),
  };
}

export async function getUserBestiaryProgress(): Promise<BestiaryProgressDoc[]> {
  const user = FirebaseAuth.currentUser;
  if (!user) return [];

  const q = query(
    collection(FirebaseDB, 'bestiaryProgress'),
    where('ownerUid', '==', user.uid),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
}

export async function setBestiaryCompletion(
  monsterKey: string,
  completed: boolean,
): Promise<void> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const docId = `${user.uid}_${monsterKey}`;
  if (completed) {
    await setDoc(doc(FirebaseDB, 'bestiaryProgress', docId), {
      ownerUid: user.uid,
      monsterKey,
      completed: true,
    });
  } else {
    await deleteDoc(doc(FirebaseDB, 'bestiaryProgress', docId));
  }
}
