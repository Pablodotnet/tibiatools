import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from './config';
import type { HuntSession } from '@/types/huntSession';

function mapSessionDoc(id: string, data: Record<string, unknown>): HuntSession {
  return {
    id,
    spotId: data.spotId as string,
    spotName: data.spotName as string,
    ownerUid: data.ownerUid as string,
    ownerDisplayName: data.ownerDisplayName as string,
    isParty: data.isParty as boolean,
    sessionDate: data.sessionDate as string | undefined,
    durationMinutes: data.durationMinutes as number | undefined,
    vocation: data.vocation as string | undefined,
    level: data.level as number | undefined,
    damage: data.damage as number | undefined,
    healing: data.healing as number | undefined,
    damageReceived: data.damageReceived as number | undefined,
    loot: data.loot as number | undefined,
    supplies: data.supplies as number | undefined,
    balance: data.balance as number | undefined,
    xpGain: data.xpGain as number | undefined,
    xpPerHour: data.xpPerHour as number | undefined,
    rawXpPerHour: data.rawXpPerHour as number | undefined,
    players: data.players as HuntSession['players'],
    killedMonsters: data.killedMonsters as HuntSession['killedMonsters'],
    lootItems: data.lootItems as HuntSession['lootItems'],
    supplyItems: data.supplyItems as HuntSession['supplyItems'],
    rawText: data.rawText as string,
    createdAt: data.createdAt as Timestamp,
  };
}

export async function addHuntSession(data: {
  spotId: string;
  spotName: string;
  isParty: boolean;
  sessionDate?: string;
  durationMinutes?: number;
  vocation?: string;
  level?: number;
  damage?: number;
  healing?: number;
  damageReceived?: number;
  loot?: number;
  supplies?: number;
  balance?: number;
  xpGain?: number;
  xpPerHour?: number;
  rawXpPerHour?: number;
  players?: HuntSession['players'];
  killedMonsters?: HuntSession['killedMonsters'];
  lootItems?: HuntSession['lootItems'];
  supplyItems?: HuntSession['supplyItems'];
  rawText: string;
}): Promise<string> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const docRef = await addDoc(collection(FirebaseDB, 'huntSessions'), {
    spotId: data.spotId,
    spotName: data.spotName,
    ownerUid: user.uid,
    ownerDisplayName: user.displayName || user.email || 'Unknown',
    isParty: data.isParty,
    sessionDate: data.sessionDate ?? null,
    durationMinutes: data.durationMinutes ?? null,
    vocation: data.vocation ?? null,
    level: data.level ?? null,
    damage: data.damage ?? null,
    healing: data.healing ?? null,
    damageReceived: data.damageReceived ?? null,
    loot: data.loot ?? null,
    supplies: data.supplies ?? null,
    balance: data.balance ?? null,
    xpGain: data.xpGain ?? null,
    xpPerHour: data.xpPerHour ?? null,
    rawXpPerHour: data.rawXpPerHour ?? null,
    players: data.players ?? null,
    killedMonsters: data.killedMonsters ?? null,
    lootItems: data.lootItems ?? null,
    supplyItems: data.supplyItems ?? null,
    rawText: data.rawText,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getSessionsForSpot(spotId: string): Promise<HuntSession[]> {
  const q = query(
    collection(FirebaseDB, 'huntSessions'),
    where('spotId', '==', spotId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapSessionDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getSession(id: string): Promise<HuntSession | null> {
  const { getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(FirebaseDB, 'huntSessions', id));
  if (!snap.exists()) return null;
  return mapSessionDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function deleteHuntSession(sessionId: string): Promise<void> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');
  await deleteDoc(doc(FirebaseDB, 'huntSessions', sessionId));
}

export async function getRecentSessions(limitCount = 5): Promise<HuntSession[]> {
  const q = query(
    collection(FirebaseDB, 'huntSessions'),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapSessionDoc(d.id, d.data() as Record<string, unknown>));
}
