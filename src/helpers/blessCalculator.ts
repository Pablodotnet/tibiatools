function regularBlessingPrice(level: number): number {
  if (level <= 30) return 2000;
  if (level < 120) return 200 * (level - 20);
  return 20000 + 75 * (level - 120);
}

function enhancedBlessingPrice(level: number): number {
  if (level <= 30) return 2600;
  if (level < 120) return 260 * (level - 20);
  return 26000 + 100 * (level - 120);
}

function twistOfFatePrice(level: number): number {
  if (level <= 30) return 2000;
  if (level < 270) return 200 * (level - 20);
  return 50000;
}

function inquisitionPrice(level: number): number {
  const fiveRegular = 5 * regularBlessingPrice(level);
  return Math.round(fiveRegular * 1.1);
}

export interface BlessingBreakdown {
  regularFive: number;
  enhancedTwo: number;
  twistOfFate: number;
  regularEach: number;
  enhancedEach: number;
  inquisition: number;
  totalAllSeven: number;
  totalAllSevenPlusToF: number;
}

export function calculateBlessings(level: number): BlessingBreakdown {
  const regEach = regularBlessingPrice(level);
  const enhEach = enhancedBlessingPrice(level);
  const tof = twistOfFatePrice(level);
  const inqui = inquisitionPrice(level);

  return {
    regularFive: regEach * 5,
    enhancedTwo: enhEach * 2,
    twistOfFate: tof,
    regularEach: regEach,
    enhancedEach: enhEach,
    inquisition: inqui,
    totalAllSeven: regEach * 5 + enhEach * 2,
    totalAllSevenPlusToF: regEach * 5 + enhEach * 2 + tof,
  };
}

export const STORE_PRICES = {
  regularBlessing: 15,
  sparkOfPhoenix: 20,
  bloodOfMountain: 25,
  heartOfMountain: 25,
  twistOfFate: 8,
  allSeven: 130,
} as const;

export function calculateStoreCost(count5Regular: number, countEnhanced: number, countToF: number): number {
  let total = 0;
  total += count5Regular * STORE_PRICES.regularBlessing;
  total += countEnhanced * STORE_PRICES.heartOfMountain;
  total += countToF * STORE_PRICES.twistOfFate;
  return total;
}
