import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { captureError } from '@/lib/monitoring';
import { toast } from 'sonner';

export function useFirestoreFetch<T>(
  fetcher: () => Promise<T>,
  options?: { context?: string; errorKey?: string },
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const context = options?.context ?? 'firestoreFetch';
  const errorKey = options?.errorKey ?? 'common.loadError';

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      captureError(e, { context });
      const msg = e instanceof Error ? `${t(errorKey)}: ${e.message}` : t(errorKey);
      toast.error(msg, {
        action: {
          label: t('common.retry'),
          onClick: () => refresh(),
        },
      });
    } finally {
      setLoading(false);
    }
  }, [context, errorKey, fetcher, t]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useClock(refreshMs = 60_000): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), refreshMs);
    return () => clearInterval(interval);
  }, [refreshMs]);
  return now;
}
