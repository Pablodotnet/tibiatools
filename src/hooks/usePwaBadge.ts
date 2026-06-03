import { useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from '@/firebase/config';

export function usePwaBadge() {
  useEffect(() => {
    if (!('setAppBadge' in navigator) && !('setExperimentalAppBadge' in navigator)) return;

    let cancelled = false;

    async function updateBadge() {
      const user = FirebaseAuth.currentUser;
      if (!user) {
        await clearBadgeInternal();
        return;
      }

      try {
        const q = query(
          collection(FirebaseDB, 'activeImbuements'),
          where('ownerUid', '==', user.uid),
          orderBy('appliedAtMs', 'desc'),
          limit(50),
        );
        const snap = await getDocs(q);
        if (cancelled) return;

        const now = Date.now();
        let expiringCount = 0;
        snap.forEach((doc) => {
          const d = doc.data();
          const elapsed = now - (d.appliedAtMs as number);
          const total = (d.durationHours as number) * 60 * 60 * 1000;
          const remaining = total - elapsed;
          if (remaining > 0 && remaining <= 4 * 60 * 60 * 1000) {
            expiringCount++;
          }
        });

        if (cancelled) return;
        if (expiringCount > 0) {
          const setBadge = navigator.setAppBadge ?? (navigator as { setExperimentalAppBadge?: (n: number) => Promise<void> }).setExperimentalAppBadge;
          if (setBadge) {
            await setBadge.call(navigator, expiringCount);
          } else {
            await clearBadgeInternal();
          }
        } else {
          await clearBadgeInternal();
        }
      } catch {
        await clearBadgeInternal();
      }
    }

    async function clearBadgeInternal() {
      const clearBadgeFn = navigator.clearAppBadge ?? (navigator as { clearExperimentalAppBadge?: () => Promise<void> }).clearExperimentalAppBadge;
      if (clearBadgeFn) {
        await clearBadgeFn.call(navigator);
      }
    }

    updateBadge();
    const interval = setInterval(updateBadge, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
}
