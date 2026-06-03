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
import { safeStr } from '@/lib/firestore-helpers';

export interface CharacterDoc {
  id: string;
  name: string;
  vocation: string;
  level: number;
  ownerUid: string;
  createdAt: Timestamp;
}

function mapDoc(id: string, data: Record<string, unknown>): CharacterDoc {
  return {
    id,
    name: safeStr(data.name),
    vocation: safeStr(data.vocation),
    level: (data.level as number) ?? 1,
    ownerUid: safeStr(data.ownerUid),
    createdAt: data.createdAt as Timestamp,
  };
}

export async function getUserCharacters(): Promise<CharacterDoc[]> {
  const user = FirebaseAuth.currentUser;
  if (!user) return [];
  const q = query(
    collection(FirebaseDB, 'characters'),
    where('ownerUid', '==', user.uid),
    orderBy('createdAt', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
}

export async function addCharacter(data: { name: string; vocation: string; level: number }): Promise<string> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const docRef = await addDoc(collection(FirebaseDB, 'characters'), {
    name: data.name,
    vocation: data.vocation,
    level: data.level,
    ownerUid: user.uid,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteCharacter(id: string): Promise<void> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const ref = doc(FirebaseDB, 'characters', id);
  await deleteDoc(ref);
}
