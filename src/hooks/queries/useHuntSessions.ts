import { useQuery } from '@tanstack/react-query';
import { getSessionsForSpot, getRecentSessions, getAllUserSessions } from '@/firebase/huntSessions';
import type { HuntSession } from '@/types/huntSession';

export function useSessionsForSpot(spotId: string) {
  return useQuery<HuntSession[]>({
    queryKey: ['huntSessions', 'spot', spotId],
    queryFn: () => getSessionsForSpot(spotId),
    enabled: !!spotId,
  });
}

export function useRecentSessions(limitCount = 5) {
  return useQuery<HuntSession[]>({
    queryKey: ['huntSessions', 'recent', limitCount],
    queryFn: () => getRecentSessions(limitCount),
  });
}

export function useAllUserSessions() {
  return useQuery<HuntSession[]>({
    queryKey: ['huntSessions', 'allUser'],
    queryFn: getAllUserSessions,
  });
}
