import { useTranslation } from 'react-i18next';
import { formatRate, formatProfit } from '@/helpers/huntingSpots';
import type { HuntSession } from '@/types/huntSession';
import { User, Coins, PackageOpen, Zap, Swords, HeartPulse, Shield, Users, PartyPopper, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import { memo, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export const HuntSessionCard = memo(function HuntSessionCard({
  session,
  isOwner,
  onDelete,
}: {
  session: HuntSession;
  isOwner: boolean;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const te = (key: string) => t(`huntSessionDisplay.${key}`);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
      <button
        onClick={() => setExpanded(!expanded)}
        className='w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-muted/50 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-ring'
        aria-expanded={expanded}
      >
        <div className='min-w-0 flex-1 flex items-center gap-2'>
          {session.isParty ? (
            <PartyPopper className='size-4 shrink-0 text-blue-500' />
          ) : (
            <User className='size-4 shrink-0 text-muted-foreground' />
          )}
          <div className='min-w-0'>
            <div className='flex items-center gap-1.5'>
              <span className='text-xs font-medium'>
                {session.isParty ? te('partySession') : te('soloSession')}
              </span>
              {session.balance !== undefined && (
                <span className={`text-xs tabular-nums font-medium inline-flex items-center gap-0.5 ${session.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {session.balance >= 0 ? <ArrowUp className='size-3' /> : <ArrowDown className='size-3' />}
                  {session.balance >= 0 ? '+' : ''}{formatProfit(session.balance)}
                </span>
              )}
              {session.xpPerHour !== undefined && (
                <span className='text-xs tabular-nums text-muted-foreground'>
                  {formatRate(session.xpPerHour)}
                </span>
              )}
            </div>
            <p className='text-[10px] text-muted-foreground'>
              {session.ownerDisplayName}
              {session.durationMinutes && (
                <>
                  {' '}&middot;{' '}
                  {Math.floor(session.durationMinutes / 60)}h {session.durationMinutes % 60}min
                </>
              )}
              {session.level && (
                <>&middot; {te('lvl')} {session.level}</>
              )}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          {isOwner && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
              className='p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring'
              title={te('delete')}
              aria-label={te('delete')}
            >
              <Trash2 className='size-3.5' />
            </button>
          )}
          {expanded ? (
            <ChevronUp className='size-4 shrink-0 text-muted-foreground' />
          ) : (
            <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
          )}
        </div>
      </button>

      {expanded && (
        <>
        <Separator />
        <div className='px-4 py-3 flex flex-col gap-2 text-sm fade-in'>
          <div className='grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs'>
            {session.loot !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Coins className='size-3' /> {te('loot')}
                </span>
                <span className='tabular-nums text-right font-medium text-success'>
                  <ArrowUp className='size-3 inline' /> +{formatProfit(session.loot)}
                </span>
              </>
            )}
            {session.supplies !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <PackageOpen className='size-3' /> {te('supplies')}
                </span>
                <span className='tabular-nums text-right font-medium text-destructive'>
                  <ArrowDown className='size-3 inline' /> -{formatProfit(session.supplies)}
                </span>
              </>
            )}
            {session.balance !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Coins className='size-3' /> {te('balance')}
                </span>
                <span className={`tabular-nums text-right font-medium ${session.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {session.balance >= 0 ? <ArrowUp className='size-3 inline' /> : <ArrowDown className='size-3 inline' />}
                  {session.balance >= 0 ? '+' : ''}{formatProfit(session.balance)}
                </span>
              </>
            )}
            {session.xpGain !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Zap className='size-3' /> {te('xpGain')}
                </span>
                <span className='tabular-nums text-right font-medium'>{formatProfit(session.xpGain)}</span>
              </>
            )}
            {session.xpPerHour !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Zap className='size-3' /> {te('xpPerHour')}
                </span>
                <span className='tabular-nums text-right font-medium'>{formatRate(session.xpPerHour)}</span>
              </>
            )}
            {session.damage !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Swords className='size-3' /> {te('damage')}
                </span>
                <span className='tabular-nums text-right font-medium'>{formatProfit(session.damage)}</span>
              </>
            )}
            {session.healing !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <HeartPulse className='size-3' /> {te('healing')}
                </span>
                <span className='tabular-nums text-right font-medium'>{formatProfit(session.healing)}</span>
              </>
            )}
            {session.damageReceived !== undefined && (
              <>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Shield className='size-3' /> {te('damageReceived')}
                </span>
                <span className='tabular-nums text-right font-medium'>{formatProfit(session.damageReceived)}</span>
              </>
            )}
          </div>

          {session.players && session.players.length > 0 && (
            <>
            <Separator />
            <div className='pt-2'>
              <p className='text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1'>
                <Users className='size-3' /> {te('partyMembers')} ({session.players.length})
              </p>
              <div className='flex flex-col gap-1'>
                {session.players.map((p) => (
                  <div key={p.name} className='text-[11px] bg-muted/30 rounded px-2 py-1 flex items-center justify-between'>
                    <span className='font-medium'>{p.name}</span>
                    <span className='text-muted-foreground'>
                      {p.vocation} &middot; {te('lvl')} {p.level}
                      {p.balance !== undefined && (
                        <span className={p.balance >= 0 ? 'text-success ml-2' : 'text-destructive ml-2'}>
                          {p.balance >= 0 ? <ArrowUp className='size-2.5 inline' /> : <ArrowDown className='size-2.5 inline' />}
                          {p.balance >= 0 ? '+' : ''}{formatProfit(p.balance)}
                        </span>
                      )}
                    </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {session.lootItems && session.lootItems.length > 0 && (
            <>
            <Separator />
            <div className='pt-2'>
              <p className='text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1'>
                <Coins className='size-3' /> {te('lootItems')} ({session.lootItems.length})
              </p>
              <div className='flex flex-wrap gap-1'>
                {session.lootItems.slice(0, 10).map((item) => (
                  <Badge key={item.name} variant="outline" className='text-[10px]'>
                    {item.name}: {item.count}× ({formatProfit(item.value)})
                  </Badge>
                ))}
                {session.lootItems.length > 10 && (
                  <span className='text-[10px] text-muted-foreground'>
                    +{session.lootItems.length - 10} {te('more')}
                  </span>
                )}
              </div>
            </div>
            </>
          )}

          {session.supplyItems && session.supplyItems.length > 0 && (
            <>
            <Separator />
            <div className='pt-2'>
              <p className='text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1'>
                <PackageOpen className='size-3' /> {te('supplyItems')} ({session.supplyItems.length})
              </p>
              <div className='flex flex-wrap gap-1'>
                {session.supplyItems.slice(0, 10).map((item) => (
                  <Badge key={item.name} variant="outline" className='text-[10px]'>
                    {item.name}: {item.count}× ({formatProfit(item.value)})
                  </Badge>
                ))}
                {session.supplyItems.length > 10 && (
                  <span className='text-[10px] text-muted-foreground'>
                    +{session.supplyItems.length - 10} {te('more')}
                  </span>
                )}
              </div>
            </div>
            </>
          )}

          {session.killedMonsters && session.killedMonsters.length > 0 && (
            <>
            <Separator />
            <div className='pt-2'>
              <p className='text-xs font-medium text-muted-foreground mb-1'>{te('killedMonsters')}</p>
              <div className='flex flex-wrap gap-1'>
                {session.killedMonsters.slice(0, 15).map((m) => (
                  <Badge key={`${m.name}-${m.count}`} variant="secondary" className='text-[10px]'>
                    {m.name}: {m.count}
                  </Badge>
                ))}
                {session.killedMonsters.length > 15 && (
                  <span className='text-[10px] text-muted-foreground'>
                    +{session.killedMonsters.length - 15} {te('more')}
                  </span>
                )}
              </div>
            </div>
            </>
          )}

          {session.sessionDate && (
            <>
            <Separator />
            <p className='text-[10px] text-muted-foreground pt-1'>
              {te('sessionDate')}: {session.sessionDate}
            </p>
            </>
          )}
        </div>
        </>
      )}
    </div>
  );
});
