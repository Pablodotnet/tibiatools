import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { formatGp } from '@/helpers/exaltationForge';
import { calculateBlessings, calculateStoreCost, STORE_PRICES } from '@/helpers/blessCalculator';

export function BlessCalculator() {
  const { t } = useTranslation();
  const te = (key: string) => t(`blessCalculator.${key}`);

  const [level, setLevel] = useState('100');
  const [includeEnhanced, setIncludeEnhanced] = useState(true);
  const [includeToF, setIncludeToF] = useState(true);
  const [useInquisition, setUseInquisition] = useState(false);

  const result = useMemo(() => {
    const lvl = parseInt(level, 10);
    if (isNaN(lvl) || lvl < 1) return null;
    return calculateBlessings(lvl);
  }, [level]);

  const gpCost = useMemo(() => {
    if (!result) return 0;
    let total = 0;
    if (useInquisition) {
      total += result.inquisition;
    } else {
      total += result.regularFive;
    }
    if (includeEnhanced) {
      total += result.enhancedTwo;
    }
    if (includeToF) {
      total += result.twistOfFate;
    }
    return total;
  }, [result, useInquisition, includeEnhanced, includeToF]);

  const storeTC = useMemo(() => {
    const lvl = parseInt(level, 10);
    if (isNaN(lvl) || lvl < 1) return null;
    return calculateStoreCost(1, includeEnhanced ? 2 : 0, includeToF ? 1 : 0);
  }, [level, includeEnhanced, includeToF]);

  const store7TC = useMemo(() => {
    if (!includeEnhanced) return null;
    return STORE_PRICES.allSeven;
  }, [includeEnhanced]);

  return (
    <div className='space-y-4'>
      <div className='space-y-1'>
        <label className='text-xs text-muted-foreground'>{te('level')}</label>
        <Input
          type='number'
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          min={1}
          max={99999}
          className='h-8'
        />
      </div>

      <Separator />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <Label className='text-sm font-normal cursor-pointer' htmlFor='inc-enhanced'>
            {te('includeEnhanced')}
          </Label>
          <Switch
            id='inc-enhanced'
            checked={includeEnhanced}
            onCheckedChange={setIncludeEnhanced}
          />
        </div>

        <div className='flex items-center justify-between'>
          <Label className='text-sm font-normal cursor-pointer' htmlFor='inc-tof'>
            {te('includeToF')}
          </Label>
          <Switch
            id='inc-tof'
            checked={includeToF}
            onCheckedChange={setIncludeToF}
          />
        </div>

        <div className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <Label className='text-sm font-normal cursor-pointer' htmlFor='use-inq'>
              {te('useInquisition')}
            </Label>
            <p className='text-xs text-muted-foreground'>{te('inquisitionHint')}</p>
          </div>
          <Switch
            id='use-inq'
            checked={useInquisition}
            onCheckedChange={setUseInquisition}
          />
        </div>
      </div>

      <Separator />

      {result ? (
        <div className='rounded-md border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b bg-muted/50'>
                <th className='px-3 py-2 text-left font-medium'>{te('blessing')}</th>
                <th className='px-3 py-2 text-right font-medium'>{te('gpCost')}</th>
                <th className='px-3 py-2 text-right font-medium'>{te('tcCost')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b'>
                <td className='px-3 py-2 text-muted-foreground'>
                  {te('regularEach')} <span className='text-xs'>(x5)</span>
                </td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>
                  {formatGp(result.regularFive)}
                </td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>
                  {useInquisition ? '—' : `${STORE_PRICES.regularBlessing} TC`}
                </td>
              </tr>
              {(includeEnhanced || store7TC !== null) && (
                <tr className='border-b'>
                  <td className='px-3 py-2 text-muted-foreground'>
                    {te('enhancedEach')} <span className='text-xs'>(x2)</span>
                  </td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {formatGp(result.enhancedTwo)}
                  </td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {`${STORE_PRICES.heartOfMountain} TC`}
                  </td>
                </tr>
              )}
              {includeToF && (
                <tr className='border-b'>
                  <td className='px-3 py-2 text-muted-foreground'>
                    {te('twistOfFate')}
                  </td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {formatGp(result.twistOfFate)}
                  </td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {`${STORE_PRICES.twistOfFate} TC`}
                  </td>
                </tr>
              )}
              <tr className='border-b bg-muted/20'>
                <td className='px-3 py-2 font-medium'>{te('totalGp')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-semibold'>
                  {formatGp(gpCost)}
                </td>
                <td className='px-3 py-2 text-right tabular-nums' />
              </tr>
              {storeTC !== null && (
                <tr className='border-b bg-muted/20'>
                  <td className='px-3 py-2 font-medium'>{te('totalTc')}</td>
                  <td className='px-3 py-2 text-right tabular-nums' />
                  <td className='px-3 py-2 text-right tabular-nums font-semibold'>
                    {store7TC !== null
                      ? `${te('orBundle')} ${store7TC} TC`
                      : `${storeTC} TC`}
                  </td>
                </tr>
              )}
              {useInquisition && (
                <tr>
                  <td className='px-3 py-2 text-xs text-muted-foreground italic' colSpan={3}>
                    {te('inquisitionNote')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Separator />

          <div className='px-3 py-2 space-y-1'>
            <p className='text-xs text-muted-foreground'>
              {te('regularEach')}: {formatGp(result.regularEach)} gp
            </p>
            <p className='text-xs text-muted-foreground'>
              {te('enhancedEach')}: {formatGp(result.enhancedEach)} gp
            </p>
            {useInquisition && (
              <p className='text-xs text-muted-foreground'>
                {te('inquisition')}: {formatGp(result.inquisition)} gp
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-4 text-center'>
          {te('enterValidLevel')}
        </p>
      )}
    </div>
  );
}
