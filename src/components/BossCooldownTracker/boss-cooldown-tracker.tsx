import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BOSSES, BossEntry, computeBossStatus, formatCooldown } from '@/helpers/bosses';
import type { BossCooldownDoc } from '@/firebase/bossCooldowns';
import { getUserBossCooldowns, markBossKilled, clearBossCooldown, clearAllBossCooldowns } from '@/firebase/bossCooldowns';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Clock, CheckCircle2, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { captureError } from '@/lib/monitoring';

export function BossCooldownTracker() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`bossCooldownTracker.${key}`);
  const { user } = useAuth();
  const [cooldowns, setCooldowns] = useState<BossCooldownDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserBossCooldowns();
      setCooldowns(data);
    } catch (e) {
      captureError(e, { context: 'load boss cooldowns' });
      toast.error(tb('loadError'));
    } finally {
      setLoading(false);
    }
  }, [tb]);

  useEffect(() => {
    load();
  }, [load]);

  const getKilledAt = (bossKey: string): number | null => {
    const entry = cooldowns.find((c) => c.bossKey === bossKey);
    return entry ? entry.killedAtMs : null;
  };

  const handleMark = async (bossKey: string) => {
    setMarking(bossKey);
    try {
      await markBossKilled(bossKey);
      await load();
      toast.success(tb('marked'));
    } catch (e) {
      captureError(e, { context: 'mark boss killed' });
      toast.error(tb('markError'));
    } finally {
      setMarking(null);
    }
  };

  const handleClear = async (bossKey: string) => {
    const entry = cooldowns.find((c) => c.bossKey === bossKey);
    if (!entry) return;
    try {
      await clearBossCooldown(entry.id);
      await load();
      toast.success(tb('cleared'));
    } catch (e) {
      captureError(e, { context: 'clear boss cooldown' });
      toast.error(tb('clearError'));
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllBossCooldowns();
      await load();
      toast.success(tb('clearedAll'));
    } catch (e) {
      captureError(e, { context: 'clear all boss cooldowns' });
      toast.error(tb('clearError'));
    }
  };

  const renderBossRow = (boss: BossEntry) => {
    const killedAt = getKilledAt(boss.key);
    const status = computeBossStatus(boss, killedAt, now);
    return (
      <tr key={boss.key} className='border-b'>
        <td className='px-3 py-2 font-medium'>{boss.name}</td>
        <td className='px-3 py-2 text-sm text-muted-foreground'>{boss.location || '—'}</td>
        <td className='px-3 py-2 text-sm text-muted-foreground'>{boss.cooldownHours}h</td>
        <td className='px-3 py-2'>
          {status.available ? (
            <span className='inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400'>
              <CheckCircle2 className='size-3.5' />
              {tb('available')}
            </span>
          ) : (
            <span className='inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400'>
              <Clock className='size-3.5' />
              {formatCooldown(status.remainingMs)}
            </span>
          )}
        </td>
        <td className='px-3 py-2'>
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleMark(boss.key)}
              disabled={marking === boss.key}
              className='h-7 text-xs'
            >
              {marking === boss.key ? <Loader2 className='size-3 animate-spin' /> : <RotateCcw className='size-3' />}
              {tb('markKilled')}
            </Button>
            {!status.available && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleClear(boss.key)}
                className='h-7 text-xs text-muted-foreground'
              >
                <Trash2 className='size-3' />
              </Button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  const bosses = BOSSES.filter((b) => b.category === 'boss');
  const raids = BOSSES.filter((b) => b.category === 'raid');
  const hasCooldowns = cooldowns.length > 0;

  return (
    <div className='space-y-6'>
      {user && hasCooldowns && (
        <div className='flex justify-end'>
          <Button variant='ghost' size='sm' onClick={handleClearAll} className='h-7 text-xs text-muted-foreground'>
            <Trash2 className='size-3 mr-1' />
            {tb('clearAll')}
          </Button>
        </div>
      )}

      <div>
        <h3 className='text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide'>{tb('bosses')}</h3>
        <div className='rounded-md border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b bg-muted/50'>
                <th className='px-3 py-2 text-left font-medium'>{tb('name')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('location')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('cooldown')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('status')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('action')}</th>
              </tr>
            </thead>
            <tbody>
              {bosses.length === 0 ? (
                <tr><td colSpan={5} className='px-3 py-4 text-center text-muted-foreground'>{tb('noBosses')}</td></tr>
              ) : bosses.map(renderBossRow)}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className='text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide'>{tb('raids')}</h3>
        <div className='rounded-md border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b bg-muted/50'>
                <th className='px-3 py-2 text-left font-medium'>{tb('name')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('location')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('cooldown')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('status')}</th>
                <th className='px-3 py-2 text-left font-medium'>{tb('action')}</th>
              </tr>
            </thead>
            <tbody>
              {raids.length === 0 ? (
                <tr><td colSpan={5} className='px-3 py-4 text-center text-muted-foreground'>{tb('noRaids')}</td></tr>
              ) : raids.map(renderBossRow)}
            </tbody>
          </table>
        </div>
      </div>

      {!user && (
        <p className='text-sm text-muted-foreground text-center py-4'>{tb('loginRequired')}</p>
      )}
    </div>
  );
}
