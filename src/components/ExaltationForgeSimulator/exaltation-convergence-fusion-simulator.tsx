// ConvergenceFusionCalculator.tsx
// Convergence Fusion: Class 4 only, guaranteed single-step, 130 Dust,
// two items of same body slot at the same tier, result is tier+1

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateConvergenceFusion,
  formatGp,
  formatMxn,
  formatTc,
  parseGpInput,
  TIER_LABELS,
  type ConvergenceFusionResult,
} from '@/helpers/exaltationForge';

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 px-3 py-1.5 text-sm ${
        highlight
          ? 'bg-blue-900 font-bold text-white'
          : 'odd:bg-sky-50/80 even:bg-white dark:odd:bg-sky-950/20 dark:even:bg-slate-900/30'
      } dark:text-slate-100`}
    >
      <span className='text-left'>{label}</span>
      <span className='tabular-nums'>{value}</span>
    </div>
  );
}

export function ConvergenceFusionCalculator() {
  const [currentTier, setCurrentTier] = useState('0');
  const [item1Value, setItem1Value] = useState('0');
  const [item2Value, setItem2Value] = useState('0');
  const [tcGp, setTcGp] = useState('25000');
  const [mxn250, setMxn250] = useState('210');
  const [result, setResult] = useState<ConvergenceFusionResult | null>(null);

  const handleCalculate = () => {
    const tier = Math.min(Math.max(parseInt(currentTier, 10) || 0, 0), 9);
    const res = calculateConvergenceFusion({
      currentTier: tier,
      item1ValueGp: parseGpInput(item1Value),
      item2ValueGp: parseGpInput(item2Value),
      tcGp: parseGpInput(tcGp),
      mxnPer250Tc: parseFloat(mxn250.replace(',', '.')) || 0,
    });
    setResult(res);
  };

  return (
    <div className='max-w-lg space-y-5 font-sans text-sm text-slate-900 dark:text-slate-100'>
      <div className='rounded-md border-2 border-blue-800 bg-sky-100 p-4 dark:border-sky-600 dark:bg-sky-950/40'>
        <h2 className='mb-2 font-semibold text-orange-600 dark:text-orange-400'>
          &gt;&gt; How Convergence Fusion works
        </h2>
        <ul className='list-disc space-y-1 pl-5 text-blue-950 dark:text-sky-100'>
          <li>
            Available for <strong>Classification 4 items only</strong>.
          </li>
          <li>
            Fuse two different items of the same <strong>body slot</strong> at
            the same tier (e.g. two tier-3 class-4 armors) — they don't have to
            be identical items.
          </li>
          <li>
            <strong>Guaranteed success</strong> — no RNG, no bonus effects, no
            tier loss.
          </li>
          <li>
            Costs <strong>130 Dust</strong> per fusion (vs 100 for regular
            fusion).
          </li>
          <li>
            Item 2 is always <strong>consumed</strong>. Result is item 1 at
            current tier + 1.
          </li>
        </ul>
      </div>

      <div className='grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3'>
        <Label htmlFor='cf-tier' className='justify-self-end text-right'>
          Current tier of both items
        </Label>
        <Input
          id='cf-tier'
          type='number'
          min={0}
          max={9}
          className='max-w-[120px] justify-self-start'
          value={currentTier}
          onChange={(e) => setCurrentTier(e.target.value)}
        />

        <Label htmlFor='cf-item1' className='justify-self-end text-right'>
          Item 1 value (gp)
        </Label>
        <Input
          id='cf-item1'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={item1Value}
          onChange={(e) => setItem1Value(e.target.value)}
        />

        <Label htmlFor='cf-item2' className='justify-self-end text-right'>
          Item 2 value (gp){' '}
          <span className='text-muted-foreground'>(consumed)</span>
        </Label>
        <Input
          id='cf-item2'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={item2Value}
          onChange={(e) => setItem2Value(e.target.value)}
        />

        <Label htmlFor='cf-tc' className='justify-self-end text-right'>
          Tibia Coin value (gp)
        </Label>
        <Input
          id='cf-tc'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor='cf-mxn' className='justify-self-end text-right'>
          Price of 250 TC (MXN)
        </Label>
        <Input
          id='cf-mxn'
          inputMode='decimal'
          className='max-w-[180px] justify-self-start'
          value={mxn250}
          onChange={(e) => setMxn250(e.target.value)}
        />
      </div>

      <div className='flex justify-end'>
        <Button
          type='button'
          className='rounded-md bg-blue-900 px-8 font-bold text-white hover:bg-blue-950 dark:bg-blue-800 dark:hover:bg-blue-900'
          onClick={handleCalculate}
        >
          Calculate
        </Button>
      </div>

      {result && (
        <div className='overflow-hidden rounded-md border border-blue-900/40'>
          <div className='bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-blue-950'>
            Convergence Fusion Result
          </div>
          {!result.isValid ? (
            <p className='p-3 text-sm text-red-600 dark:text-red-400'>
              {result.errorMessage}
            </p>
          ) : (
            <>
              <ResultRow
                label='Tier step'
                value={TIER_LABELS[result.currentTier]}
              />
              <ResultRow
                label='Forge gold fee'
                value={`${formatGp(result.goldFee!)} gp`}
              />
              <ResultRow
                label='Item 1 cost'
                value={`${formatGp(result.item1CostGp)} gp`}
              />
              <ResultRow
                label='Item 2 cost (consumed)'
                value={`${formatGp(result.item2CostGp)} gp`}
              />
              <ResultRow label='Dust required' value='130 Dust' />
              <ResultRow
                label='Total cost (gp)'
                value={`${formatGp(result.totalGp!)} gp`}
                highlight
              />
              <ResultRow
                label='≈ Tibia Coins'
                value={`${formatTc(result.tibiaCoins)} TC`}
              />
              <ResultRow label='≈ MXN' value={`MX$ ${formatMxn(result.mxn)}`} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
