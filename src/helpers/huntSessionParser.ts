import type { HuntSessionPlayer, KilledMonster, LootItem } from '@/types/huntSession';

function parseNumber(str: string | undefined): number | undefined {
  if (!str) return undefined;
  const cleaned = str.replace(/[,\s]/g, '').replace(/gp/gi, '').trim();
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? undefined : n;
}

function parseDuration(str: string): number | undefined {
  if (!str) return undefined;
  const hMatch = str.match(/(\d+)\s*h/);
  const mMatch = str.match(/(\d+)\s*min/);
  const sColon = str.match(/(\d+):(\d+)(?::(\d+))?/);

  let totalMinutes = 0;
  if (sColon) {
    totalMinutes = parseInt(sColon[1], 10) * 60 + parseInt(sColon[2], 10);
    if (sColon[3]) totalMinutes += Math.round(parseInt(sColon[3], 10) / 60);
    return totalMinutes;
  }
  if (hMatch) totalMinutes += parseInt(hMatch[1], 10) * 60;
  if (mMatch) totalMinutes += parseInt(mMatch[1], 10);
  return totalMinutes > 0 ? totalMinutes : undefined;
}

export function parseHuntSession(rawText: string): {
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
  players?: HuntSessionPlayer[];
  killedMonsters?: KilledMonster[];
  lootItems?: LootItem[];
  supplyItems?: LootItem[];
} {
  const lines = rawText.split('\n').map((l) => l.trim());
  const text = rawText;

  let isParty = false;
  let sessionDate: string | undefined;
  let durationMinutes: number | undefined;
  const durationFromSession =
    text.match(/until\s+.*?\(([^)]+)\)/)?.[1] ||
    text.match(/Duration:\s*(.+)/i)?.[1] ||
    '';
  durationMinutes = parseDuration(durationFromSession);

  sessionDate = text.match(/Session:?\s*(.+?)(?:until|$)/)?.[1]?.trim() || undefined;
  if (!sessionDate) {
    sessionDate = text.match(/Party Hunt:?\s*(.+?!)/)?.[1]?.trim() || undefined;
  }

  const durLine = text.match(/\((\d+:\d+(?::\d+)?)\)/);
  if (durLine && !durationMinutes) {
    const parts = durLine[1].split(':');
    if (parts.length === 2) durationMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    else if (parts.length === 3) durationMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) + Math.round(parseInt(parts[2], 10) / 60);
  }

  const vocation = text.match(/Vocation:\s*(.+?)(?:\n|$)/i)?.[1]?.trim();
  const level = parseNumber(text.match(/Level:\s*(\d[\d,]*)/i)?.[1]);

  isParty = /Party\s+Hunt/i.test(text) || /Player:\s+\w/.test(text);

  const damage = parseNumber(text.match(/Damage:\s*(\d[\d,]*)/)?.[1]);
  const healing = parseNumber(text.match(/Healing:\s*(\d[\d,]*)/)?.[1]);
  const damageReceived = parseNumber(text.match(/Damage\s+Received:\s*(\d[\d,]*)/i)?.[1]);

  const loot = parseNumber(text.match(/Loot:\s*(\d[\d,]*)/)?.[1]);
  const supplies = parseNumber(text.match(/Supplies:\s*(\d[\d,]*)/)?.[1]);
  const balance = parseNumber(text.match(/Balance:\s*(-?\d[\d,]*)/)?.[1]);

  const xpGain = parseNumber(text.match(/XP\s+Gain:\s*(\d[\d,]*)/i)?.[1]);
  const xpPerHour = parseNumber(text.match(/XP\/h:\s*(\d[\d,]*)/i)?.[1]);

  const players: HuntSessionPlayer[] = [];
  let currentPlayer: Partial<HuntSessionPlayer> | null = null;
  const playerSection = /^Player:\s+(.+?)\s*\(Level\s*(\d+)\)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const pm = line.match(playerSection);
    if (pm) {
      if (currentPlayer && currentPlayer.name) {
        players.push(currentPlayer as HuntSessionPlayer);
      }
      currentPlayer = {
        name: pm[1].trim(),
        level: parseInt(pm[2], 10),
      };
      continue;
    }

    if (!currentPlayer) continue;

    const pd = line.match(/Damage:\s*(\d[\d,]*)/i);
    if (pd) currentPlayer.damage = parseNumber(pd[1]);
    const ph = line.match(/Healing:\s*(\d[\d,]*)/i);
    if (ph) currentPlayer.healing = parseNumber(ph[1]);
    const pdr = line.match(/Damage\s+Received:\s*(\d[\d,]*)/i);
    if (pdr) currentPlayer.damageReceived = parseNumber(pdr[1]);
    const ploot = line.match(/Loot:\s*(\d[\d,]*)/i);
    if (ploot) currentPlayer.loot = parseNumber(ploot[1]);
    const psupp = line.match(/Supplies:\s*(\d[\d,]*)/i);
    if (psupp) currentPlayer.supplies = parseNumber(psupp[1]);
    const pbal = line.match(/Balance:\s*(-?\d[\d,]*)/i);
    if (pbal) currentPlayer.balance = parseNumber(pbal[1]);
    const pxp = line.match(/XP:\s*(\d[\d,]*)/i);
    if (pxp) currentPlayer.xpGain = parseNumber(pxp[1]);
    const pph = line.match(/XP\/h:\s*(\d[\d,]*)/i);
    if (pph) currentPlayer.xpPerHour = parseNumber(pph[1]);
    const pvoc = line.match(/Vocation:\s*(.+?)(?:\n|$)/i);
    if (pvoc && !currentPlayer.vocation) {
      currentPlayer.vocation = pvoc[1].trim();
    }
  }
  if (currentPlayer && currentPlayer.name) {
    players.push(currentPlayer as HuntSessionPlayer);
  }

  const killedMonsters: KilledMonster[] = [];
  let inMonsters = false;
  for (const line of lines) {
    if (/^Killed\s+Monsters?:/i.test(line)) {
      inMonsters = true;
      continue;
    }
    if (inMonsters) {
      if (/^(?:Loot|Supplies|Session|Party|Vocation|Damage|Healing|XP)/i.test(line) && !/^\w+:\s*\d/.test(line)) {
        inMonsters = false;
        continue;
      }
      const mm = line.match(/^(.+?):\s*(\d[\d,]*)$/);
      if (mm) {
        killedMonsters.push({ name: mm[1].trim(), count: parseInt(mm[2].replace(/[,\s]/g, ''), 10) });
      }
    }
  }

  const lootItems: LootItem[] = [];
  const supplyItems: LootItem[] = [];
  let currentSection: 'loot' | 'supplies' | null = null;

  for (const line of lines) {
    if (/^Loot:\s*$|^Loot\s+Type/i.test(line) && !/^\d/.test(line)) {
      currentSection = 'loot';
      continue;
    }
    if (/^Supplies:\s*$|^Supply\s+Type/i.test(line) && !/^\d/.test(line)) {
      currentSection = 'supplies';
      continue;
    }
    if (/^(?:Damage|Healing|Session|Party|Vocation|XP|Killed|Balance)/i.test(line) && !line.includes(':')) {
      currentSection = null;
      continue;
    }

    if (currentSection && line) {
      const im = line.match(/^(.+?)\s*x\s*(\d[\d,]*)/i);
      if (im) {
        const item: LootItem = {
          name: im[1].trim(),
          count: parseInt(im[2].replace(/[,\s]/g, ''), 10),
          value: 0,
        };
        const valMatch = line.match(/\(([\d,.]+)\s*gp\)/i);
        if (valMatch) item.value = parseNumber(valMatch[1]) || 0;
        if (currentSection === 'loot') lootItems.push(item);
        else supplyItems.push(item);
      }
    }
  }

  return {
    isParty,
    sessionDate,
    durationMinutes,
    vocation,
    level,
    damage,
    healing,
    damageReceived,
    loot,
    supplies,
    balance,
    xpGain,
    xpPerHour,
    players: players.length > 0 ? players : undefined,
    killedMonsters: killedMonsters.length > 0 ? killedMonsters : undefined,
    lootItems: lootItems.length > 0 ? lootItems : undefined,
    supplyItems: supplyItems.length > 0 ? supplyItems : undefined,
  };
}
