import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function ExpShareCalculator() {
  const { t } = useTranslation();
  const te = (key: string) => t(`expShareCalculator.${key}`);

  const [level, setLevel] = useState('100');

  const result = useMemo(() => {
    const lvl = parseInt(level, 10);
    if (isNaN(lvl) || lvl < 1) return null;
    return {
      level: lvl,
      min: Math.floor(lvl * 2 / 3),
      max: Math.floor(lvl * 3 / 2),
    };
  }, [level]);

  return (
    <div className='space-y-4'>
      <div className='max-w-[160px]'>
        <label className='text-xs text-muted-foreground'>{te('yourLevel')}</label>
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

      {result ? (
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
                <td className='px-3 py-2 text-muted-foreground'>{te('yourLevel')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>{result.level}</td>
              </tr>
              <tr className='border-b bg-muted/20'>
                <td className='px-3 py-2 font-medium'>{te('minLevel')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-semibold'>{result.min}</td>
              </tr>
              <tr className='border-b bg-muted/20'>
                <td className='px-3 py-2 font-medium'>{te('maxLevel')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-semibold'>{result.max}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-4 text-center'>
          {te('enterValidLevel')}
        </p>
      )}
    </div>
  );
}
