import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { parseHuntSession } from '@/helpers/huntSessionParser';
import { parseGpInput, formatGp } from '@/helpers/exaltationForge';

interface PlayerData {
  name: string;
  extraTc: string;
  extraGoldK: string;
}

export function TibiaLootSplit() {
  const { t } = useTranslation();
  const te = (key: string) => t(`tibiaLootSplit.${key}`);

  const [rawText, setRawText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [tcValue, setTcValue] = useState('25000');

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
    let totalExtraGp = 0;

    if (parsed?.loot != null) {
      totalLoot = parsed.loot;
    } else {
      totalLoot = players.reduce((sum, _, i) => {
        return sum + (parsed?.players?.[i]?.loot ?? 0);
      }, 0);
    }

    if (parsed?.supplies != null) {
      totalSupplies = parsed.supplies;
    } else {
      totalSupplies = players.reduce((sum, _, i) => {
        return sum + (parsed?.players?.[i]?.supplies ?? 0);
      }, 0);
    }

    totalExtraGp = players.reduce((sum, p) => {
      const tc = parseInt(p.extraTc, 10) || 0;
      const goldK = parseFloat(p.extraGoldK) || 0;
      return sum + tc * tcGp + goldK * 1000;
    }, 0);

    const numPlayers = players.length;
    const netProfit = totalLoot - totalSupplies - totalExtraGp;
    const perPlayer = Math.floor(netProfit / numPlayers);

    const perPlayerRows = players.map((p) => {
      const tc = parseInt(p.extraTc, 10) || 0;
      const goldK = parseFloat(p.extraGoldK) || 0;
      const playerExtra = tc * tcGp + goldK * 1000;
      return {
        name: p.name,
        extra: playerExtra,
        net: perPlayer,
      };
    });

    return { totalLoot, totalSupplies, totalExtraGp, netProfit, perPlayer, perPlayerRows };
  }, [submitted, players, tcValue, parsed]);

  return (
    <div className='space-y-4'>
      {!submitted ? (
        <>
          <div className='space-y-2'>
            <Label className='text-xs text-muted-foreground'>{te('pasteLabel')}</Label>
            <textarea
              value={rawText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRawText(e.target.value)}
              placeholder={te('pastePlaceholder')}
              rows={6}
              className='flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-xs text-muted-foreground'>{te('tcValue')}</Label>
            <Input
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
                <Label className='text-xs text-muted-foreground whitespace-nowrap'>{te('tcValue')}</Label>
                <Input
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
                  <th className='px-2 py-1.5 text-right font-medium text-xs'>{te('extraTc')}</th>
                  <th className='px-2 py-1.5 text-right font-medium text-xs'>{te('extraGoldK')}</th>
                  {results && (
                    <th className='px-2 py-1.5 text-right font-medium text-xs'>{te('net')}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={i} className='border-b'>
                    <td className='px-2 py-1.5 text-xs font-medium'>{p.name}</td>
                    <td className='px-2 py-1.5'>
                      <Input
                        type='number'
                        value={p.extraTc}
                        onChange={(e) => updatePlayer(i, 'extraTc', e.target.value)}
                        min={0}
                        className='h-7 w-16 text-xs ml-auto'
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
                      />
                    </td>
                    {results && (
                      <td className='px-2 py-1.5 text-right text-xs tabular-nums'>
                        {formatGp(results.perPlayerRows[i].net)}
                      </td>
                    )}
                  </tr>
                ))}
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
                  <tr className='border-b'>
                    <td className='px-3 py-2 text-muted-foreground'>{te('totalExtra')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-medium text-destructive'>{formatGp(results.totalExtraGp)}</td>
                  </tr>
                  <tr className='border-b bg-muted/20'>
                    <td className='px-3 py-2 font-medium'>{te('netProfit')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-semibold'>{formatGp(results.netProfit)}</td>
                  </tr>
                  <tr className='border-b bg-muted/20'>
                    <td className='px-3 py-2 font-medium'>{te('perPlayer')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-semibold text-green-600'>{formatGp(results.perPlayer)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
