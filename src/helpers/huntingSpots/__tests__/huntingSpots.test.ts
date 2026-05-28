import { describe, it, expect } from 'vitest';
import { huntingSpotsByVocation } from '../index';
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
      expect(spot.expRaw).toBeTruthy();
      expect(spot.expBonus).toBeTruthy();
      expect(spot.loot).toBeTruthy();
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
});
