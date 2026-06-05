import { memo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BOSSES, BossEntry, computeBossStatus, formatCooldown } from '@/helpers/bosses';
import type { BossCooldownDoc } from '@/firebase/bossCooldowns';
import { getUserBossCooldowns, markBossKilled, clearBossCooldown, clearAllBossCooldowns } from '@/firebase/bossCooldowns';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreFetch, useClock } from '@/hooks/useFirestoreFetch';
import { Loader2, Clock, CheckCircle2, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { captureError, captureEvent } from '@/lib/monitoring';

interface BossRowProps {
  boss: BossEntry;
  killedAt: number | null;
  marking: string | null;
  clearingBoss: string | null;
  now: number;
  onMark: (key: string) => void;
  onClear: (key: string) => void;
  t: (key: string) => string;
}

const BossRow = memo(function BossRow({ boss, killedAt, marking, clearingBoss, now, onMark, onClear, t }: BossRowProps) {
  const status = computeBossStatus(boss, killedAt, now);
  return (
    <tr className='border-b'>
      <td className='px-3 py-2 font-medium'>{boss.name}</td>
      <td className='px-3 py-2 text-sm text-muted-foreground'>{boss.location || '—'}</td>
      <td className='px-3 py-2 text-sm text-muted-foreground'>{boss.cooldownHours}h</td>
      <td className='px-3 py-2'>
        {status.available ? (
          <span className='inline-flex items-center gap-1 text-sm font-medium text-success'>
            <CheckCircle2 className='size-3.5' />
            {t('available')}
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 text-sm font-medium text-warning'>
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
            onClick={() => onMark(boss.key)}
            disabled={marking === boss.key}
            className='text-xs'
          >
            {marking === boss.key ? <Loader2 className='size-3 animate-spin' /> : <RotateCcw className='size-3' />}
            {t('markKilled')}
          </Button>
          {!status.available && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onClear(boss.key)}
              disabled={clearingBoss === boss.key || marking === boss.key}
              className='text-xs text-muted-foreground'
              aria-label='Clear cooldown'
            >
              {clearingBoss === boss.key ? <Loader2 className='size-3 animate-spin' /> : <Trash2 className='size-3' />}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
});

export function BossCooldownTracker() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`bossCooldownTracker.${key}`);
  const { user } = useAuth();
  const { data: cooldownsData, loading, refresh } = useFirestoreFetch<BossCooldownDoc[]>(getUserBossCooldowns, { context: 'load boss cooldowns', errorKey: 'bossCooldownTracker.loadError' });
  const cooldowns = cooldownsData ?? [];
  const [marking, setMarking] = useState<string | null>(null);
  const [clearingBoss, setClearingBoss] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const now = useClock();

  const getKilledAt = (bossKey: string): number | null => {
    const entry = cooldowns.find((c) => c.bossKey === bossKey);
    return entry ? entry.killedAtMs : null;
  };


  const handleClearAll = async () => {
    setClearingAll(true);
    try {
      await clearAllBossCooldowns();
      await refresh();
      toast.success(tb('clearedAll'));
    } catch (e) {
      captureError(e, { context: 'clear all boss cooldowns' });
      toast.error(tb('clearError'));
    } finally {
      setClearingAll(false);
    }
  };

  const handleMark = useCallback((key: string) => {
    setMarking(key);
    (async () => {
      try {
        await markBossKilled(key);
        await refresh();
        setMarking(null);
        toast.success(tb('marked'));
        captureEvent('boss_marked', { key });
      } catch (e) {
        captureError(e, { context: 'mark boss killed' });
        toast.error(tb('markError'));
        setMarking(null);
      }
    })();
  }, [refresh]);

  const handleClear = useCallback(async (key: string) => {
    const entry = cooldowns.find((c) => c.bossKey === key);
    if (!entry) return;
    setClearingBoss(key);
    try {
      await clearBossCooldown(entry.id);
      await refresh();
      toast.success(tb('cleared'));
    } catch (e) {
      captureError(e, { context: 'clear boss cooldown' });
      toast.error(tb('clearError'));
    } finally {
      setClearingBoss(null);
    }
  }, [cooldowns, refresh]);

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
    <div className='flex flex-col gap-6'>
      {user && hasCooldowns && (
        <div className='flex justify-end'>
          <Button variant='ghost' size='sm' onClick={handleClearAll} disabled={clearingAll} className='text-xs text-muted-foreground'>
            {clearingAll ? <Loader2 className='size-3 animate-spin mr-1' /> : <Trash2 className='size-3 mr-1' />}
            {tb('clearAll')}
          </Button>
        </div>
      )}

      <div>
        <h2 className='text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide'>{tb('bosses')}</h2>
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
              ) : bosses.map((boss) => (
                <BossRow
                  key={boss.key}
                  boss={boss}
                  killedAt={getKilledAt(boss.key)}
                  marking={marking}
                  clearingBoss={clearingBoss}
                  now={now}
                  onMark={handleMark}
                  onClear={handleClear}
                  t={tb}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className='text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide'>{tb('raids')}</h2>
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
              ) : raids.map((raid) => (
                <BossRow
                  key={raid.key}
                  boss={raid}
                  killedAt={getKilledAt(raid.key)}
                  marking={marking}
                  clearingBoss={clearingBoss}
                  now={now}
                  onMark={handleMark}
                  onClear={handleClear}
                  t={tb}
                />
              ))}
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
