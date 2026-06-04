import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActiveImbuementDoc } from '@/firebase/activeImbuements';
import { getUserImbuements, addImbuement, removeImbuement } from '@/firebase/activeImbuements';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreFetch, useClock } from '@/hooks/useFirestoreFetch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { captureError, captureEvent } from '@/lib/monitoring';

const IMBUE_DURATIONS: Record<string, number> = {
  basic: 20,
  intricate: 55,
  powerful: 100,
};

const SLOT_KEYS = ['weapon', 'helmet', 'armor', 'shield', 'spellbook', 'boots', 'amulet', 'ring', 'bow', 'crossbow'];

export function ImbuementTracker() {
  const { t } = useTranslation();
  const ti = (key: string) => t(`imbuementTracker.${key}`);
  const { user } = useAuth();

  const { data: imbuementsData, loading, refresh } = useFirestoreFetch<ActiveImbuementDoc[]>(getUserImbuements, { context: 'load imbuements', errorKey: 'imbuementTracker.loadError' });
  const imbuements = imbuementsData ?? [];
  const now = useClock();
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [newSlot, setNewSlot] = useState('');
  const [newTier, setNewTier] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleAdd = async () => {
    if (!newSlot || !newTier) {
      toast.error(ti('selectRequired'));
      return;
    }
    setAdding(true);
    try {
      const durationHours = IMBUE_DURATIONS[newTier] || 20;
      await addImbuement({ slot: newSlot, tier: newTier, durationHours, note: newNote || undefined });
      await refresh();
      setNewSlot('');
      setNewTier('');
      setNewNote('');
      captureEvent('imbuement_added', { slot: newSlot, tier: newTier });
      toast.success(ti('added'));
    } catch (e) {
      captureError(e, { context: 'add imbuement' });
      toast.error(ti('addError'));
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (docId: string) => {
    setRemovingId(docId);
    try {
      await removeImbuement(docId);
      await refresh();
      toast.success(ti('removed'));
    } catch (e) {
      captureError(e, { context: 'remove imbuement' });
      toast.error(ti('removeError'));
    } finally {
      setRemovingId(null);
    }
  };

  const getStatus = (imb: ActiveImbuementDoc) => {
    const elapsedMs = now - imb.appliedAtMs;
    const totalMs = imb.durationHours * 60 * 60 * 1000;
    const remainingMs = Math.max(0, totalMs - elapsedMs);
    const remainingHours = remainingMs / (1000 * 60 * 60);
    const expired = remainingMs <= 0;
    const expiringSoon = !expired && remainingHours <= 4;
    return { remainingMs, remainingHours, expired, expiringSoon };
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  const activeList = imbuements.filter((imb) => !getStatus(imb).expired);
  const expiredList = imbuements.filter((imb) => getStatus(imb).expired);

  return (
    <div className='space-y-6'>
      {user && (
        <div className='rounded-md border p-4 space-y-3'>
          <h3 className='text-sm font-semibold'>{ti('addNew')}</h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{ti('slot')}</Label>
              <Select value={newSlot} onValueChange={setNewSlot}>
                <SelectTrigger className='h-8'>
                  <SelectValue placeholder={ti('slotPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {SLOT_KEYS.map((slot) => (
                    <SelectItem key={slot} value={slot}>{ti(`slot_${slot}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{ti('tier')}</Label>
              <Select value={newTier} onValueChange={setNewTier}>
                <SelectTrigger className='h-8'>
                  <SelectValue placeholder={ti('tierPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(IMBUE_DURATIONS).map((tier) => (
                    <SelectItem key={tier} value={tier}>{ti(`tier_${tier}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>{ti('note')}</Label>
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={ti('notePlaceholder')}
                className='h-8'
              />
            </div>
          </div>
          <Button size='sm' onClick={handleAdd} disabled={adding || !newSlot || !newTier}>
            {adding ? <Loader2 className='size-3 animate-spin mr-1' /> : null}
            {ti('add')}
          </Button>
        </div>
      )}

      <Separator />

      {activeList.length > 0 && (
        <div>
          <h3 className='text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide'>{ti('active')} ({activeList.length})</h3>
          <div className='space-y-2'>
            {activeList.map((imb) => {
              const status = getStatus(imb);
              return (
                <div key={imb.id} className={`flex items-center justify-between rounded-md border p-3 ${status.expiringSoon ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                  <div className='flex items-center gap-3'>
                    {status.expiringSoon && <AlertTriangle className='size-4 text-amber-500 shrink-0' />}
                    {!status.expiringSoon && <Clock className='size-4 text-muted-foreground shrink-0' />}
                    <div>
                      <p className='text-sm font-medium'>{ti(`slot_${imb.slot}`)} — {ti(`tier_${imb.tier}`)}</p>
                      <p className='text-xs text-muted-foreground'>
                        {status.expiringSoon ? (
                          <span className='text-amber-600 dark:text-amber-400 font-medium'>
                            {ti('expiringSoon')}: {status.remainingHours.toFixed(1)}h
                          </span>
                        ) : (
                          <span>{status.remainingHours.toFixed(1)}h / {imb.durationHours}h {ti('remaining')}</span>
                        )}
                      </p>
                      {imb.note && <p className='text-xs text-muted-foreground mt-0.5'>{imb.note}</p>}
                    </div>
                  </div>
                  {user && (
                    <Button variant='ghost' size='sm' onClick={() => handleRemove(imb.id)} disabled={removingId === imb.id} className='h-7 text-xs text-muted-foreground' aria-label='Remove imbuement'>
                      {removingId === imb.id ? <Loader2 className='size-3 animate-spin' /> : <Trash2 className='size-3' />}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeList.length === 0 && expiredList.length === 0 && (
        <p className='text-sm text-muted-foreground text-center py-4'>{ti('empty')}</p>
      )}

      {expiredList.length > 0 && (
        <div>
          <h3 className='text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide'>{ti('expired')} ({expiredList.length})</h3>
          <div className='space-y-2'>
            {expiredList.map((imb) => (
              <div key={imb.id} className='flex items-center justify-between rounded-md border border-muted p-3 opacity-60'>
                <div>
                  <p className='text-sm font-medium'>{ti(`slot_${imb.slot}`)} — {ti(`tier_${imb.tier}`)}</p>
                  {imb.note && <p className='text-xs text-muted-foreground mt-0.5'>{imb.note}</p>}
                </div>
                {user && (
                  <Button variant='ghost' size='sm' onClick={() => handleRemove(imb.id)} disabled={removingId === imb.id} className='h-7 text-xs' aria-label='Remove expired imbuement'>
                    {removingId === imb.id ? <Loader2 className='size-3 animate-spin' /> : <Trash2 className='size-3' />}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!user && (
        <p className='text-sm text-muted-foreground text-center py-4'>{ti('loginRequired')}</p>
      )}
    </div>
  );
}
