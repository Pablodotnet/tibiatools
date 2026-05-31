import { describe, it, expect } from 'vitest';
import { huntingSpotsByVocation, formatRate, formatProfit, calculateHoursToNextLevel, formatHours } from '../index';
import { vocations } from '../../vocations';

describe('huntingSpotsByVocation', () => {
  it('has data for each vocation', () => {
    for (const v of vocations) {
      const spots = huntingSpotsByVocation[v.id];
      expect(spots).toBeDefined();
      expect(spots.length).toBeGreaterThan(0);
    }
  });

  it('each spot has required fields', () => {
    const allSpots = Object.values(huntingSpotsByVocation).flat();
    for (const spot of allSpots) {
      expect(spot.id).toBeTruthy();
      expect(spot.name).toBeTruthy();
      expect(spot.levelRange).toHaveLength(2);
      expect(spot.levelRange[0]).toBeLessThanOrEqual(spot.levelRange[1]);
      expect(spot.location).toBeTruthy();
      expect(spot.expRaw).toBeGreaterThan(0);
      expect(spot.expBonus).toBeGreaterThan(0);
      expect(typeof spot.profit).toBe('number');
      expect(spot.supplyCost).toBeGreaterThanOrEqual(0);
      expect(spot.set).toBeTruthy();
      expect(Array.isArray(spot.imbuements)).toBe(true);
    }
  });

  it('has no duplicate spot IDs', () => {
    const allSpots = Object.values(huntingSpotsByVocation).flat();
    const ids = allSpots.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each spot belongs to a valid vocation', () => {
    const vocationIds = vocations.map((v) => v.id);
    for (const vocationId of Object.keys(huntingSpotsByVocation)) {
      expect(vocationIds).toContain(vocationId);
    }
  });

  it('has at least 8 spots per vocation', () => {
    for (const v of vocations) {
      const spots = huntingSpotsByVocation[v.id];
      expect(spots.length).toBeGreaterThanOrEqual(8);
    }
  });
});

describe('formatRate', () => {
  it('formats thousands', () => {
    expect(formatRate(400_000)).toBe('400k/h');
  });

  it('formats millions', () => {
    expect(formatRate(1_500_000)).toBe('1.5kk/h');
    expect(formatRate(3_000_000)).toBe('3kk/h');
  });
});

describe('formatProfit', () => {
  it('formats positive profit', () => {
    expect(formatProfit(100_000)).toBe('100k/h');
    expect(formatProfit(1_500_000)).toBe('1.5kk/h');
  });

  it('formats negative profit', () => {
    expect(formatProfit(-50_000)).toBe('-50k/h');
  });
});

describe('calculateHoursToNextLevel', () => {
  it('returns null for invalid input', () => {
    expect(calculateHoursToNextLevel(0, 0, 500_000)).toBeNull();
    expect(calculateHoursToNextLevel(50, 0, 0)).toBeNull();
  });

  it('returns a positive number for valid input', () => {
    const hours = calculateHoursToNextLevel(100, 0, 1_000_000);
    expect(hours).toBeGreaterThan(0);
  });
});

describe('formatHours', () => {
  it('formats hours and minutes', () => {
    expect(formatHours(1.5)).toBe('1h 30m');
    expect(formatHours(0.5)).toBe('30 min');
    expect(formatHours(2)).toBe('2h');
  });
});
