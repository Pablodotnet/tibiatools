import { useQuery } from '@tanstack/react-query';
import { getRecentSessions } from '@/firebase/huntSessions';
import type { HuntSession } from '@/types/huntSession';

export function useRecentSessions(limitCount = 5) {
  return useQuery<HuntSession[]>({
    queryKey: ['huntSessions', 'recent', limitCount],
    queryFn: () => getRecentSessions(limitCount),
  });
}


