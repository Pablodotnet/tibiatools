import { describe, it, expect } from 'vitest';
import { computeBossStatus, formatCooldown, BOSSES } from '../bosses';

describe('computeBossStatus', () => {
  const boss = BOSSES[0];

  it('returns available when never killed', () => {
    const status = computeBossStatus(boss, null);
    expect(status.available).toBe(true);
    expect(status.remainingMs).toBe(0);
  });

  it('returns unavailable when cooldown not elapsed', () => {
    const killedAt = Date.now() - 60 * 60 * 1000; // 1h ago
    const status = computeBossStatus(boss, killedAt);
    expect(status.available).toBe(false);
    expect(status.remainingMs).toBeGreaterThan(0);
  });

  it('returns available when cooldown elapsed', () => {
    const killedAt = Date.now() - boss.cooldownHours * 60 * 60 * 1000 - 1000;
    const status = computeBossStatus(boss, killedAt);
    expect(status.available).toBe(true);
    expect(status.remainingMs).toBe(0);
  });
});

describe('formatCooldown', () => {
  it('formats available', () => {
    expect(formatCooldown(0)).toBe('Available');
  });

  it('formats days and hours', () => {
    expect(formatCooldown(50 * 60 * 60 * 1000)).toBe('2d 2h');
  });

  it('formats hours', () => {
    expect(formatCooldown(5 * 60 * 60 * 1000)).toBe('5h');
  });

  it('formats minutes', () => {
    expect(formatCooldown(30 * 60 * 1000)).toBe('30min');
  });
});
