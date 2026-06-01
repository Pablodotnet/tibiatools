export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.error('[monitoring]', error, context);
  }
}

export function captureEvent(name: string, data?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.log('[monitoring]', name, data);
  }
}
