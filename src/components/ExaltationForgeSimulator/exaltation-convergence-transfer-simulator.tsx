// ConvergenceTransferCalculator.tsx
// Convergence Transfer: Class 3 & 4, no tier loss, 160 Dust,
// source item destroyed, receiver gets SAME tier as source (no -1)

import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateConvergenceTransfer,
  formatGp,
  formatMxn,
  formatTc,
  parseGpInput,
  type ConvergenceTransferResult,
} from '@/helpers/exaltationForge';
import { ResultRow } from './result-row';
import { useTranslation } from 'react-i18next';

export function ConvergenceTransferCalculator() {
  const { t } = useTranslation();
  const [sourceTier, setSourceTier] = useState('1');
  const [sourceItemValue, setSourceItemValue] = useState('0');
  const [targetItemValue, setTargetItemValue] = useState('0');
  const [exaltedCoreValue, setExaltedCoreValue] = useState('1');
  const [tcGp, setTcGp] = useState('25000');
  const [mxn250, setMxn250] = useState('210');
  const [result, setResult] = useState<ConvergenceTransferResult | null>(null);

  const handleCalculate = () => {
    const res = calculateConvergenceTransfer({
      sourceTier: parseInt(sourceTier, 10) || 1,
      classification: 4,
      sourceItemValueGp: parseGpInput(sourceItemValue),
      targetItemValueGp: parseGpInput(targetItemValue),
      exaltedCoreValueGp: parseGpInput(exaltedCoreValue),
      tcGp: parseGpInput(tcGp),
      mxnPer250Tc: parseFloat(mxn250.replace(',', '.')) || 0,
    });
    setResult(res);
  };

  return (
    <div className='max-w-lg flex flex-col gap-5 font-sans text-sm text-foreground'>
      <Alert className='bg-blue-50 border-blue-200 border-border'>
        <AlertTitle className='font-semibold text-orange-600 text-warning'>
          &gt;&gt; {t("exaltationForge.convergenceTransferHelp")}
        </AlertTitle>
        <AlertDescription className='text-blue-950 text-muted-foreground'>
          <ul className='list-disc space-y-1 pl-5'>
            <li>{t("exaltationForge.convergenceTransferHelp1")}</li>
            <li>{t("exaltationForge.convergenceTransferHelp2")}</li>
            <li>{t("exaltationForge.convergenceTransferHelp3")}</li>
            <li>{t("exaltationForge.convergenceTransferHelp4")}</li>
            <li>{t("exaltationForge.convergenceTransferHelp5")}</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className='grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3'>
        <Label htmlFor='ct-tier' className='justify-self-end text-right'>
          {t("exaltationForge.sourceItemTier")}
        </Label>
        <Input
          id='ct-tier'
          type='number'
          min={1}
          max={10}
          className='max-w-[120px] justify-self-start'
          value={sourceTier}
          onChange={(e) => setSourceTier(e.target.value)}
        />

        <Label htmlFor='ct-src-val' className='justify-self-end text-right'>
          {t("exaltationForge.sourceItemValue")}
        </Label>
        <Input
          id='ct-src-val'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={sourceItemValue}
          onChange={(e) => setSourceItemValue(e.target.value)}
        />

        <Label htmlFor='ct-tgt-val' className='justify-self-end text-right'>
          {t("exaltationForge.targetItemValue")}
        </Label>
        <Input
          id='ct-tgt-val'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={targetItemValue}
          onChange={(e) => setTargetItemValue(e.target.value)}
        />

        <Label htmlFor='ct-core-val' className='justify-self-end text-right'>
          {t("exaltationForge.exaltedCoreValue")}
        </Label>
        <Input
          id='ct-core-val'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={exaltedCoreValue}
          onChange={(e) => setExaltedCoreValue(e.target.value)}
        />

        <Label htmlFor='ct-tc' className='justify-self-end text-right'>
          {t("exaltationForge.tibiaCoinValue")}
        </Label>
        <Input
          id='ct-tc'
          inputMode='numeric'
          className='max-w-[180px] justify-self-start'
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor='ct-mxn' className='justify-self-end text-right'>
          {t("exaltationForge.priceOf250Tc")}
        </Label>
        <Input
          id='ct-mxn'
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
            {t("exaltationForge.convergenceTransferResult")}
          </div>
          {!result.isValid ? (
            <p className='p-3 text-sm text-destructive'>
              {result.errorMessage}
            </p>
          ) : (
            <>
              <ResultRow
                label={t("exaltationForge.resultingTier")}
                value={t("exaltationForge.resultingTierNoLoss").replace("{{tier}}", String(result.resultingTier))}
              />
              <ResultRow
                label={t("exaltationForge.forgeGoldFee")}
                value={`${formatGp(result.goldFee!)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.exaltedCoresRequired")}
                value={`${result.coresRequired} cores (${formatGp(result.coreCostGp)} gp)`}
              />
              <ResultRow
                label={t("exaltationForge.sourceItemCost")}
                value={`${formatGp(result.sourceItemCostGp)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.targetItemCost")}
                value={`${formatGp(result.targetItemCostGp)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.dustRequired")}
                value="160 Dust"
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
