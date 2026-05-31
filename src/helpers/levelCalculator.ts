export function cumulativeXp(level: number): number {
  if (level < 1) return 0;
  const l = level;
  return Math.floor(50 / 3 * l * l * l - 100 * l * l + 850 / 3 * l - 200);
}

export function xpToNextLevel(level: number): number {
  if (level < 1) return 0;
  return 50 * level * level - 150 * level + 200;
}

export function xpFromCurrentToTarget(currentLevel: number, currentPercent: number, targetLevel: number): number {
  if (targetLevel <= currentLevel) return 0;
  const currentTotal = cumulativeXp(currentLevel);
  const currentProgress = xpToNextLevel(currentLevel) * (currentPercent / 100);
  const currentEffective = currentTotal + currentProgress;
  const targetTotal = cumulativeXp(targetLevel);
  return targetTotal - currentEffective;
}

export function levelFromTotalXp(totalXp: number): { level: number; percent: number; xpInto: number; xpNeeded: number } {
  let level = 1;
  while (cumulativeXp(level + 1) <= totalXp) {
    level++;
  }
  const xpInto = totalXp - cumulativeXp(level);
  const xpNeeded = xpToNextLevel(level);
  const percent = xpNeeded > 0 ? (xpInto / xpNeeded) * 100 : 0;
  return { level, percent, xpInto, xpNeeded };
}

export type LevelCalcResult = {
  currentXpTotal: number;
  targetXpTotal: number;
  xpNeeded: number;
  levelsGained: number;
  currentLevel: number;
  targetLevel: number;
  currentPercent: number;
};

export function calculateLevel(input: {
  currentLevel: number;
  currentPercent: number;
  targetLevel: number;
}): LevelCalcResult {
  const { currentLevel, currentPercent, targetLevel } = input;
  const currentXpTotal = cumulativeXp(currentLevel) + xpToNextLevel(currentLevel) * (currentPercent / 100);
  const targetXpTotal = cumulativeXp(targetLevel);
  const xpNeeded = targetXpTotal - currentXpTotal;
  return {
    currentXpTotal,
    targetXpTotal,
    xpNeeded,
    levelsGained: targetLevel - currentLevel,
    currentLevel,
    targetLevel,
    currentPercent,
  };
}
