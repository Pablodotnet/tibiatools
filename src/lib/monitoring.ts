type EventPayload = {
  name: string;
  data?: Record<string, unknown>;
  timestamp: number;
};

type ErrorPayload = {
  error: string;
  context?: Record<string, unknown>;
  timestamp: number;
};

let endpoint = '';
let batch: (EventPayload | ErrorPayload)[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 30_000;

export function initMonitoring(url: string): void {
  endpoint = url;
}

function enqueue(payload: EventPayload | ErrorPayload): void {
  batch.push(payload);
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flush();
    }, FLUSH_INTERVAL);
  }
}

export async function flush(): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (batch.length === 0) return;
  const snapshot = batch;
  batch = [];
  if (endpoint) {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
        keepalive: true,
      });
    } catch {
      // silently fail — monitoring should never throw
    }
  } else if (import.meta.env.DEV) {
    snapshot.forEach((p) => {
      if ('error' in p) {
        console.error('[monitoring]', p.error, p.context);
      } else {
        console.log('[monitoring]', p.name, p.data);
      }
    });
  }
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  const message = error instanceof Error ? error.message : String(error);
  enqueue({ error: message, context, timestamp: Date.now() });
}

export function captureEvent(name: string, data?: Record<string, unknown>): void {
  enqueue({ name, data, timestamp: Date.now() });
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (batch.length > 0) {
      const snapshot = batch;
      batch = [];
      if (endpoint) {
        navigator.sendBeacon(endpoint, JSON.stringify(snapshot));
      }
    }
  });
}
