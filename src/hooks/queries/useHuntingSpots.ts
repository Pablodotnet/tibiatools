import { useQuery } from '@tanstack/react-query';
import { getAllHuntingSpots, getUserHuntingSpots } from '@/firebase/huntingSpots';
import type { HuntingSpotData } from '@/helpers/huntingSpots';

export function useAllHuntingSpots(vocationId?: string) {
  return useQuery<HuntingSpotData[]>({
    queryKey: ['huntingSpots', 'all', vocationId],
    queryFn: () => getAllHuntingSpots(vocationId),
  });
}

export function useUserHuntingSpots() {
  return useQuery<HuntingSpotData[]>({
    queryKey: ['huntingSpots', 'user'],
    queryFn: getUserHuntingSpots,
  });
}
