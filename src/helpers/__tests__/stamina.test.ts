import { describe, it, expect } from 'vitest';
import { calculateStamina, formatDuration } from '../stamina';

describe('calculateStamina', () => {
  it('returns null for negative stamina', () => {
    expect(calculateStamina(-1, 0)).toBeNull();
  });

  it('caps at 42h', () => {
    const r = calculateStamina(42, 0);
    expect(r?.currentMinutes).toBe(42 * 60);
    expect(r?.minutesToFull).toBe(0);
    expect(r?.minutesToGreen).toBe(0);
  });

  it('over 42h caps at 42h', () => {
    const r = calculateStamina(50, 0);
    expect(r?.currentMinutes).toBe(42 * 60);
    expect(r?.minutesToFull).toBe(0);
  });

  it('30h stamina: needs 600 min at 1:3 then 120 min at 1:10', () => {
    const r = calculateStamina(30, 0);
    expect(r?.currentMinutes).toBe(1800);
    expect(r?.minutesBelowGreen).toBe(600);
    expect(r?.minutesToGreen).toBe(600 * 3); // 1800 min
    expect(r?.minutesToFull).toBe(600 * 3 + 120 * 10); // 1800 + 1200 = 3000
  });

  it('39h stamina: needs 60 min at 1:3 then 120 min at 1:10', () => {
    const r = calculateStamina(39, 0);
    expect(r?.currentMinutes).toBe(2340);
    expect(r?.minutesBelowGreen).toBe(60);
    expect(r?.minutesToGreen).toBe(60 * 3);
    expect(r?.minutesToFull).toBe(60 * 3 + 120 * 10);
  });

  it('40h stamina: already green, needs 120 min at 1:10 to full', () => {
    const r = calculateStamina(40, 0);
    expect(r?.currentMinutes).toBe(2400);
    expect(r?.minutesBelowGreen).toBe(0);
    expect(r?.minutesToGreen).toBe(0);
    expect(r?.minutesToFull).toBe(120 * 10);
  });

  it('41h stamina: needs 60 min at 1:10 to full', () => {
    const r = calculateStamina(41, 0);
    expect(r?.currentMinutes).toBe(2460);
    expect(r?.minutesBelowGreen).toBe(0);
    expect(r?.minutesToGreen).toBe(0);
    expect(r?.minutesToFull).toBe(60 * 10);
  });

  it('handles partial hours with minutes input', () => {
    const r = calculateStamina(30, 30);
    expect(r?.currentMinutes).toBe(1830);
    expect(r?.minutesBelowGreen).toBe(2400 - 1830);
  });
});

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(150)).toBe('2h 30min');
  });

  it('formats only hours', () => {
    expect(formatDuration(120)).toBe('2h');
  });

  it('formats only minutes', () => {
    expect(formatDuration(45)).toBe('45min');
  });
});
