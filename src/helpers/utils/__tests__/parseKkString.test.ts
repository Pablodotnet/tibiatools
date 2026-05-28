import { describe, it, expect } from 'vitest';
import { parseKkString } from '../parseKkString';

describe('parseKkString', () => {
  it('parses plain numbers', () => {
    expect(parseKkString('1')).toBe(1);
    expect(parseKkString('100')).toBe(100);
    expect(parseKkString('1000')).toBe(1000);
  });

  it('parses k suffix as thousands', () => {
    expect(parseKkString('1k')).toBe(1000);
    expect(parseKkString('10k')).toBe(10000);
    expect(parseKkString('250k')).toBe(250000);
  });

  it('parses kk suffix as millions', () => {
    expect(parseKkString('1kk')).toBe(1000000);
    expect(parseKkString('10kk')).toBe(10000000);
    expect(parseKkString('250kk')).toBe(250000000);
  });

  it('parses kkk suffix as billions', () => {
    expect(parseKkString('1kkk')).toBe(1000000000);
    expect(parseKkString('2.5kkk')).toBe(2500000000);
  });

  it('handles decimal values', () => {
    expect(parseKkString('1.5k')).toBe(1500);
    expect(parseKkString('2.5kk')).toBe(2500000);
  });

  it('returns NaN for invalid strings', () => {
    expect(parseKkString('abc')).toBeNaN();
    expect(parseKkString('12k3')).toBeNaN();
    expect(parseKkString('')).toBeNaN();
  });

  it('handles comma-separated thousands', () => {
    expect(parseKkString('1,000')).toBe(1000);
    expect(parseKkString('1,000,000')).toBe(1000000);
  });
});
