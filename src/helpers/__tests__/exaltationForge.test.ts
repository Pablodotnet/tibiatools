import { describe, it, expect } from 'vitest';
import {
  formatGp,
  formatTc,
  formatMxn,
  parseGpInput,
  calculateForgeTotals,
  calculateTransfer,
  calculateConvergenceFusion,
  calculateConvergenceTransfer,
  runMonteCarloForge,
} from '../exaltationForge';

describe('formatGp', () => {
  it('formats numbers with German locale separators', () => {
    expect(formatGp(1000)).toBe('1.000');
    expect(formatGp(1000000)).toBe('1.000.000');
    expect(formatGp(1234567)).toBe('1.234.567');
  });

  it('returns em dash for non-finite values', () => {
    expect(formatGp(NaN)).toBe('—');
    expect(formatGp(Infinity)).toBe('—');
  });
});

describe('formatTc', () => {
  it('formats with up to 2 decimals', () => {
    expect(formatTc(1000)).toBe('1.000');
    expect(formatTc(1000.5)).toBe('1.000,5');
    expect(formatTc(1000.55)).toBe('1.000,55');
  });
});

describe('formatMxn', () => {
  it('formats with exactly 2 decimals', () => {
    expect(formatMxn(1000)).toBe('1.000,00');
    expect(formatMxn(1000.5)).toBe('1.000,50');
  });
});

describe('parseGpInput', () => {
  it('trims dots, spaces, and commas', () => {
    expect(parseGpInput('1.000')).toBe(1000);
    expect(parseGpInput('1,000')).toBe(1000);
    expect(parseGpInput('1 000')).toBe(1000);
  });

  it('returns 0 for invalid input', () => {
    expect(parseGpInput('abc')).toBe(0);
    expect(parseGpInput('')).toBe(0);
  });
});

describe('calculateForgeTotals', () => {
  const baseParams = {
    desiredTier: 5,
    classification: 4 as const,
    class4GoldByRow: [8000000, 20000000, 40000000, 65000000, 100000000, 250000000, 750000000, 2500000000, 5000000000, 10000000000],
    itemValueGp: 100000000,
    exaltedCoreValueGp: 1000000,
    tcGp: 25000,
    mxnPer250Tc: 210,
    useExaltedCore1: Array(10).fill(true),
    useExaltedCore2: Array(10).fill(true),
  };

  it('returns deterministic totals', () => {
    const result = calculateForgeTotals(baseParams);
    expect(result).toBeDefined();
    expect(result.totalGp).toBeGreaterThan(0);
    expect(result.invalidRowIndices).toEqual([]);
  });

  it('handles desired tier 0 (no fusion needed)', () => {
    const result = calculateForgeTotals({ ...baseParams, desiredTier: 0 });
    expect(result.totalGp).toBe(0);
  });

  it('detects missing forge gold rows', () => {
    const result = calculateForgeTotals({
      ...baseParams,
      classification: 1,
      desiredTier: 5,
    });
    expect(result.invalidRowIndices.length).toBeGreaterThan(0);
  });
});

describe('calculateTransfer', () => {
  it('calculates transfer for valid inputs', () => {
    const result = calculateTransfer({
      sourceTier: 5,
      classification: 4,
      sourceItemValueGp: 100000000,
      targetItemValueGp: 50000000,
      exaltedCoreValueGp: 1000000,
      tcGp: 25000,
      mxnPer250Tc: 210,
    });
    expect(result.isValid).toBe(true);
    expect(result.resultingTier).toBe(4);
    expect(result.totalGp!).toBeGreaterThan(0);
  });

  it('fails for invalid source tier', () => {
    const result = calculateTransfer({
      sourceTier: 0,
      classification: 4,
      sourceItemValueGp: 0,
      targetItemValueGp: 0,
      exaltedCoreValueGp: 0,
      tcGp: 25000,
      mxnPer250Tc: 210,
    });
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });
});

describe('calculateConvergenceFusion', () => {
  it('calculates convergence fusion for valid tier', () => {
    const result = calculateConvergenceFusion({
      currentTier: 3,
      item1ValueGp: 100000000,
      item2ValueGp: 50000000,
      tcGp: 25000,
      mxnPer250Tc: 210,
    });
    expect(result.isValid).toBe(true);
    expect(result.totalGp!).toBeGreaterThan(0);
    expect(result.goldFee!).toBeGreaterThan(0);
    expect(result.item1CostGp).toBe(100000000);
    expect(result.item2CostGp).toBe(50000000);
  });

  it('succeeds for tier 9 (last valid tier step)', () => {
    const result = calculateConvergenceFusion({
      currentTier: 9,
      item1ValueGp: 100000000,
      item2ValueGp: 100000000,
      tcGp: 25000,
      mxnPer250Tc: 210,
    });
    expect(result.isValid).toBe(true);
    expect(result.currentTier).toBe(9);
    expect(result.goldFee).toBeGreaterThan(0);
  });

  it('fails for tier below 0', () => {
    const result = calculateConvergenceFusion({
      currentTier: -1,
      item1ValueGp: 0,
      item2ValueGp: 0,
      tcGp: 25000,
      mxnPer250Tc: 210,
    });
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });
});

describe('calculateConvergenceTransfer', () => {
  it('calculates convergence transfer for valid inputs', () => {
    const result = calculateConvergenceTransfer({
      sourceTier: 5,
      classification: 4,
      sourceItemValueGp: 100000000,
      targetItemValueGp: 50000000,
      exaltedCoreValueGp: 1000000,
      tcGp: 25000,
      mxnPer250Tc: 210,
    });
    expect(result.isValid).toBe(true);
    expect(result.resultingTier).toBe(5);
    expect(result.totalGp!).toBeGreaterThan(0);
  });

  it('fails for tier 0 source', () => {
    const result = calculateConvergenceTransfer({
      sourceTier: 0,
      classification: 4,
      sourceItemValueGp: 0,
      targetItemValueGp: 0,
      exaltedCoreValueGp: 0,
      tcGp: 25000,
      mxnPer250Tc: 210,
    });
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });
});

describe('runMonteCarloForge', () => {
  const baseParams = {
    desiredTier: 3,
    classification: 4 as const,
    class4GoldByRow: [8000000, 20000000, 40000000, 65000000, 100000000, 250000000, 750000000, 2500000000, 5000000000, 10000000000],
    itemValueGp: 100000000,
    exaltedCoreValueGp: 1000000,
    tcGp: 25000,
    mxnPer250Tc: 210,
    useExaltedCore1: Array(10).fill(true),
    useExaltedCore2: Array(10).fill(true),
    runCount: 100,
  };

  it('runs simulation and returns results', () => {
    const result = runMonteCarloForge(baseParams);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.runCount).toBe(100);
      expect(result.average.totalGp).toBeGreaterThan(0);
      expect(result.best.totalGp).toBeGreaterThan(0);
      expect(result.worst.totalGp).toBeGreaterThan(0);
    }
  });

  it('returns null for missing forge gold', () => {
    const result = runMonteCarloForge({
      ...baseParams,
      classification: 1,
      desiredTier: 5,
    });
    expect(result).toBeNull();
  });
});
