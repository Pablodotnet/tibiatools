import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { parseHuntSession } from '@/helpers/huntSessionParser';
import { parseGpInput, formatGp } from '@/helpers/exaltationForge';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PlayerData {
  name: string;
  extraTc: string;
  extraGoldK: string;
  loot?: number;
  supplies?: number;
  balance?: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export function TibiaLootSplit() {
  const { t } = useTranslation();
  const te = (key: string) => t(`tibiaLootSplit.${key}`);

  const [rawText, setRawText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [tcValue, setTcValue] = useState('25000');
  const { copy, copied } = useCopyToClipboard();

  const parsed = useMemo(() => {
    if (!rawText.trim()) return null;
    return parseHuntSession(rawText);
  }, [rawText]);

  const handleSubmit = useCallback(() => {
    if (!parsed || !parsed.players || parsed.players.length === 0) {
      return;
    }
    setPlayers(
      parsed.players.map((p) => ({
        name: p.name,
        extraTc: '',
        extraGoldK: '',
        loot: p.loot,
        supplies: p.supplies,
        balance: p.balance,
      })),
    );
    setSubmitted(true);
  }, [parsed]);

  const handleReset = useCallback(() => {
    setRawText('');
    setSubmitted(false);
    setPlayers([]);
  }, []);

  const updatePlayer = useCallback((index: number, field: 'extraTc' | 'extraGoldK', value: string) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const results = useMemo(() => {
    if (!submitted || players.length === 0) return null;

    const tcGp = parseGpInput(tcValue) || 0;

    let totalLoot = 0;
    let totalSupplies = 0;

    if (parsed?.loot != null) {
      totalLoot = parsed.loot;
    } else {
      totalLoot = players.reduce((sum, p) => sum + (p.loot ?? 0), 0);
    }

    if (parsed?.supplies != null) {
      totalSupplies = parsed.supplies;
    } else {
      totalSupplies = players.reduce((sum, p) => sum + (p.supplies ?? 0), 0);
    }

    const perPlayerRows = players.map((p) => {
      const individualBalance = p.balance ?? (p.loot ?? 0) - (p.supplies ?? 0);
      const tc = parseInt(p.extraTc, 10) || 0;
      const goldK = parseFloat(p.extraGoldK) || 0;
      const extraGp = tc * tcGp + goldK * 1000;
      return {
        name: p.name,
        balance: individualBalance,
        extraGp,
        adjustedBalance: individualBalance + extraGp,
      };
    });

    const partyBalance = perPlayerRows.reduce((sum, r) => sum + r.adjustedBalance, 0);
    const numPlayers = players.length;
    const fairShare = partyBalance / numPlayers;

    const rowsWithTransfer = perPlayerRows.map((r) => ({
      ...r,
      transfer: r.adjustedBalance - fairShare,
    }));

    const settlements: Settlement[] = [];
    const payers = rowsWithTransfer
      .filter((r) => r.transfer > 1)
      .map((r) => ({ name: r.name, amount: r.transfer }))
      .sort((a, b) => b.amount - a.amount);
    const receivers = rowsWithTransfer
      .filter((r) => r.transfer < -1)
      .map((r) => ({ name: r.name, amount: -r.transfer }))
      .sort((a, b) => b.amount - a.amount);

    let pi = 0;
    let ri = 0;
    while (pi < payers.length && ri < receivers.length) {
      const paid = Math.min(payers[pi].amount, receivers[ri].amount);
      settlements.push({ from: payers[pi].name, to: receivers[ri].name, amount: Math.round(paid) });
      payers[pi].amount -= paid;
      receivers[ri].amount -= paid;
      if (payers[pi].amount < 1) pi++;
      if (receivers[ri].amount < 1) ri++;
    }

    return { totalLoot, totalSupplies, partyBalance, fairShare, perPlayerRows: rowsWithTransfer, settlements };
  }, [submitted, players, tcValue, parsed]);

  return (
    <div className='space-y-4'>
      {!submitted ? (
        <>
          <div className='space-y-2'>
            <Label htmlFor='loot-paste' className='text-xs text-muted-foreground'>{te('pasteLabel')}</Label>
            <textarea
              id='loot-paste'
              value={rawText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRawText(e.target.value)}
              placeholder={te('pastePlaceholder')}
              rows={6}
              className='flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='loot-tc-value' className='text-xs text-muted-foreground'>{te('tcValue')}</Label>
            <Input
              id='loot-tc-value'
              type='text'
              value={tcValue}
              onChange={(e) => setTcValue(e.target.value)}
              placeholder='25000'
              className='h-8 max-w-[160px]'
            />
          </div>

          <Button onClick={handleSubmit} disabled={!parsed || !parsed.players || parsed.players.length === 0} className='cursor-pointer'>
            {te('submit')}
          </Button>

          {parsed && (!parsed.players || parsed.players.length === 0) && (
            <p className='text-sm text-muted-foreground'>{te('noPlayers')}</p>
          )}
        </>
      ) : (
        <>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium'>{te('players')} ({players.length})</p>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <Label htmlFor='loot-tc-value-2' className='text-xs text-muted-foreground whitespace-nowrap'>{te('tcValue')}</Label>
                <Input
                  id='loot-tc-value-2'
                  type='text'
                  value={tcValue}
                  onChange={(e) => setTcValue(e.target.value)}
                  placeholder='25000'
                  className='h-7 w-20 text-xs'
                />
              </div>
              <Button variant='outline' size='sm' onClick={handleReset} className='cursor-pointer'>
                {te('reset')}
              </Button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/50'>
                  <th className='px-2 py-1.5 text-left font-medium text-xs'>{te('player')}</th>
                  <th className='px-2 py-1.5 text-right font-medium text-xs'>{te('balance')}</th>
                  <th className='px-2 py-1.5 text-right font-medium text-xs'>{te('extraTc')}</th>
                  <th className='px-2 py-1.5 text-right font-medium text-xs'>{te('extraGoldK')}</th>
                  {results && (
                    <th className='px-2 py-1.5 text-right font-medium text-xs'>{te('transfer')}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => {
                  const row = results?.perPlayerRows[i];
                  return (
                    <tr key={i} className='border-b'>
                      <td className='px-2 py-1.5 text-xs font-medium'>{p.name}</td>
                      <td className='px-2 py-1.5 text-right text-xs tabular-nums'>
                        {row ? formatGp(Math.round(row.balance)) : '-'}
                      </td>
                      <td className='px-2 py-1.5'>
                        <Input
                          type='number'
                          value={p.extraTc}
                          onChange={(e) => updatePlayer(i, 'extraTc', e.target.value)}
                          min={0}
                          className='h-7 w-16 text-xs ml-auto'
                          aria-label={`${p.name} ${te('extraTc')}`}
                        />
                      </td>
                      <td className='px-2 py-1.5'>
                        <Input
                          type='number'
                          value={p.extraGoldK}
                          onChange={(e) => updatePlayer(i, 'extraGoldK', e.target.value)}
                          min={0}
                          step={0.1}
                          className='h-7 w-16 text-xs ml-auto'
                          aria-label={`${p.name} ${te('extraGoldK')}`}
                        />
                      </td>
                      {results && (
                        <td className='px-2 py-1.5 text-right text-xs tabular-nums font-semibold'>
                          {renderTransfer(row!.transfer, formatGp, te)}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Separator />

          {results && (
            <div className='rounded-md border'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='px-3 py-2 text-left font-medium'>{te('result')}</th>
                    <th className='px-3 py-2 text-right font-medium'>{te('value')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b'>
                    <td className='px-3 py-2 text-muted-foreground'>{te('totalLoot')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-medium'>{formatGp(results.totalLoot)}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='px-3 py-2 text-muted-foreground'>{te('totalSupplies')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-medium'>{formatGp(results.totalSupplies)}</td>
                  </tr>
                  <tr className='border-b bg-muted/20'>
                    <td className='px-3 py-2 font-medium'>{te('partyBalance')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-semibold'>{formatGp(Math.round(results.partyBalance))}</td>
                  </tr>
                  <tr className='border-b bg-muted/20'>
                    <td className='px-3 py-2 font-medium'>{te('fairShare')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-semibold text-green-600 dark:text-green-400'>{formatGp(Math.round(results.fairShare))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {results && (
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={() => {
                const lines: string[] = [];
                results.perPlayerRows.forEach((r) => {
                  const abs = Math.abs(r.transfer);
                  if (abs < 1) {
                    lines.push(`${r.name} — ${te('even')}`);
                  } else if (r.transfer > 0) {
                    lines.push(`${r.name} — ${te('pay')} ${formatGp(Math.round(r.transfer))}`);
                  } else {
                    lines.push(`${r.name} — ${te('receive')} ${formatGp(Math.round(abs))}`);
                  }
                });
                if (results.settlements.length > 0) {
                  lines.push('');
                  lines.push(te('settlements'));
                  results.settlements.forEach((s) => {
                    lines.push(`${s.from} → ${s.to}: ${formatGp(s.amount)}`);
                  });
                }
                lines.push('');
                lines.push(`${te('partyBalance')}: ${formatGp(Math.round(results.partyBalance))}`);
                lines.push(`${te('fairShare')}: ${formatGp(Math.round(results.fairShare))}`);
                copy(lines.join('\n'));
                toast.success(t('common.copied'));
              }} className='cursor-pointer'>
                <Copy className='size-3.5' data-icon="inline-start" />
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          )}

          {results && results.settlements.length > 0 && (
            <div className='rounded-md border'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='px-3 py-2 text-left font-medium' colSpan={2}>{te('settlements')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.settlements.map((s, i) => (
                    <tr key={i} className='border-b'>
                      <td className='px-3 py-2 text-xs text-muted-foreground'>
                        {s.from} &rarr; {s.to}
                      </td>
                      <td className='px-3 py-2 text-right text-xs tabular-nums font-medium'>
                        {formatGp(s.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function renderTransfer(transfer: number, formatGp: (n: number) => string, te: (k: string) => string) {
  const abs = Math.abs(transfer);
  if (abs < 1) {
    return <span className='text-muted-foreground'>{te('even')}</span>;
  }
  if (transfer > 0) {
    return <span className='text-destructive'>{te('pay')} {formatGp(Math.round(transfer))}</span>;
  }
  return <span className='text-green-600 dark:text-green-400'>{te('receive')} {formatGp(Math.round(abs))}</span>;
}
