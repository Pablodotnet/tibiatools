import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from './config';
import type { HuntingSpotData } from '@/helpers/huntingSpots';
import { safeStr, safeNum, safeArr, safeLevelRange } from '@/lib/firestore-helpers';

function mapSpotDoc(id: string, data: Record<string, unknown>): HuntingSpotData {
  return {
    id,
    name: safeStr(data.name),
    levelRange: safeLevelRange(data.levelRange),
    location: safeStr(data.location),
    expRaw: safeNum(data.expRaw),
    expBonus: safeNum(data.expBonus),
    profit: safeNum(data.profit),
    supplyCost: safeNum(data.supplyCost),
    set: safeStr(data.set),
    imbuements: safeArr<string>(data.imbuements),
    notes: safeStr(data.notes),
    ownerUid: safeStr(data.ownerUid),
    ownerDisplayName: safeStr(data.ownerDisplayName),
    vocationId: safeStr(data.vocationId),
  };
}

export async function addHuntingSpot(data: {
  name: string;
  levelMin: number;
  levelMax: number;
  location: string;
  expRaw: number;
  expBonus: number;
  profit: number;
  supplyCost: number;
  set: string;
  imbuements: string[];
  notes: string;
  vocationId: string;
}): Promise<string> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const docRef = await addDoc(collection(FirebaseDB, 'huntingSpots'), {
    name: data.name,
    levelRange: [data.levelMin, data.levelMax],
    location: data.location,
    expRaw: data.expRaw,
    expBonus: data.expBonus,
    profit: data.profit,
    supplyCost: data.supplyCost,
    set: data.set,
    imbuements: data.imbuements,
    notes: data.notes,
    vocationId: data.vocationId,
    ownerUid: user.uid,
    ownerDisplayName: user.displayName || user.email || 'Unknown',
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getUserHuntingSpots(): Promise<HuntingSpotData[]> {
  const user = FirebaseAuth.currentUser;
  if (!user) return [];

  const q = query(
    collection(FirebaseDB, 'huntingSpots'),
    where('ownerUid', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapSpotDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getAllHuntingSpots(vocationId?: string, limitCount = 100): Promise<HuntingSpotData[]> {
  const q = vocationId
    ? query(
        collection(FirebaseDB, 'huntingSpots'),
        where('vocationId', '==', vocationId),
        orderBy('createdAt', 'desc'),
        limit(limitCount),
      )
    : query(collection(FirebaseDB, 'huntingSpots'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapSpotDoc(d.id, d.data() as Record<string, unknown>));
}

export async function deleteHuntingSpot(spotId: string): Promise<void> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const snap = await getDoc(doc(FirebaseDB, 'huntingSpots', spotId));
  if (!snap.exists()) throw new Error('Spot not found');
  const data = snap.data() as Record<string, unknown>;
  if (data.ownerUid !== user.uid) throw new Error('Not authorized to delete this spot');

  await deleteDoc(doc(FirebaseDB, 'huntingSpots', spotId));
}
