import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { calculateStamina, formatDuration } from '@/helpers/stamina';

export function StaminaCalculator() {
  const { t } = useTranslation();
  const ts = (key: string) => t(`staminaCalculator.${key}`);

  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const result = useMemo(() => {
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    if (isNaN(h) || isNaN(m) || h < 0 || m < 0 || m > 59) return null;
    return calculateStamina(h, m);
  }, [hours, minutes]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-2 gap-4 max-w-xs'>
        <div className='space-y-1'>
          <Label htmlFor='stamina-hours' className='text-xs text-muted-foreground'>{ts('hours')}</Label>
          <Input
            id='stamina-hours'
            type='number'
            min={0}
            max={42}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder='0'
            className='h-8'
          />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='stamina-minutes' className='text-xs text-muted-foreground'>{ts('minutes')}</Label>
          <Input
            id='stamina-minutes'
            type='number'
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder='0'
            className='h-8'
          />
        </div>
      </div>

      <Separator />

      {result && (
        <div className='rounded-md border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b bg-muted/50'>
                <th className='px-3 py-2 text-left font-medium'>{ts('result')}</th>
                <th className='px-3 py-2 text-right font-medium'>{ts('value')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b'>
                <td className='px-3 py-2 text-muted-foreground'>{ts('currentStamina')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>
                  {Math.floor(result.currentMinutes / 60)}h {result.currentMinutes % 60}min
                </td>
              </tr>
              {result.minutesBelowGreen > 0 && (
                <tr className='border-b bg-muted/20'>
                  <td className='px-3 py-2 font-medium'>{ts('belowGreen')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-semibold text-destructive'>
                    {formatDuration(result.minutesBelowGreen)}
                  </td>
                </tr>
              )}
              {result.minutesToGreen > 0 && (
                <tr className='border-b bg-muted/20'>
                  <td className='px-3 py-2 font-medium'>{ts('timeToGreen')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-semibold'>
                    {formatDuration(result.minutesToGreen)}
                  </td>
                </tr>
              )}
              <tr className='border-b bg-muted/20'>
                <td className='px-3 py-2 font-medium'>{ts('timeToFull')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-semibold text-success'>
                  {result.currentMinutes >= 42 * 60 ? '—' : formatDuration(result.minutesToFull)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!result && (hours !== '' || minutes !== '') && (
        <p className='text-sm text-muted-foreground text-center py-4'>
          {ts('invalidInput')}
        </p>
      )}
    </div>
  );
}
