import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { parseHuntSession } from '@/helpers/huntSessionParser';
import { addHuntSession } from '@/firebase/huntSessions';
import { formatProfit, formatRate } from '@/helpers/huntingSpots';
import { toast } from 'sonner';
import { captureError } from '@/lib/monitoring';
import { Users, User, Clock, Swords, HeartPulse, Shield, Coins, PackageOpen, Zap, PartyPopper, Upload } from 'lucide-react';

export function HuntSessionUploadDialog({
  spotId,
  spotName,
  onSubmit,
}: {
  spotId: string;
  spotName: string;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();
  const te = (key: string) => t(`huntSessionUpload.${key}`);
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const parsed = rawText.trim() ? parseHuntSession(rawText) : null;

  const handleSubmit = async () => {
    if (!rawText.trim()) {
      toast.error(te('pasteFirst'));
      return;
    }
    if (!parsed || (!parsed.loot && !parsed.xpGain)) {
      toast.error(te('parseFailed'));
      return;
    }

    setSubmitting(true);
    try {
      await addHuntSession({
        spotId,
        spotName,
        isParty: parsed.isParty,
        sessionDate: parsed.sessionDate,
        durationMinutes: parsed.durationMinutes,
        vocation: parsed.vocation,
        level: parsed.level,
        damage: parsed.damage,
        healing: parsed.healing,
        damageReceived: parsed.damageReceived,
        loot: parsed.loot,
        supplies: parsed.supplies,
        balance: parsed.balance,
        xpGain: parsed.xpGain,
        xpPerHour: parsed.xpPerHour,
        players: parsed.players,
        killedMonsters: parsed.killedMonsters,
        rawText: rawText,
      });
      toast.success(te('sessionAdded'));
      setRawText('');
      setOpen(false);
      onSubmit();
    } catch (e) {
      captureError(e, { context: 'addHuntSession', spotId });
      toast.error(te('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm' className='gap-1.5'>
          <Upload size={14} />
          {te('uploadSession')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='max-h-[90vh] overflow-y-auto max-w-lg'>
        <AlertDialogHeader>
          <AlertDialogTitle>{te('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {te('description')} <strong>{spotName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-3'>
          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>{te('pasteLabel')}</Label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className='flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 font-mono'
              placeholder={te('pastePlaceholder')}
            />
          </div>

          {parsed && (
            <>
              <Separator />
              <div className='text-xs font-medium text-muted-foreground'>{te('preview')}</div>

              <div className='rounded-md border bg-muted/30 p-3 space-y-2'>
                <div className='flex items-center gap-2 text-sm'>
                  {parsed.isParty ? (
                    <PartyPopper className='size-4 text-blue-500' />
                  ) : (
                    <User className='size-4 text-muted-foreground' />
                  )}
                  <span className='font-medium'>{parsed.isParty ? te('partyHunt') : te('soloHunt')}</span>
                  {parsed.vocation && <span className='text-muted-foreground'>&middot; {parsed.vocation}</span>}
                  {parsed.level && <span className='text-muted-foreground'>&middot; {te('level')} {parsed.level}</span>}
                  {parsed.durationMinutes && (
                    <span className='text-muted-foreground ml-auto tabular-nums'>
                      <Clock className='size-3 inline mr-1' />
                      {Math.floor(parsed.durationMinutes / 60)}h {parsed.durationMinutes % 60}min
                    </span>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs'>
                  {parsed.loot !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <Coins className='size-3' /> {te('loot')}
                      </span>
                      <span className='tabular-nums text-right font-medium text-green-600 dark:text-green-400'>
                        {formatProfit(parsed.loot)}
                      </span>
                    </>
                  )}
                  {parsed.supplies !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <PackageOpen className='size-3' /> {te('supplies')}
                      </span>
                      <span className='tabular-nums text-right font-medium text-destructive'>
                        {formatProfit(parsed.supplies)}
                      </span>
                    </>
                  )}
                  {parsed.balance !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <Coins className='size-3' /> {te('balance')}
                      </span>
                      <span className={`tabular-nums text-right font-medium ${parsed.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                        {formatProfit(parsed.balance)}
                      </span>
                    </>
                  )}
                  {parsed.xpGain !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <Zap className='size-3' /> {te('xpGain')}
                      </span>
                      <span className='tabular-nums text-right font-medium'>{formatProfit(parsed.xpGain)}</span>
                    </>
                  )}
                  {parsed.xpPerHour !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <Zap className='size-3' /> {te('xpPerHour')}
                      </span>
                      <span className='tabular-nums text-right font-medium'>{formatRate(parsed.xpPerHour)}</span>
                    </>
                  )}
                  {parsed.damage !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <Swords className='size-3' /> {te('damage')}
                      </span>
                      <span className='tabular-nums text-right font-medium'>{formatProfit(parsed.damage)}</span>
                    </>
                  )}
                  {parsed.healing !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <HeartPulse className='size-3' /> {te('healing')}
                      </span>
                      <span className='tabular-nums text-right font-medium'>{formatProfit(parsed.healing)}</span>
                    </>
                  )}
                  {parsed.damageReceived !== undefined && (
                    <>
                      <span className='text-muted-foreground flex items-center gap-1'>
                        <Shield className='size-3' /> {te('damageReceived')}
                      </span>
                      <span className='tabular-nums text-right font-medium'>{formatProfit(parsed.damageReceived)}</span>
                    </>
                  )}
                </div>

                {parsed.players && parsed.players.length > 0 && (
                  <div className='border-t pt-2 mt-1'>
                    <p className='text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1.5'>
                      <Users className='size-3' /> {te('partyMembers')} ({parsed.players.length})
                    </p>
                    <div className='space-y-1'>
                      {parsed.players.map((p, i) => (
                        <div key={i} className='text-xs bg-background rounded px-2 py-1 flex items-center justify-between'>
                          <span className='font-medium'>{p.name}</span>
                          <span className='text-muted-foreground'>
                            {p.vocation} &middot; {te('level')} {p.level}
                            {p.balance !== undefined && (
                              <span className={p.balance >= 0 ? 'text-green-600 dark:text-green-400 ml-2' : 'text-destructive ml-2'}>
                                {formatProfit(p.balance)}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {parsed.killedMonsters && parsed.killedMonsters.length > 0 && (
                  <div className='border-t pt-2 mt-1'>
                    <p className='text-xs font-medium text-muted-foreground mb-1'>{te('killedMonsters')}</p>
                    <div className='flex flex-wrap gap-1'>
                      {parsed.killedMonsters.slice(0, 10).map((m, i) => (
                        <span key={i} className='text-[10px] bg-background rounded px-1.5 py-0.5'>
                          {m.name}: {m.count}
                        </span>
                      ))}
                      {parsed.killedMonsters.length > 10 && (
                        <span className='text-[10px] text-muted-foreground'>
                          +{parsed.killedMonsters.length - 10} {te('more')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!parsed.loot && !parsed.xpGain && (
                <p className='text-xs text-destructive'>{te('parseFailed')}</p>
              )}
            </>
          )}

          <Separator />

          <AlertDialogFooter>
            <Button variant='ghost' onClick={() => { setRawText(''); setOpen(false); }} disabled={submitting}>
              {te('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !parsed || (!parsed.loot && !parsed.xpGain)}>
              {submitting ? te('saving') : te('save')}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
