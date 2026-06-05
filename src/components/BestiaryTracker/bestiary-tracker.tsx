import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BESTIARY_MONSTERS, CHARMS, calculateCharmPoints, type Difficulty } from '@/helpers/bestiary';
import type { BestiaryProgressDoc } from '@/firebase/bestiaryProgress';
import { getUserBestiaryProgress, setBestiaryCompletion } from '@/firebase/bestiaryProgress';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreFetch } from '@/hooks/useFirestoreFetch';
import { Loader2, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { captureError, captureEvent } from '@/lib/monitoring';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard', 'very_hard', 'boss'];

export function BestiaryTracker() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`bestiary.${key}`);
  const { user } = useAuth();

  const { data: progressData, loading, refresh } = useFirestoreFetch<BestiaryProgressDoc[]>(getUserBestiaryProgress, { context: 'load bestiary progress', errorKey: 'bestiary.loadError' });
  const progress = useMemo(() => progressData ?? [], [progressData]);
  const [toggling, setToggling] = useState<string | null>(null);

  const completedKeys = useMemo(() => progress.filter((p) => p.completed).map((p) => p.monsterKey), [progress]);
  const charmPoints = useMemo(() => calculateCharmPoints(completedKeys), [completedKeys]);
  const completionByDifficulty = useMemo(() => {
    const counts: Record<string, { done: number; total: number }> = {};
    for (const d of DIFFICULTY_ORDER) {
      const monsters = BESTIARY_MONSTERS.filter((m) => m.difficulty === d);
      counts[d] = { done: monsters.filter((m) => completedKeys.includes(m.key)).length, total: monsters.length };
    }
    return counts;
  }, [completedKeys]);

  const affordableCharms = useMemo(() => {
    return CHARMS.map((c) => ({ ...c, affordable: charmPoints >= c.cost }));
  }, [charmPoints]);

  const handleToggle = async (monsterKey: string, currentlyCompleted: boolean) => {
    setToggling(monsterKey);
    try {
      await setBestiaryCompletion(monsterKey, !currentlyCompleted);
      captureEvent('bestiary_toggled', { monsterKey, completed: !currentlyCompleted });
      await refresh();
    } catch (e) {
      captureError(e, { context: 'toggle bestiary' });
      toast.error(tb('toggleError'));
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return <div className='flex items-center justify-center py-8'><Loader2 className='size-6 animate-spin text-muted-foreground' /></div>;
  }

  return (
    <div className='space-y-6'>
      {!user && <p className='text-sm text-muted-foreground text-center py-4'>{tb('loginRequired')}</p>}

      {/* Charm Points Summary */}
      <div className='rounded-md border p-4 flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium'>{tb('charmPoints')}</p>
          <p className='text-xs text-muted-foreground'>{tb('charmPointsDesc')}</p>
        </div>
        <span className='text-2xl font-bold tabular-nums text-foreground'>{charmPoints}</span>
      </div>

      {/* Difficulty cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2'>
        {DIFFICULTY_ORDER.map((d) => (
          <div key={d} className='rounded-md border p-3 text-center'>
            <p className='text-xs font-medium text-muted-foreground uppercase'>{tb(`diff_${d}`)}</p>
            <p className='text-lg font-bold tabular-nums'>
              {completionByDifficulty[d].done}<span className='text-muted-foreground text-sm font-normal'>/{completionByDifficulty[d].total}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Monster list grouped by difficulty */}
      {DIFFICULTY_ORDER.map((d) => {
        const monsters = BESTIARY_MONSTERS.filter((m) => m.difficulty === d);
        if (monsters.length === 0) return null;
        return (
          <div key={d}>
            <h2 className='text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide'>
              {tb(`diff_${d}`)} ({completionByDifficulty[d].done}/{completionByDifficulty[d].total})
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5'>
              {monsters.map((monster) => {
                const isCompleted = completedKeys.includes(monster.key);
                const isToggling = toggling === monster.key;
                return (
                  <button
                    key={monster.key}
                    onClick={user ? () => handleToggle(monster.key, isCompleted) : undefined}
                    disabled={!user || isToggling}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer w-full
                      ${isCompleted ? 'bg-success/10 border border-success/30' : 'bg-muted/30 border border-transparent hover:bg-muted/50'}
                      ${!user ? 'cursor-default' : ''}`}
                  >
                    {isToggling ? (
                      <Loader2 className='size-4 animate-spin shrink-0' />
                    ) : isCompleted ? (
                      <CheckCircle2 className='size-4 text-success shrink-0' />
                    ) : (
                      <Circle className='size-4 text-muted-foreground shrink-0' />
                    )}
                    <span className={isCompleted ? 'font-medium' : ''}>{monster.name}</span>
                    <span className='ml-auto text-xs text-muted-foreground'>{monster.charmPoints} pts</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <Separator />

      {/* Charm Expansion Calculator */}
      <div>
        <h2 className='text-sm font-semibold mb-3 flex items-center gap-1.5'>
          <Sparkles className='size-4 text-amber-500' />
          {tb('charmShop')}
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
          {affordableCharms.map((charm) => {
            const canAfford = charm.affordable;
            return (
              <div
                key={charm.key}
                className={`rounded-md border p-3 ${canAfford ? 'border-success/30 bg-success/5' : 'opacity-60'}`}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>{charm.name}</span>
                  <span className={`text-xs font-semibold tabular-nums ${canAfford ? 'text-success' : 'text-muted-foreground'}`}>
                    {charm.cost} pts
                  </span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>{charm.description}</p>
                <span className='text-[10px] uppercase text-muted-foreground mt-1 block'>{tb(`type_${charm.type}`)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
