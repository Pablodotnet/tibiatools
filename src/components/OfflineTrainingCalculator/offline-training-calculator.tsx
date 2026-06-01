import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VocationsIcons } from '@/helpers/vocations-icons';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  type VocationId,
  type SkillType,
  type TrainingType,
  type OfflineTrainingResult,
  calculateOfflineTrainingToSkill,
  calculateOfflineTrainingByTime,
} from '@/helpers/offlineTraining';

const VOCATIONS: { id: VocationId; name: string; icon: string }[] = [
  { id: 'knight', name: 'Knight', icon: VocationsIcons.knightGif },
  { id: 'paladin', name: 'Paladin', icon: VocationsIcons.paladinGif },
  { id: 'sorcerer', name: 'Sorcerer', icon: VocationsIcons.sorcererGif },
  { id: 'druid', name: 'Druid', icon: VocationsIcons.druidGif },
  { id: 'monk', name: 'Monk', icon: VocationsIcons.monkGif },
];

const VOCATION_SKILLS: Record<VocationId, { skill: SkillType; label: string }[]> = {
  knight: [{ skill: 'melee', label: 'Melee' }, { skill: 'shielding', label: 'Shielding' }],
  paladin: [{ skill: 'distance', label: 'Distance' }, { skill: 'shielding', label: 'Shielding' }],
  sorcerer: [{ skill: 'magic', label: 'Magic Level' }],
  druid: [{ skill: 'magic', label: 'Magic Level' }],
  monk: [{ skill: 'fist', label: 'Fist' }, { skill: 'shielding', label: 'Shielding' }],
};

const LOYALTY_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

function formatDays(days: number): string {
  const total = Math.ceil(days * 10) / 10;
  if (total < 1) return '< 1';
  return total.toFixed(1);
}

function formatHours(hours: number): string {
  const d = Math.floor(hours / 24);
  const h = Math.round(hours % 24);
  if (d > 0) return `${d}d ${h}h`;
  return `${h}h`;
}

function MinMaxInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
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

export function OfflineTrainingCalculator() {
  const { t } = useTranslation();
  const te = (key: string) => t(`offlineTraining.${key}`);

  const [vocation, setVocation] = useState<VocationId>('knight');
  const [skill, setSkill] = useState<SkillType>('melee');
  const [trainingType, setTrainingType] = useState<TrainingType>('offline');
  const [mode, setMode] = useState<'toSkill' | 'byTime'>('toSkill');

  const [currentSkill, setCurrentSkill] = useState('80');
  const [currentPercent, setCurrentPercent] = useState('0');
  const [targetSkill, setTargetSkill] = useState('90');
  const [trainingHours, setTrainingHours] = useState('168');
  const [loyalty, setLoyalty] = useState(0);

  const skillOptions = VOCATION_SKILLS[vocation];

  const result = useMemo<OfflineTrainingResult | null>(() => {
    const cur = parseInt(currentSkill, 10);
    const pct = Math.min(Math.max(parseFloat(currentPercent) || 0, 0), 99);
    if (isNaN(cur) || cur < 0) return null;

    if (mode === 'toSkill') {
      const tgt = parseInt(targetSkill, 10);
      if (isNaN(tgt) || tgt <= cur) return null;
      return calculateOfflineTrainingToSkill({
        vocation,
        skill,
        currentSkill: cur,
        currentPercent: pct,
        targetSkill: tgt,
        loyaltyPercent: loyalty,
      }, trainingType);
    }

    const hrs = parseFloat(trainingHours) || 0;
    if (hrs <= 0) return null;
    return calculateOfflineTrainingByTime({
      vocation,
      skill,
      currentSkill: cur,
      currentPercent: pct,
      trainingHours: hrs,
      loyaltyPercent: loyalty,
    }, trainingType);
  }, [vocation, skill, mode, currentSkill, currentPercent, targetSkill, trainingHours, loyalty, trainingType]);

  const handleVocationChange = (v: VocationId) => {
    setVocation(v);
    const firstSkill = VOCATION_SKILLS[v][0]?.skill ?? 'melee';
    setSkill(firstSkill);
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        {VOCATIONS.map((v) => {
          const active = v.id === vocation;
          return (
            <button
              key={v.id}
              onClick={() => handleVocationChange(v.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              <img src={v.icon} alt={v.name} className='size-5' />
              {v.name}
            </button>
          );
        })}
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <div className='space-y-1'>
          <label className='text-xs text-muted-foreground'>{te('skillType')}</label>
          <div className='flex flex-wrap gap-1'>
            {skillOptions.map((opt) => {
              const active = opt.skill === skill;
              return (
                <button
                  key={opt.skill}
                  onClick={() => setSkill(opt.skill)}
                  className={`px-2 py-1 text-xs rounded border cursor-pointer transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:bg-accent'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className='space-y-1'>
          <label className='text-xs text-muted-foreground'>{te('trainingType')}</label>
          <div className='flex gap-1'>
            {(['offline', 'online'] as TrainingType[]).map((type) => (
              <button
                key={type}
                onClick={() => setTrainingType(type)}
                className={`px-2 py-1 text-xs rounded border cursor-pointer transition-colors ${
                  trainingType === type
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent'
                }`}
              >
                {te(type)}
              </button>
            ))}
          </div>
        </div>

        <div className='space-y-1'>
          <label className='text-xs text-muted-foreground'>{te('mode')}</label>
          <div className='flex gap-1'>
            <button
              onClick={() => setMode('toSkill')}
              className={`px-2 py-1 text-xs rounded border cursor-pointer transition-colors ${
                mode === 'toSkill'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent'
              }`}
            >
              {te('toSkill')}
            </button>
            <button
              onClick={() => setMode('byTime')}
              className={`px-2 py-1 text-xs rounded border cursor-pointer transition-colors ${
                mode === 'byTime'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent'
              }`}
            >
              {te('byTime')}
            </button>
          </div>
        </div>

        <div className='space-y-1'>
          <label className='text-xs text-muted-foreground'>{te('loyalty')}</label>
          <select
            value={loyalty}
            onChange={(e) => setLoyalty(parseInt(e.target.value, 10))}
            className='flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs'
          >
            {LOYALTY_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}%
              </option>
            ))}
          </select>
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <MinMaxInput label={te('currentSkill')} value={currentSkill} onChange={setCurrentSkill} min={0} max={9999} />
        <MinMaxInput label={te('percentToNext')} value={currentPercent} onChange={setCurrentPercent} min={0} max={99} />
        {mode === 'toSkill' ? (
          <MinMaxInput label={te('targetSkill')} value={targetSkill} onChange={setTargetSkill} min={1} max={9999} />
        ) : (
          <MinMaxInput label={te('trainingHours')} value={trainingHours} onChange={setTrainingHours} min={1} max={99999} />
        )}
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
                <td className='px-3 py-2 text-muted-foreground'>{te('startingSkill')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>
                  {result.startingSkill} ({parseFloat(currentPercent || '0').toFixed(1)}%)
                </td>
              </tr>
              <tr className='border-b'>
                <td className='px-3 py-2 text-muted-foreground'>{te('endingSkill')}</td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>
                  {result.endingSkill} ({result.endingPercent.toFixed(1)}%)
                </td>
              </tr>
              <tr className='border-b'>
                <td className='px-3 py-2 text-muted-foreground'>
                  {trainingType === 'offline' ? te('trainingTime') : te('totalTime')}
                </td>
                <td className='px-3 py-2 text-right tabular-nums font-medium'>
                  {formatHours(result.totalMinutes / 60)}
                </td>
              </tr>
              {trainingType === 'offline' && (
                <>
                  <tr className='border-b bg-muted/20'>
                    <td className='px-3 py-2 font-medium'>{te('realDays')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-semibold'>
                      {formatDays(result.trainingDays)} {te('days')}
                    </td>
                  </tr>
                  <tr className='border-b bg-muted/20'>
                    <td className='px-3 py-2 font-medium'>{te('sessions12h')}</td>
                    <td className='px-3 py-2 text-right tabular-nums font-semibold'>
                      {result.sessions12h}
                    </td>
                  </tr>
                </>
              )}
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
