// ConvergenceFusionCalculator.tsx
// Convergence Fusion: Class 4 only, guaranteed single-step, 130 Dust,
// two items of same body slot at the same tier, result is tier+1

import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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
import { ResultRow } from './result-row';
import { useTranslation } from 'react-i18next';

export function ConvergenceFusionCalculator() {
  const { t } = useTranslation();
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
    <div className='max-w-lg flex flex-col gap-5 font-sans text-sm text-foreground'>
      <Alert className='bg-blue-50 border-blue-200 border-border'>
        <AlertTitle className='font-semibold text-orange-600 text-warning'>
          &gt;&gt; {t("exaltationForge.convergenceFusionHelp")}
        </AlertTitle>
        <AlertDescription className='text-blue-950 text-muted-foreground'>
          <ul className='list-disc space-y-1 pl-5'>
            <li>{t("exaltationForge.convergenceFusionHelp1")}</li>
            <li>{t("exaltationForge.convergenceFusionHelp2")}</li>
            <li>{t("exaltationForge.convergenceFusionHelp3")}</li>
            <li>{t("exaltationForge.convergenceFusionHelp4")}</li>
            <li>{t("exaltationForge.convergenceFusionHelp5")}</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className='grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3'>
        <Label htmlFor='cf-tier' className='justify-self-end text-right'>
          {t("exaltationForge.currentTier")}
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
          {t("exaltationForge.item1Cost")}
        </Label>
        <Input
          id='cf-item1'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={item1Value}
          onChange={(e) => setItem1Value(e.target.value)}
        />

        <Label htmlFor='cf-item2' className='justify-self-end text-right'>
          {t("exaltationForge.item2Cost")}
        </Label>
        <Input
          id='cf-item2'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={item2Value}
          onChange={(e) => setItem2Value(e.target.value)}
        />

        <Label htmlFor='cf-tc' className='justify-self-end text-right'>
          {t("exaltationForge.tibiaCoinValue")}
        </Label>
        <Input
          id='cf-tc'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor='cf-mxn' className='justify-self-end text-right'>
          {t("exaltationForge.priceOf250Tc")}
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
          className='rounded-md bg-blue-900 px-8 font-bold text-white hover:bg-blue-950 dark:bg-muted dark:hover:bg-muted'
          onClick={handleCalculate}
        >
          {t("exaltationForge.calculate")}
        </Button>
      </div>

      {result && (
        <div className='overflow-hidden rounded-md border border-blue-900/40'>
          <div className='bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-muted'>
            {t("exaltationForge.convergenceFusionResult")}
          </div>
          {!result.isValid ? (
            <p className='p-3 text-sm text-destructive'>
              {result.errorMessage}
            </p>
          ) : (
            <>
              <ResultRow
                label={t("exaltationForge.tierStep")}
                value={TIER_LABELS[result.currentTier]}
              />
              <ResultRow
                label={t("exaltationForge.forgeGoldFee")}
                value={`${formatGp(result.goldFee!)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.item1Cost")}
                value={`${formatGp(result.item1CostGp)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.item2Cost")}
                value={`${formatGp(result.item2CostGp)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.dustRequired")}
                value="130 Dust"
              />
              <ResultRow
                label={t("exaltationForge.totalCost")}
                value={`${formatGp(result.totalGp!)} gp`}
                highlight
              />
              <ResultRow
                label={`≈ ${t("exaltationForge.tibiaCoins")}`}
                value={`${formatTc(result.tibiaCoins)} TC`}
              />
              <ResultRow
                label={`≈ ${t("exaltationForge.realMoney")}`}
                value={`MX$ ${formatMxn(result.mxn)}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
