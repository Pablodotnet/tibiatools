export interface BossEntry {
  key: string;
  name: string;
  cooldownHours: number;
  category: 'boss' | 'raid';
  location?: string;
}

export const BOSSES: BossEntry[] = [
  { key: 'ferumbras', name: 'Ferumbras', cooldownHours: 72, category: 'boss', location: 'Ferumbras Citadel' },
  { key: 'grorlam', name: 'Grorlam', cooldownHours: 72, category: 'boss', location: 'Demona' },
  { key: 'plagirath', name: 'Plagirath', cooldownHours: 72, category: 'boss', location: 'Rascacoon' },
  { key: 'zamulosh', name: 'Zamulosh', cooldownHours: 72, category: 'boss', location: 'Razachai' },
  { key: 'morshabaal', name: 'Morshabaal', cooldownHours: 48, category: 'boss', location: 'Oramond' },
  { key: 'latrivan', name: 'Latrivan', cooldownHours: 48, category: 'boss', location: 'Oramond' },
  { key: 'drume', name: 'Drume', cooldownHours: 24, category: 'boss', location: 'Zao' },
  { key: 'shlorg', name: 'Shlorg', cooldownHours: 24, category: 'boss', location: 'Zao' },
  { key: 'ragiaz', name: 'Ragiaz', cooldownHours: 24, category: 'boss', location: 'Edron' },
  { key: 'furyosa', name: 'Furyosa', cooldownHours: 12, category: 'raid', location: 'Fury Gate' },
  { key: 'ghazbaran', name: 'Ghazbaran', cooldownHours: 12, category: 'raid', location: 'Ghazbaran' },
  { key: 'tarbaz', name: 'Tarbaz', cooldownHours: 18, category: 'raid', location: 'Last Sanctum' },
  // Add more as needed
];

export interface BossCooldownStatus {
  bossKey: string;
  killedAt: number;
  becomesAvailableAt: number;
  available: boolean;
  remainingMs: number;
}

export function computeBossStatus(
  boss: BossEntry,
  killedAtMs: number | null,
  nowMs: number = Date.now(),
): BossCooldownStatus {
  if (killedAtMs === null) {
    return {
      bossKey: boss.key,
      killedAt: 0,
      becomesAvailableAt: 0,
      available: true,
      remainingMs: 0,
    };
  }
  const becomesAvailableAt = killedAtMs + boss.cooldownHours * 60 * 60 * 1000;
  const remainingMs = Math.max(0, becomesAvailableAt - nowMs);
  return {
    bossKey: boss.key,
    killedAt: killedAtMs,
    becomesAvailableAt,
    available: remainingMs <= 0,
    remainingMs,
  };
}

export function formatCooldown(ms: number): string {
  if (ms <= 0) return 'Available';
  const totalHours = ms / (1000 * 60 * 60);
  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24);
    const hours = Math.round(totalHours % 24);
    return `${days}d ${hours}h`;
  }
  if (totalHours >= 1) {
    return `${Math.round(totalHours)}h`;
  }
  return `${Math.round(ms / (1000 * 60))}min`;
}
