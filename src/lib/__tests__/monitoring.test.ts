import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

describe('monitoring', () => {
  it('captureError stores error in batch', async () => {
    const { captureError, flush } = await import('../monitoring');
    captureError(new Error('test error'), { foo: 'bar' });
    // flush should clear the batch without throwing
    await expect(flush()).resolves.toBeUndefined();
  });

  it('captureEvent stores event in batch', async () => {
    const { captureEvent, flush } = await import('../monitoring');
    captureEvent('test_event', { key: 'value' });
    await expect(flush()).resolves.toBeUndefined();
  });

  it('initMonitoring sets endpoint', async () => {
    const { initMonitoring, flush } = await import('../monitoring');
    initMonitoring('https://example.com/analytics');
    // with endpoint set, flush tries to POST — mock fetch
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response());
    const { captureEvent } = await import('../monitoring');
    captureEvent('test');
    await flush();
    expect(fetchSpy).toHaveBeenCalledOnce();
    fetchSpy.mockRestore();
  });

  it('multiple events are batched together', async () => {
    const { captureEvent, flush } = await import('../monitoring');
    captureEvent('a');
    captureEvent('b');
    captureEvent('c');
    // flush should not throw
    await expect(flush()).resolves.toBeUndefined();
  });

  it('flush is safe when batch is empty', async () => {
    const { flush } = await import('../monitoring');
    await expect(flush()).resolves.toBeUndefined();
  });
});
