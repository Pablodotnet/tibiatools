export function safeStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

export function safeNum(v: unknown, fallback = 0): number {
  return typeof v === 'number' ? v : fallback;
}

export function safeBool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

export function safeArr<T>(v: unknown, fallback: T[] = []): T[] {
  return Array.isArray(v) ? v : fallback;
}

export function safeLevelRange(v: unknown): [number, number] {
  if (Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number') return [v[0], v[1]];
  return [0, 0];
}

export function optNum(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

export function optStr(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

export function toMs(v: unknown): number {
  if (v && typeof v === 'object' && 'toDate' in v && typeof (v as { toDate: () => Date }).toDate === 'function') return (v as { toDate: () => Date }).toDate().getTime();
  if (typeof v === 'number') return v;
  return Date.now();
}

export function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      out[k] = v.map((item) =>
        item && typeof item === 'object' && !Array.isArray(item)
          ? Object.fromEntries(Object.entries(item).filter(([, vi]) => vi !== undefined))
          : item,
      );
    } else {
      out[k] = v;
    }
  }
  return out;
}
