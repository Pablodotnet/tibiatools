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
import type { HuntSession } from '@/types/huntSession';
import { safeStr, optNum, safeBool } from '@/lib/firestore-helpers';

function mapSessionDoc(id: string, data: Record<string, unknown>): HuntSession {
  return {
    id,
    spotId: safeStr(data.spotId),
    spotName: safeStr(data.spotName),
    ownerUid: safeStr(data.ownerUid),
    ownerDisplayName: safeStr(data.ownerDisplayName),
    isParty: safeBool(data.isParty),
    sessionDate: safeStr(data.sessionDate, undefined),
    durationMinutes: optNum(data.durationMinutes),
    vocation: safeStr(data.vocation, undefined),
    level: optNum(data.level),
    damage: optNum(data.damage),
    healing: optNum(data.healing),
    damageReceived: optNum(data.damageReceived),
    loot: optNum(data.loot),
    supplies: optNum(data.supplies),
    balance: optNum(data.balance),
    xpGain: optNum(data.xpGain),
    xpPerHour: optNum(data.xpPerHour),
    rawXpPerHour: optNum(data.rawXpPerHour),
    players: Array.isArray(data.players) ? data.players as HuntSession['players'] : undefined,
    killedMonsters: Array.isArray(data.killedMonsters) ? data.killedMonsters as HuntSession['killedMonsters'] : undefined,
    lootItems: Array.isArray(data.lootItems) ? data.lootItems as HuntSession['lootItems'] : undefined,
    supplyItems: Array.isArray(data.supplyItems) ? data.supplyItems as HuntSession['supplyItems'] : undefined,
    rawText: safeStr(data.rawText),
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

export async function getSessionsForSpot(
  spotId: string,
  opts?: { limit?: number },
): Promise<HuntSession[]> {
  const constraints: import('firebase/firestore').QueryConstraint[] = [
    where('spotId', '==', spotId),
    orderBy('createdAt', 'desc'),
  ];
  if (opts?.limit) constraints.push(limit(opts.limit));
  const q = query(
    collection(FirebaseDB, 'huntSessions'),
    ...constraints,
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapSessionDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getSession(id: string): Promise<HuntSession | null> {
  const snap = await getDoc(doc(FirebaseDB, 'huntSessions', id));
  if (!snap.exists()) return null;
  return mapSessionDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function deleteHuntSession(sessionId: string): Promise<void> {
  const user = FirebaseAuth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const snap = await getDoc(doc(FirebaseDB, 'huntSessions', sessionId));
  if (!snap.exists()) throw new Error('Session not found');
  const data = snap.data() as Record<string, unknown>;
  if (data.ownerUid !== user.uid) throw new Error('Not authorized to delete this session');

  await deleteDoc(doc(FirebaseDB, 'huntSessions', sessionId));
}

export async function getRecentSessions(limitCount = 5): Promise<HuntSession[]> {
  const user = FirebaseAuth.currentUser;
  if (!user) return [];

  const q = query(
    collection(FirebaseDB, 'huntSessions'),
    where('ownerUid', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapSessionDoc(d.id, d.data() as Record<string, unknown>));
}
