// ─────────────────────────────────────────────────────────────
// FUSION gold cost (gp) per tier step — from official Tibia wiki
// null = not available for that class
// ─────────────────────────────────────────────────────────────
export const FUSION_GOLD_GP: Record<1 | 2 | 3 | 4, (number | null)[]> = {
  1: [
    25_000, // 0→1
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
    750_000, // 0→1
    5_000_000, // 1→2
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
    4_000_000, // 0→1
    10_000_000, // 1→2
    20_000_000, // 2→3
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  4: [
    8_000_000, // 0→1
    20_000_000, // 1→2
    40_000_000, // 2→3
    65_000_000, // 3→4
    100_000_000, // 4→5
    250_000_000, // 5→6
    750_000_000, // 6→7
    2_500_000_000, // 7→8
    8_000_000_000, // 8→9
    15_000_000_000, // 9→10
  ],
};

export const TIER_LABELS = [
  '0 → 1',
  '1 → 2',
  '2 → 3',
  '3 → 4',
  '4 → 5',
  '5 → 6',
  '6 → 7',
  '7 → 8',
  '8 → 9',
  '9 → 10',
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
    if (getForgeGoldPerRow(classification, row, class4GoldByRow) === null) {
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
    forgeGoldGp + exaltedCoresUsed * exaltedCoreValueGp + itemPurchaseGp;

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

  const avgForge = runs.reduce((a, r) => a + r.forgeGoldGp, 0) / runs.length;
  const avgCores =
    runs.reduce((a, r) => a + r.exaltedCoresUsed, 0) / runs.length;
  const avgItems = runs.reduce((a, r) => a + r.itemPurchaseGp, 0) / runs.length;
  const avgTotal = runs.reduce((a, r) => a + r.totalGp, 0) / runs.length;

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

// ─────────────────────────────────────────────────────────────
// Tibia Exaltation Forge – Extended helpers
// Covers: Transfer, Convergence Fusion, Convergence Transfer
// Source: https://tibia.fandom.com/wiki/Equipment_Upgrade
// ─────────────────────────────────────────────────────────────

// export const TIER_LABELS = [
//   "0→1", "1→2", "2→3", "3→4", "4→5",
//   "5→6", "6→7", "7→8", "8→9", "9→10",
// ] as const;

// ─────────────────────────────────────────────────────────────
// TRANSFER gold cost (gp) per tier
// Row index 0 = source T2→result T1, index 1 = source T3→result T2, etc.
// null = not applicable for that class at that tier
// ─────────────────────────────────────────────────────────────
export const TRANSFER_GOLD_GP: Record<1 | 2 | 3 | 4, (number | null)[]> = {
  1: [null, null, null, null, null, null, null, null, null, null],
  2: [
    5_000_000, // 2→1
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
  3: [
    10_000_000, // 2→1
    20_000_000, // 3→2
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  4: [
    20_000_000, // 2→1
    40_000_000, // 3→2
    65_000_000, // 4→3
    100_000_000, // 5→4
    250_000_000, // 6→5
    750_000_000, // 7→6
    2_500_000_000, // 8→7
    8_000_000_000, // 9→8
    15_000_000_000, // 10→9
    null, // impossible
  ],
};

// Exalted Cores required per transfer (indexed by result tier - 1)
// ? = not yet documented on wiki, using null
export const TRANSFER_CORES: Record<1 | 2 | 3 | 4, (number | null)[]> = {
  1: [null, null, null, null, null, null, null, null, null, null],
  2: [1, null, null, null, null, null, null, null, null, null],
  3: [1, 2, null, null, null, null, null, null, null, null],
  4: [1, 2, 5, 10, 15, null, null, null, null, null],
};

// ─────────────────────────────────────────────────────────────
// CONVERGENCE FUSION – Class 4 only, guaranteed, 130 Dust
// Indexed by target tier - 1 (0 = target tier 1)
// ─────────────────────────────────────────────────────────────
export const CONVERGENCE_FUSION_GOLD_GP: (number | null)[] = [
  55_000_000, // target tier 1
  110_000_000, // target tier 2
  170_000_000, // target tier 3
  300_000_000, // target tier 4
  875_000_000, // target tier 5
  2_350_000_000, // target tier 6
  6_950_000_000, // target tier 7
  21_250_000_000, // target tier 8
  50_000_000_000, // target tier 9
  125_000_000_000, // target tier 10
];

// ─────────────────────────────────────────────────────────────
// CONVERGENCE TRANSFER – Class 4 only, no tier loss, 160 Dust
// Indexed by target tier - 1 (0 = target tier 1)
// ─────────────────────────────────────────────────────────────
export const CONVERGENCE_TRANSFER_GOLD_GP: Record<3 | 4, (number | null)[]> = {
  3: [null, null, null, null, null, null, null, null, null, null], // class 3 not supported per wiki image
  4: [
    65_000_000, // target tier 1
    165_000_000, // target tier 2
    375_000_000, // target tier 3
    800_000_000, // target tier 4
    2_000_000_000, // target tier 5
    5_250_000_000, // target tier 6
    14_500_000_000, // target tier 7
    42_500_000_000, // target tier 8
    100_000_000_000, // target tier 9
    300_000_000_000, // target tier 10
  ],
};

export const CONVERGENCE_TRANSFER_CORES: Record<3 | 4, (number | null)[]> = {
  3: [null, null, null, null, null, null, null, null, null, null],
  4: [1, 2, 5, 10, 15, 25, 35, 50, 60, 85],
};

// ─────────────────────────────────────────────────────────────
// Utility formatters (shared)
// ─────────────────────────────────────────────────────────────
export function formatGp(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('de-DE');
}

export function parseGpInput(raw: string): number {
  const cleaned = raw.replace(/\./g, '').replace(/\s/g, '').replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatTc(n: number): string {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatMxn(n: number): string {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ─────────────────────────────────────────────────────────────
// TRANSFER CALCULATOR
// ─────────────────────────────────────────────────────────────
export interface TransferInput {
  /** The tier of the SOURCE item being destroyed (≥2) */
  sourceTier: number;
  classification: 1 | 2 | 3 | 4;
  exaltedCoreValueGp: number;
  tcGp: number;
  mxnPer250Tc: number;
  /** Value of the source item (consumed) */
  sourceItemValueGp: number;
  /** Value of the target item (tier 0, kept) */
  targetItemValueGp: number;
}

export interface TransferResult {
  resultingTier: number;
  goldFee: number | null;
  coresRequired: number | null;
  coreCostGp: number;
  sourceItemCostGp: number;
  targetItemCostGp: number;
  totalGp: number | null;
  tibiaCoins: number;
  mxn: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateTransfer(input: TransferInput): TransferResult {
  const {
    sourceTier,
    classification,
    exaltedCoreValueGp,
    tcGp,
    mxnPer250Tc,
    sourceItemValueGp,
    targetItemValueGp,
  } = input;

  const resultingTier = sourceTier - 1;
  const rowIndex = resultingTier - 1; // 0-based index into arrays

  if (sourceTier < 2) {
    return {
      resultingTier: 0,
      goldFee: null,
      coresRequired: null,
      coreCostGp: 0,
      sourceItemCostGp: 0,
      targetItemCostGp: 0,
      totalGp: null,
      tibiaCoins: 0,
      mxn: 0,
      isValid: false,
      errorMessage: 'Source item must be at least tier 2.',
    };
  }

  const goldTable = TRANSFER_GOLD_GP[classification];
  const coreTable = TRANSFER_CORES[classification];

  if (rowIndex < 0 || rowIndex >= goldTable.length) {
    return {
      resultingTier,
      goldFee: null,
      coresRequired: null,
      coreCostGp: 0,
      sourceItemCostGp: 0,
      targetItemCostGp: 0,
      totalGp: null,
      tibiaCoins: 0,
      mxn: 0,
      isValid: false,
      errorMessage: 'Tier not available for this classification.',
    };
  }

  const goldFee = goldTable[rowIndex];
  const coresRequired = coreTable[rowIndex];

  if (goldFee === null || coresRequired === null) {
    return {
      resultingTier,
      goldFee: null,
      coresRequired: null,
      coreCostGp: 0,
      sourceItemCostGp: 0,
      targetItemCostGp: 0,
      totalGp: null,
      tibiaCoins: 0,
      mxn: 0,
      isValid: false,
      errorMessage: 'Transfer not available for this classification/tier.',
    };
  }

  const coreCostGp = coresRequired * exaltedCoreValueGp;
  const totalGp = goldFee + coreCostGp + sourceItemValueGp + targetItemValueGp;
  const tibiaCoins = tcGp > 0 ? (totalGp / tcGp) * 1 : 0;
  const mxn =
    mxnPer250Tc > 0 && tcGp > 0 ? (totalGp / tcGp) * (mxnPer250Tc / 250) : 0;

  return {
    resultingTier,
    goldFee,
    coresRequired,
    coreCostGp,
    sourceItemCostGp: sourceItemValueGp,
    targetItemCostGp: targetItemValueGp,
    totalGp,
    tibiaCoins,
    mxn,
    isValid: true,
  };
}

// ─────────────────────────────────────────────────────────────
// CONVERGENCE FUSION CALCULATOR
// ─────────────────────────────────────────────────────────────
export interface ConvergenceFusionInput {
  /** Current tier of both items (0–9). Result will be currentTier + 1. */
  currentTier: number;
  item1ValueGp: number;
  item2ValueGp: number;
  tcGp: number;
  mxnPer250Tc: number;
}

export interface ConvergenceFusionResult {
  currentTier: number;
  goldFee: number | null;
  item1CostGp: number;
  item2CostGp: number;
  totalGp: number | null;
  tibiaCoins: number;
  mxn: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateConvergenceFusion(
  input: ConvergenceFusionInput,
): ConvergenceFusionResult {
  const { currentTier, item1ValueGp, item2ValueGp, tcGp, mxnPer250Tc } = input;

  if (currentTier < 0 || currentTier > 9) {
    return {
      currentTier,
      goldFee: null,
      item1CostGp: 0,
      item2CostGp: 0,
      totalGp: null,
      tibiaCoins: 0,
      mxn: 0,
      isValid: false,
      errorMessage:
        'Current tier must be 0–9 (result will be current tier + 1).',
    };
  }

  const goldFee = CONVERGENCE_FUSION_GOLD_GP[currentTier];
  if (goldFee === null) {
    return {
      currentTier,
      goldFee: null,
      item1CostGp: 0,
      item2CostGp: 0,
      totalGp: null,
      tibiaCoins: 0,
      mxn: 0,
      isValid: false,
      errorMessage: `No gold cost data for tier step ${TIER_LABELS[currentTier]}.`,
    };
  }

  const totalGp = goldFee + item1ValueGp + item2ValueGp;
  const tibiaCoins = tcGp > 0 ? totalGp / tcGp : 0;
  const mxn =
    mxnPer250Tc > 0 && tcGp > 0 ? (totalGp / tcGp) * (mxnPer250Tc / 250) : 0;

  return {
    currentTier,
    goldFee,
    item1CostGp: item1ValueGp,
    item2CostGp: item2ValueGp,
    totalGp,
    tibiaCoins,
    mxn,
    isValid: true,
  };
}

// ─────────────────────────────────────────────────────────────
// CONVERGENCE TRANSFER CALCULATOR
// ─────────────────────────────────────────────────────────────
export interface ConvergenceTransferInput {
  /** Tier of the source item (same tier is transferred, no -1 loss) */
  sourceTier: number;
  classification: 3 | 4;
  exaltedCoreValueGp: number;
  sourceItemValueGp: number;
  targetItemValueGp: number;
  tcGp: number;
  mxnPer250Tc: number;
}

export interface ConvergenceTransferResult {
  resultingTier: number;
  goldFee: number | null;
  coresRequired: number | null;
  coreCostGp: number;
  sourceItemCostGp: number;
  targetItemCostGp: number;
  totalGp: number | null;
  tibiaCoins: number;
  mxn: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateConvergenceTransfer(
  input: ConvergenceTransferInput,
): ConvergenceTransferResult {
  const {
    sourceTier,
    classification,
    exaltedCoreValueGp,
    sourceItemValueGp,
    targetItemValueGp,
    tcGp,
    mxnPer250Tc,
  } = input;

  const rowIndex = sourceTier - 1;

  if (sourceTier < 1 || sourceTier > 10) {
    return {
      resultingTier: sourceTier,
      goldFee: null,
      coresRequired: null,
      coreCostGp: 0,
      sourceItemCostGp: 0,
      targetItemCostGp: 0,
      totalGp: null,
      tibiaCoins: 0,
      mxn: 0,
      isValid: false,
      errorMessage: 'Source tier must be 1–10.',
    };
  }

  const goldFee = CONVERGENCE_TRANSFER_GOLD_GP[classification][rowIndex];
  const coresRequired = CONVERGENCE_TRANSFER_CORES[classification][rowIndex];

  if (goldFee === null || coresRequired === null) {
    return {
      resultingTier: sourceTier,
      goldFee: null,
      coresRequired: null,
      coreCostGp: 0,
      sourceItemCostGp: 0,
      targetItemCostGp: 0,
      totalGp: null,
      tibiaCoins: 0,
      mxn: 0,
      isValid: false,
      errorMessage:
        'No data available for this tier. Check the wiki for updated values.',
    };
  }

  const coreCostGp = coresRequired * exaltedCoreValueGp;
  const totalGp = goldFee + coreCostGp + sourceItemValueGp + targetItemValueGp;
  const tibiaCoins = tcGp > 0 ? totalGp / tcGp : 0;
  const mxn =
    mxnPer250Tc > 0 && tcGp > 0 ? (totalGp / tcGp) * (mxnPer250Tc / 250) : 0;

  return {
    resultingTier: sourceTier,
    goldFee,
    coresRequired,
    coreCostGp,
    sourceItemCostGp: sourceItemValueGp,
    targetItemCostGp: targetItemValueGp,
    totalGp,
    tibiaCoins,
    mxn,
    isValid: true,
  };
}
