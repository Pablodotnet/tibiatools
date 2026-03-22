/** Regular fusion gold per tier step, by item classification (Tibia Wiki — Equipment Upgrade). */
export const FUSION_GOLD_GP: Record<
  1 | 2 | 3 | 4,
  (number | null)[]
> = {
  1: [
    25_000,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  2: [
    750_000,
    5_000_000,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  3: [
    4_000_000,
    10_000_000,
    20_000_000,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  4: [
    8_000_000,
    20_000_000,
    40_000_000,
    65_000_000,
    100_000_000,
    250_000_000,
    750_000_000,
    2_500_000_000,
    8_000_000_000,
    15_000_000_000,
  ],
};

export const TIER_LABELS = [
  "0 → 1",
  "1 → 2",
  "2 → 3",
  "3 → 4",
  "4 → 5",
  "5 → 6",
  "6 → 7",
  "7 → 8",
  "8 → 9",
  "9 → 10",
] as const;

/** Base fusion success chance (Equipment Upgrade — Fusion). */
export const FUSION_SUCCESS_BASE = 0.5;
/** Success chance when using an Exalted Core for success rate (checkbox 1). */
export const FUSION_SUCCESS_WITH_CORE = 0.65;
/**
 * When fusion fails, chance to avoid tier loss if using Exalted Core for mitigation (checkbox 2).
 * Without it, tier loss on failure is certain (aside from “saved” tracking).
 */
export const FUSION_TIER_LOSS_MITIGATION = 0.5;

export function getForgeGoldPerRow(
  classification: 1 | 2 | 3 | 4,
  rowIndex: number,
  class4GoldByRow: number[],
): number | null {
  if (classification === 4) {
    const v = class4GoldByRow[rowIndex];
    return Number.isFinite(v) && v >= 0 ? v : null;
  }
  return FUSION_GOLD_GP[classification][rowIndex];
}

export type TierAttemptStats = {
  successes: number;
  failures: number;
  /** Failures where tier loss was avoided (second core mitigation). */
  saved: number;
};

export type SingleSimulationResult = {
  forgeGoldGp: number;
  exaltedCoresUsed: number;
  itemPurchaseGp: number;
  totalGp: number;
  tierStats: TierAttemptStats[];
};

/**
 * One stochastic run: inventory fusion until at least one item reaches `desiredTier`.
 * Probabilities match Tibia Wiki (50% / 65% success; optional 50% tier-loss mitigation).
 */
export function simulateSingleForgeRun(params: {
  desiredTier: number;
  classification: 1 | 2 | 3 | 4;
  class4GoldByRow: number[];
  itemValueGp: number;
  exaltedCoreValueGp: number;
  useExaltedCore1: boolean[];
  useExaltedCore2: boolean[];
  random: () => number;
  maxIterations?: number;
}): SingleSimulationResult | null {
  const {
    desiredTier,
    classification,
    class4GoldByRow,
    itemValueGp,
    exaltedCoreValueGp,
    useExaltedCore1,
    useExaltedCore2,
    random,
    maxIterations = 5_000_000,
  } = params;

  const target = Math.min(Math.max(Math.floor(desiredTier), 0), 10);
  if (target === 0) {
    return {
      forgeGoldGp: 0,
      exaltedCoresUsed: 0,
      itemPurchaseGp: 0,
      totalGp: 0,
      tierStats: Array.from({ length: 10 }, () => ({
        successes: 0,
        failures: 0,
        saved: 0,
      })),
    };
  }

  for (let row = 0; row < target; row++) {
    if (
      getForgeGoldPerRow(classification, row, class4GoldByRow) === null
    ) {
      return null;
    }
  }

  const inv = new Array(11).fill(0);
  inv[0] = 2;
  let forgeGoldGp = 0;
  let exaltedCoresUsed = 0;
  let itemPurchaseGp = 2 * itemValueGp;
  const tierStats: TierAttemptStats[] = Array.from({ length: 10 }, () => ({
    successes: 0,
    failures: 0,
    saved: 0,
  }));

  let iterations = 0;

  while (inv[target] < 1) {
    if (++iterations > maxIterations) {
      return null;
    }

    let fused = false;
    for (let t = 9; t >= 0; t--) {
      if (inv[t] < 2) continue;
      const rowGold = getForgeGoldPerRow(classification, t, class4GoldByRow);
      if (rowGold === null) {
        return null;
      }

      inv[t] -= 2;
      forgeGoldGp += rowGold;
      const c1 = useExaltedCore1[t] ? 1 : 0;
      const c2 = useExaltedCore2[t] ? 1 : 0;
      exaltedCoresUsed += c1 + c2;

      const pSuccess = useExaltedCore1[t]
        ? FUSION_SUCCESS_WITH_CORE
        : FUSION_SUCCESS_BASE;

      if (random() < pSuccess) {
        inv[t + 1] += 1;
        tierStats[t].successes += 1;
      } else {
        tierStats[t].failures += 1;
        const avoidedTierLoss =
          useExaltedCore2[t] && random() < FUSION_TIER_LOSS_MITIGATION;

        if (avoidedTierLoss) {
          inv[t] += 2;
          tierStats[t].saved += 1;
        } else if (t === 0) {
          inv[0] += 1;
        } else {
          inv[t] += 1;
          inv[t - 1] += 1;
        }
      }

      fused = true;
      break;
    }

    if (!fused) {
      inv[0] += 1;
      itemPurchaseGp += itemValueGp;
    }
  }

  const totalGp =
    forgeGoldGp +
    exaltedCoresUsed * exaltedCoreValueGp +
    itemPurchaseGp;

  return {
    forgeGoldGp,
    exaltedCoresUsed,
    itemPurchaseGp,
    totalGp,
    tierStats,
  };
}

export type ScenarioSnapshot = {
  forgeGoldGp: number;
  exaltedCoresUsed: number;
  itemPurchaseGp: number;
  totalGp: number;
  tibiaCoins: number;
  /** Approximate cost in Mexican pesos (from 250 TC price). */
  mxn: number;
  tierStats: TierAttemptStats[];
};

export type MonteCarloForgeResult = {
  runCount: number;
  best: ScenarioSnapshot;
  average: ScenarioSnapshot;
  worst: ScenarioSnapshot;
};

function snapshotFromRun(
  run: SingleSimulationResult,
  tcGp: number,
  mxnPer250Tc: number,
): ScenarioSnapshot {
  const tibiaCoins = tcGp > 0 ? run.totalGp / tcGp : 0;
  const mxn = (tibiaCoins / 250) * mxnPer250Tc;
  return {
    forgeGoldGp: run.forgeGoldGp,
    exaltedCoresUsed: run.exaltedCoresUsed,
    itemPurchaseGp: run.itemPurchaseGp,
    totalGp: run.totalGp,
    tibiaCoins,
    mxn,
    tierStats: run.tierStats.map((t) => ({ ...t })),
  };
}

function meanTierStats(
  runs: SingleSimulationResult[],
  rowCount: number,
): TierAttemptStats[] {
  const out: TierAttemptStats[] = [];
  for (let r = 0; r < rowCount; r++) {
    let s = 0;
    let f = 0;
    let v = 0;
    for (const run of runs) {
      s += run.tierStats[r].successes;
      f += run.tierStats[r].failures;
      v += run.tierStats[r].saved;
    }
    const n = runs.length || 1;
    out.push({
      successes: Math.round(s / n),
      failures: Math.round(f / n),
      saved: Math.round(v / n),
    });
  }
  return out;
}

/**
 * Runs many independent forge simulations; picks best/worst by total gp and averages metrics.
 */
export function runMonteCarloForge(params: {
  desiredTier: number;
  classification: 1 | 2 | 3 | 4;
  class4GoldByRow: number[];
  itemValueGp: number;
  exaltedCoreValueGp: number;
  tcGp: number;
  /** Price of one pack of 250 Tibia Coins in Mexican pesos (MXN). */
  mxnPer250Tc: number;
  useExaltedCore1: boolean[];
  useExaltedCore2: boolean[];
  runCount?: number;
  random?: () => number;
}): MonteCarloForgeResult | null {
  const {
    desiredTier,
    classification,
    class4GoldByRow,
    itemValueGp,
    exaltedCoreValueGp,
    tcGp,
    mxnPer250Tc,
    useExaltedCore1,
    useExaltedCore2,
    runCount = 10_000,
    random = Math.random,
  } = params;

  const runs: SingleSimulationResult[] = [];
  for (let i = 0; i < runCount; i++) {
    const one = simulateSingleForgeRun({
      desiredTier,
      classification,
      class4GoldByRow,
      itemValueGp,
      exaltedCoreValueGp,
      useExaltedCore1,
      useExaltedCore2,
      random,
    });
    if (one === null) {
      return null;
    }
    runs.push(one);
  }

  let bestIdx = 0;
  let worstIdx = 0;
  for (let i = 1; i < runs.length; i++) {
    if (runs[i].totalGp < runs[bestIdx].totalGp) bestIdx = i;
    if (runs[i].totalGp > runs[worstIdx].totalGp) worstIdx = i;
  }

  const avgForge =
    runs.reduce((a, r) => a + r.forgeGoldGp, 0) / runs.length;
  const avgCores =
    runs.reduce((a, r) => a + r.exaltedCoresUsed, 0) / runs.length;
  const avgItems =
    runs.reduce((a, r) => a + r.itemPurchaseGp, 0) / runs.length;
  const avgTotal =
    runs.reduce((a, r) => a + r.totalGp, 0) / runs.length;

  const averageRun: SingleSimulationResult = {
    forgeGoldGp: avgForge,
    exaltedCoresUsed: avgCores,
    itemPurchaseGp: avgItems,
    totalGp: avgTotal,
    tierStats: meanTierStats(runs, 10),
  };

  return {
    runCount,
    best: snapshotFromRun(runs[bestIdx], tcGp, mxnPer250Tc),
    average: snapshotFromRun(averageRun, tcGp, mxnPer250Tc),
    worst: snapshotFromRun(runs[worstIdx], tcGp, mxnPer250Tc),
  };
}

export type ForgeCalculationResult = {
  forgeGoldGp: number;
  exaltedCoresUsed: number;
  exaltedCoreCostGp: number;
  /** Two identical items per fusion attempt. */
  itemCostGp: number;
  totalGp: number;
  tibiaCoins: number;
  mxn: number;
  /** Row indices where gold cost is missing for this classification. */
  invalidRowIndices: number[];
};

export function calculateForgeTotals(params: {
  desiredTier: number;
  classification: 1 | 2 | 3 | 4;
  /** Per-row Class 4 gold override (gp). Used when classification is 4. */
  class4GoldByRow: number[];
  itemValueGp: number;
  exaltedCoreValueGp: number;
  tcGp: number;
  mxnPer250Tc: number;
  useExaltedCore1: boolean[];
  useExaltedCore2: boolean[];
}): ForgeCalculationResult {
  const {
    desiredTier,
    classification,
    class4GoldByRow,
    itemValueGp,
    exaltedCoreValueGp,
    tcGp,
    mxnPer250Tc,
    useExaltedCore1,
    useExaltedCore2,
  } = params;

  const steps = Math.min(Math.max(Math.floor(desiredTier), 0), 10);
  let forgeGoldGp = 0;
  const invalidRowIndices: number[] = [];

  for (let i = 0; i < steps; i++) {
    const rowGold = getForgeGoldPerRow(classification, i, class4GoldByRow);

    if (rowGold === null) {
      invalidRowIndices.push(i);
      continue;
    }
    forgeGoldGp += rowGold;
  }

  let exaltedCoresUsed = 0;
  for (let i = 0; i < steps; i++) {
    if (useExaltedCore1[i]) exaltedCoresUsed += 1;
    if (useExaltedCore2[i]) exaltedCoresUsed += 1;
  }

  const exaltedCoreCostGp = exaltedCoresUsed * exaltedCoreValueGp;
  const itemCostGp = steps * 2 * itemValueGp;
  const totalGp = forgeGoldGp + exaltedCoreCostGp + itemCostGp;
  const tibiaCoins = tcGp > 0 ? totalGp / tcGp : 0;
  const mxn = (tibiaCoins / 250) * mxnPer250Tc;

  return {
    forgeGoldGp,
    exaltedCoresUsed,
    exaltedCoreCostGp,
    itemCostGp,
    totalGp,
    tibiaCoins,
    mxn,
    invalidRowIndices,
  };
}
