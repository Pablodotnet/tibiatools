import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { formatGp, parseGpInput } from '@/helpers/exaltationForge';

type SkillType = 'sword' | 'axe' | 'club' | 'distance' | 'shielding' | 'magic';
type TrainerType = 'public' | 'private';

const TRAINER_MULTIPLIER: Record<TrainerType, number> = {
  public: 1.0,
  private: 1.4,
};

const skillXpForLevel = (type: SkillType, level: number): number => {
  if (type === 'magic') {
    return 160 * level * level * level - 180 * level * level + 376 * level - 160;
  }
  return 50 * level * level * level - 75 * level * level + 205 * level - 110;
};

const xpPerHour = (level: number, multiplier: number): number => {
  return 1800 * (level + 3) * multiplier;
};

function calculateWeapons(type: SkillType, current: number, target: number, multiplier: number): number {
  if (target <= current) return 0;
  let weapons = 0;
  for (let lvl = current; lvl < target; lvl++) {
    weapons += skillXpForLevel(type, lvl) / xpPerHour(lvl, multiplier);
  }
  return weapons;
}

function calculateTotalXp(type: SkillType, current: number, target: number): number {
  if (target <= current) return 0;
  let total = 0;
  for (let lvl = current; lvl < target; lvl++) {
    total += skillXpForLevel(type, lvl);
  }
  return total;
}

export function ExerciseWeaponsCalculator() {
  const { t } = useTranslation();
  const ti = (key: string) => t(`exerciseWeapons.${key}`);

  const [skillType, setSkillType] = useState<SkillType>('sword');
  const [trainerType, setTrainerType] = useState<TrainerType>('public');
  const [currentSkill, setCurrentSkill] = useState('');
  const [targetSkill, setTargetSkill] = useState('');
  const [weaponPrice, setWeaponPrice] = useState('200000');
  const [tcPrice, setTcPrice] = useState('1');
  const [tcToMxn, setTcToMxn] = useState('200');
  const [calculated, setCalculated] = useState(false);

  const current = parseInt(currentSkill, 10);
  const target = parseInt(targetSkill, 10);
  const isValid = currentSkill !== '' && targetSkill !== '' && !isNaN(current) && !isNaN(target) && target > current && current >= 0;
  const multiplier = TRAINER_MULTIPLIER[trainerType];

  const result = useMemo(() => {
    if (!isValid) return null;
    const weapons = calculateWeapons(skillType, current, target, multiplier);
    const totalXp = calculateTotalXp(skillType, current, target);
    const pricePerWeapon = parseGpInput(weaponPrice);
    const tcPerWeapon = parseFloat(tcPrice) || 0;
    const totalGpCost = weapons * pricePerWeapon;
    const totalTcCost = weapons * tcPerWeapon;
    const pricePer250Tc = parseFloat(tcToMxn) || 0;
    const realMoneyCost = (totalTcCost / 250) * pricePer250Tc;
    return { weapons, totalXp, totalGpCost, totalTcCost, realMoneyCost };
  }, [isValid, skillType, current, target, weaponPrice, tcPrice, tcToMxn, trainerType]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleCopyResults = () => {
    if (!result) return;
    const lines = [
      `${ti('weaponsNeeded')}: ${Math.ceil(result.weapons).toLocaleString()}`,
      `${ti('trainingTime')}: ${Math.ceil(result.weapons).toLocaleString()} ${ti('hours')}`,
      `${ti('totalGoldCost')}: ${formatGp(result.totalGpCost)} gp`,
      `${ti('totalTcCost')}: ${Math.ceil(result.totalTcCost).toLocaleString()} TC`,
      `${ti('realMoney')}: $${formatGp(result.realMoneyCost)} MXN`,
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      toast.success(ti('resultsCopied'));
    }).catch(() => {
      toast.error(ti('copyFailed'));
    });
  };

  const handleClear = () => {
    setSkillType('sword');
    setTrainerType('public');
    setCurrentSkill('');
    setTargetSkill('');
    setWeaponPrice('200000');
    setTcPrice('1');
    setTcToMxn('200');
    setCalculated(false);
  };

  const skillOptions: SkillType[] = ['sword', 'axe', 'club', 'distance', 'shielding', 'magic'];

  return (
    <div className='grid w-full items-center gap-4'>
      <div className='flex flex-col space-y-2'>
        <Label htmlFor='skill_type'>{ti('skillType')}</Label>
        <Select onValueChange={(v) => { setSkillType(v as SkillType); setCalculated(false); }} value={skillType}>
          <SelectTrigger id='skill_type'>
            <SelectValue placeholder={ti('selectSkillType')} />
          </SelectTrigger>
          <SelectContent position='popper'>
            {skillOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {ti(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col space-y-2'>
        <Label>{ti('trainerType')}</Label>
        <div className='flex gap-4'>
          {(['public', 'private'] as TrainerType[]).map((type) => (
            <label key={type} className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='trainer_type'
                value={type}
                checked={trainerType === type}
                onChange={() => { setTrainerType(type); setCalculated(false); }}
                className='size-4 accent-primary'
              />
              <span className='text-sm'>{ti(type)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col space-y-2'>
          <Label htmlFor='current_skill'>{ti('currentSkill')}</Label>
          <Input
            id='current_skill'
            type='number'
            min='0'
            max='2000'
            placeholder='10'
            value={currentSkill}
            onChange={(e) => { setCurrentSkill(e.target.value); setCalculated(false); }}
          />
        </div>
        <div className='flex flex-col space-y-2'>
          <Label htmlFor='target_skill'>{ti('targetSkill')}</Label>
          <Input
            id='target_skill'
            type='number'
            min='0'
            max='2000'
            placeholder='20'
            value={targetSkill}
            onChange={(e) => { setTargetSkill(e.target.value); setCalculated(false); }}
          />
        </div>
      </div>

      {calculated && isValid && result && (
        <>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>{ti('pricing')}</h3>
            <div className='grid grid-cols-3 gap-4'>
              <div className='flex flex-col space-y-1'>
                <Label htmlFor='wp_price' className='text-xs'>{ti('weaponPrice')}</Label>
                <Input
                  id='wp_price'
                  type='text'
                  inputMode='numeric'
                  value={weaponPrice}
                  onChange={(e) => setWeaponPrice(e.target.value)}
                  className='h-8 text-sm tabular-nums'
                />
              </div>
              <div className='flex flex-col space-y-1'>
                <Label htmlFor='tc_price' className='text-xs'>{ti('tcPerWeapon')}</Label>
                <Input
                  id='tc_price'
                  type='text'
                  inputMode='decimal'
                  value={tcPrice}
                  onChange={(e) => setTcPrice(e.target.value)}
                  className='h-8 text-sm tabular-nums'
                />
              </div>
              <div className='flex flex-col space-y-1'>
                <Label htmlFor='tc_mxn' className='text-xs'>{ti('tcToMxn')}</Label>
                <Input
                  id='tc_mxn'
                  type='text'
                  inputMode='numeric'
                  value={tcToMxn}
                  onChange={(e) => setTcToMxn(e.target.value)}
                  className='h-8 text-sm tabular-nums'
                />
              </div>
            </div>
          </div>

          <div className='rounded-md border'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/50'>
                  <th className='px-3 py-2 text-left font-medium' colSpan={2}>
                    {ti('results')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b'>
                  <td className='px-3 py-2 text-muted-foreground'>{ti('totalXp')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {formatGp(Math.round(result.totalXp))}
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='px-3 py-2 text-muted-foreground'>{ti('weaponsNeeded')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {Math.ceil(result.weapons).toLocaleString()}
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='px-3 py-2 text-muted-foreground'>{ti('trainingTime')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {formatGp(Math.ceil(result.weapons))} {ti('hours')}
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='px-3 py-2 text-muted-foreground'>{ti('totalGoldCost')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {formatGp(result.totalGpCost)} gp
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='px-3 py-2 text-muted-foreground'>{ti('totalTcCost')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-medium'>
                    {Math.ceil(result.totalTcCost).toLocaleString()} TC
                  </td>
                </tr>
                <tr className='border-b bg-primary/5'>
                  <td className='px-3 py-2 font-medium'>{ti('realMoney')}</td>
                  <td className='px-3 py-2 text-right tabular-nums font-bold'>
                    ${formatGp(result.realMoneyCost)} MXN
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='flex gap-2'>
            <Button variant='outline' size='sm' className='gap-1.5' onClick={handleCopyResults}>
              <Copy className='size-3.5' />
              {ti('copyResults')}
            </Button>
          </div>

          <details className='text-xs text-muted-foreground'>
            <summary className='cursor-pointer font-medium'>{ti('perLevelBreakdown')}</summary>
            <div className='mt-2 max-h-48 overflow-y-auto rounded border'>
              <table className='w-full text-xs'>
                <thead className='sticky top-0 bg-muted'>
                  <tr>
                    <th className='px-2 py-1 text-left'>{ti('level')}</th>
                    <th className='px-2 py-1 text-right'>{ti('xpNeeded')}</th>
                    <th className='px-2 py-1 text-right'>{ti('weaponsForLevel')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(target - current, 200) }, (_, i) => {
                    const lvl = current + i;
                    const xp = skillXpForLevel(skillType, lvl);
                    const wps = xp / xpPerHour(lvl, multiplier);
                    return (
                      <tr key={lvl} className='border-b'>
                        <td className='px-2 py-1'>{lvl} → {lvl + 1}</td>
                        <td className='px-2 py-1 text-right tabular-nums'>{formatGp(xp)}</td>
                        <td className='px-2 py-1 text-right tabular-nums'>{wps.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {target - current > 200 && (
                <p className='p-2 text-center text-muted-foreground'>{ti('breakdownTruncated')}</p>
              )}
            </div>
          </details>
        </>
      )}

      <div className='flex gap-2'>
        <Button onClick={handleCalculate} disabled={!isValid}>
          {ti('calculate')}
        </Button>
        <Button variant='outline' onClick={handleClear}>
          {ti('clear')}
        </Button>
      </div>
    </div>
  );
}
