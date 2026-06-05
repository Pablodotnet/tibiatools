import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { calculateLevel, xpToNextLevel } from '@/helpers/levelCalculator';
import { formatGp } from '@/helpers/exaltationForge';

function Field({ label, value, onChange, min, max }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
}) {
  return (
    <div className='space-y-1'>
      <label className='text-xs text-muted-foreground'>{label}</label>
      <Input
        type='number'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className='h-8'
      />
    </div>
  );
}

export function LevelCalculator() {
  const { t } = useTranslation();
  const te = (key: string) => t(`levelCalculator.${key}`);

  const [currentLevel, setCurrentLevel] = useState('100');
  const [currentPercent, setCurrentPercent] = useState('0');
  const [targetLevel, setTargetLevel] = useState('150');

  const result = useMemo(() => {
    const cur = parseInt(currentLevel, 10);
    const tgt = parseInt(targetLevel, 10);
    const pct = Math.min(Math.max(parseFloat(currentPercent) || 0, 0), 99);
    if (isNaN(cur) || isNaN(tgt) || tgt <= cur || cur < 1) return null;
    return calculateLevel({ currentLevel: cur, currentPercent: pct, targetLevel: tgt });
  }, [currentLevel, currentPercent, targetLevel]);

  const nextXp = useMemo(() => {
    const cur = parseInt(currentLevel, 10);
    if (isNaN(cur) || cur < 1) return 0;
    return xpToNextLevel(cur);
  }, [currentLevel]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-3 gap-3'>
        <Field label={te('currentLevel')} value={currentLevel} onChange={setCurrentLevel} min={1} max={99999} />
        <Field label={te('percentToNext')} value={currentPercent} onChange={setCurrentPercent} min={0} max={99} />
        <Field label={te('targetLevel')} value={targetLevel} onChange={setTargetLevel} min={1} max={99999} />
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
                <td className='px-3 py-2 text-muted-foreground'>{te('currentLevel')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>
                  {result.currentLevel} ({result.currentPercent.toFixed(1)}%)
                </td>
              </tr>
              <tr className='border-b'>
                <td className='px-3 py-2 text-muted-foreground'>{te('targetLevel')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>{result.targetLevel}</td>
              </tr>
              <tr className='border-b'>
                <td className='px-3 py-2 text-muted-foreground'>{te('xpToNextLevel')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>{formatGp(nextXp)}</td>
              </tr>
              <tr className='border-b bg-muted/20'>
                <td className='px-3 py-2 font-medium'>{te('xpNeeded')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-semibold'>{formatGp(result.xpNeeded)}</td>
              </tr>
              <tr className='border-b bg-muted/20'>
                <td className='px-3 py-2 font-medium'>{te('levelsGained')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-semibold'>{result.levelsGained}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-4 text-center'>
          {te('enterValidValues')}
        </p>
      )}
    </div>
  );
}
