import type { Timestamp } from 'firebase/firestore';

export type HuntSessionPlayer = {
  name: string;
  vocation: string;
  level: number;
  damage?: number;
  healing?: number;
  damageReceived?: number;
  loot?: number;
  supplies?: number;
  balance?: number;
  xpGain?: number;
  xpPerHour?: number;
};

export type KilledMonster = {
  name: string;
  count: number;
};

export type LootItem = {
  name: string;
  count: number;
  value: number;
};

export type HuntSession = {
  id: string;
  spotId: string;
  spotName: string;
  ownerUid: string;
  ownerDisplayName: string;
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
  players?: HuntSessionPlayer[];
  killedMonsters?: KilledMonster[];
  lootItems?: LootItem[];
  supplyItems?: LootItem[];
  rawText: string;
  createdAt: Timestamp;
};
