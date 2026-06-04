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
type WeaponType = 'lasting' | 'durable' | 'regular';
type CalcMode = 'skill' | 'weapons';

const TRAINER_MULTIPLIER: Record<TrainerType, number> = {
  public: 1.0,
  private: 1.4,
};

const WEAPON_CHARGES: Record<WeaponType, number> = {
  lasting: 1800,
  durable: 900,
  regular: 500,
};

const LOYALTY_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const skillXpForLevel = (type: SkillType, level: number): number => {
  if (type === 'magic') {
    return 160 * level * level * level - 180 * level * level + 376 * level - 160;
  }
  return 50 * level * level * level - 75 * level * level + 205 * level - 110;
};

function calculateHours(
  type: SkillType,
  current: number,
  target: number,
  percent: number,
  multiplier: number,
): number {
  if (target <= current) return 0;
  let hours = 0;
  for (let lvl = current; lvl < target; lvl++) {
    let xp = skillXpForLevel(type, lvl);
    if (lvl === current && percent > 0) {
      xp *= 1 - percent / 100;
    }
    hours += xp / (1800 * (lvl + 3) * multiplier);
  }
  return hours;
}

function calculateTotalXp(type: SkillType, current: number, target: number, percent: number): number {
  if (target <= current) return 0;
  let total = 0;
  for (let lvl = current; lvl < target; lvl++) {
    let xp = skillXpForLevel(type, lvl);
    if (lvl === current && percent > 0) {
      xp *= 1 - percent / 100;
    }
    total += xp;
  }
  return total;
}

function calculateResultingSkill(
  type: SkillType,
  current: number,
  percent: number,
  weaponCount: number,
  multiplier: number,
  chargesPerWeapon: number,
): { skill: number; percentToNext: number; totalCharges: number } {
  let remainingCharges = weaponCount * chargesPerWeapon;
  let level = current;
  const progress = Math.min(Math.max(percent, 0), 100) / 100;
  const MAX_LEVEL = 2000;

  if (progress > 0) {
    const xpNeeded = skillXpForLevel(type, level) * (1 - progress);
    const xpPerCharge = (level + 3) * multiplier;
    const chargesNeeded = Math.ceil(xpNeeded / xpPerCharge);

    if (remainingCharges >= chargesNeeded) {
      remainingCharges -= chargesNeeded;
      level++;
    } else {
      const xpGained = remainingCharges * xpPerCharge;
      const newProgress = (progress * skillXpForLevel(type, level) + xpGained) / skillXpForLevel(type, level);
      const totalUsed = weaponCount * chargesPerWeapon - remainingCharges;
      return { skill: level, percentToNext: newProgress * 100, totalCharges: totalUsed };
    }
  }

  while (level < MAX_LEVEL && remainingCharges > 0) {
    const xpNeeded = skillXpForLevel(type, level);
    const xpPerCharge = (level + 3) * multiplier;
    const chargesNeeded = Math.ceil(xpNeeded / xpPerCharge);

    if (remainingCharges >= chargesNeeded) {
      remainingCharges -= chargesNeeded;
      level++;
    } else {
      const xpGained = remainingCharges * xpPerCharge;
      const newProgress = xpGained / xpNeeded;
      const totalUsed = weaponCount * chargesPerWeapon - remainingCharges;
      return { skill: level, percentToNext: newProgress * 100, totalCharges: totalUsed };
    }
  }

  const totalUsed = weaponCount * chargesPerWeapon - remainingCharges;
  return { skill: level, percentToNext: 0, totalCharges: totalUsed };
}

type SkillResult = {
  type: 'skill';
  weaponsCount: number;
  totalXp: number;
  trainingHours: number;
  totalGpCost: number;
  totalTcCost: number;
  realMoneyCost: number;
  breakdown: { level: number; xp: number; weapons: number }[];
  breakdownTruncated: boolean;
};

type WeaponsResult = {
  type: 'weapons';
  resultingSkill: number;
  resultPercent: number;
  totalCharges: number;
  totalGpCost: number;
  totalTcCost: number;
  realMoneyCost: number;
};

type CalcResult = SkillResult | WeaponsResult;

export function ExerciseWeaponsCalculator() {
  const { t } = useTranslation();
  const ti = (key: string) => t(`exerciseWeapons.${key}`);

  const [calculationMode, setCalculationMode] = useState<CalcMode>('skill');
  const [skillType, setSkillType] = useState<SkillType>('sword');
  const [trainerType, setTrainerType] = useState<TrainerType>('public');
  const [weaponType, setWeaponType] = useState<WeaponType>('lasting');
  const [currentSkill, setCurrentSkill] = useState('');
  const [percentToNext, setPercentToNext] = useState('');
  const [targetSkill, setTargetSkill] = useState('');
  const [weaponCount, setWeaponCount] = useState('');
  const [loyaltyBonus, setLoyaltyBonus] = useState('0');
  const [doubleEvent, setDoubleEvent] = useState(false);
  const [weaponPrice, setWeaponPrice] = useState('200000');
  const [tcPrice, setTcPrice] = useState('1');
  const [tcToMxn, setTcToMxn] = useState('200');
  const [tcToGp, setTcToGp] = useState('');
  const [calculated, setCalculated] = useState(false);

  const result = useMemo((): CalcResult | null => {
    const parsedCurrent = parseInt(currentSkill, 10);
    const parsedTarget = parseInt(targetSkill, 10);
    const parsedCount = parseInt(weaponCount, 10);
    const parsedLoyalty = Math.min(Math.max(parseInt(loyaltyBonus, 10) || 0, 0), 50);
    const parsedPercent = Math.min(Math.max(parseFloat(percentToNext) || 0, 0), 100);
    const effMult = TRAINER_MULTIPLIER[trainerType] * (1 + parsedLoyalty / 100) * (doubleEvent ? 2 : 1);
    const charges = WEAPON_CHARGES[weaponType];
    const pricePerWeaponVal = parseGpInput(weaponPrice);
    const tcPerWeaponVal = parseFloat(tcPrice) || 0;
    const priceOf250Tc = parseFloat(tcToMxn) || 0;

    if (calculationMode === 'skill') {
      if (
        currentSkill === '' || targetSkill === '' ||
        isNaN(parsedCurrent) || isNaN(parsedTarget) ||
        parsedTarget <= parsedCurrent || parsedCurrent < 0
      ) return null;

      const hours = calculateHours(skillType, parsedCurrent, parsedTarget, parsedPercent, effMult);
      const weaponsCount = hours * (1800 / charges);
      const totalXp = calculateTotalXp(skillType, parsedCurrent, parsedTarget, parsedPercent);
      const totalGpCost = weaponsCount * pricePerWeaponVal;
      const totalTcCost = weaponsCount * tcPerWeaponVal;
      const realMoneyCost = (totalTcCost / 250) * priceOf250Tc;
      const weaponTypeFactor = 1800 / charges;

      const maxLevels = Math.min(parsedTarget - parsedCurrent, 200);
      const breakdown: SkillResult['breakdown'] = [];
      for (let i = 0; i < maxLevels; i++) {
        const lvl = parsedCurrent + i;
        let xp = skillXpForLevel(skillType, lvl);
        if (lvl === parsedCurrent && parsedPercent > 0) {
          xp *= 1 - parsedPercent / 100;
        }
        const wps = (xp / (1800 * (lvl + 3) * effMult)) * weaponTypeFactor;
        breakdown.push({ level: lvl, xp, weapons: wps });
      }

      return {
        type: 'skill',
        weaponsCount,
        totalXp,
        trainingHours: hours,
        totalGpCost,
        totalTcCost,
        realMoneyCost,
        breakdown,
        breakdownTruncated: parsedTarget - parsedCurrent > 200,
      };
    } else {
      if (
        currentSkill === '' || weaponCount === '' ||
        isNaN(parsedCurrent) || isNaN(parsedCount) ||
        parsedCount <= 0 || parsedCurrent < 0
      ) return null;

      const resulting = calculateResultingSkill(
        skillType, parsedCurrent, parsedPercent, parsedCount, effMult, charges,
      );

      const totalGpCost = parsedCount * pricePerWeaponVal;
      const totalTcCost = parsedCount * tcPerWeaponVal;
      const realMoneyCost = (totalTcCost / 250) * priceOf250Tc;

      return {
        type: 'weapons',
        resultingSkill: resulting.skill,
        resultPercent: resulting.percentToNext,
        totalCharges: resulting.totalCharges,
        totalGpCost,
        totalTcCost,
        realMoneyCost,
      };
    }
  }, [
    calculationMode, skillType, currentSkill, targetSkill, weaponCount,
    percentToNext, weaponPrice, tcPrice, tcToMxn,
    trainerType, weaponType, loyaltyBonus, doubleEvent,
  ]);

  const isValid = calculationMode === 'skill'
    ? currentSkill !== '' && targetSkill !== '' && !isNaN(parseInt(currentSkill, 10)) && !isNaN(parseInt(targetSkill, 10)) && parseInt(targetSkill, 10) > parseInt(currentSkill, 10) && parseInt(currentSkill, 10) >= 0
    : currentSkill !== '' && weaponCount !== '' && !isNaN(parseInt(currentSkill, 10)) && !isNaN(parseInt(weaponCount, 10)) && parseInt(weaponCount, 10) > 0 && parseInt(currentSkill, 10) >= 0;

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleCopyResults = () => {
    if (!result) return;
    if (result.type === 'skill') {
      const lines = [
        `${ti('weaponsNeeded')}: ${Math.ceil(result.weaponsCount).toLocaleString()}`,
        `${ti('trainingTime')}: ${formatGp(Math.ceil(result.trainingHours))} ${ti('hours')}`,
        `${ti('totalGoldCost')}: ${formatGp(result.totalGpCost)} gp`,
        `${ti('totalTcCost')}: ${Math.ceil(result.totalTcCost).toLocaleString()} TC`,
        `${ti('realMoney')}: $${formatGp(result.realMoneyCost)} MXN`,
      ];
      navigator.clipboard.writeText(lines.join('\n')).then(() => {
        toast.success(ti('resultsCopied'));
      }).catch(() => {
        toast.error(ti('copyFailed'));
      });
    } else {
      const lines = [
        `${ti('resultingSkill')}: ${result.resultingSkill} (${result.resultPercent.toFixed(1)}%)`,
        `${ti('totalGoldCost')}: ${formatGp(result.totalGpCost)} gp`,
        `${ti('totalTcCost')}: ${Math.ceil(result.totalTcCost).toLocaleString()} TC`,
        `${ti('realMoney')}: $${formatGp(result.realMoneyCost)} MXN`,
      ];
      navigator.clipboard.writeText(lines.join('\n')).then(() => {
        toast.success(ti('resultsCopied'));
      }).catch(() => {
        toast.error(ti('copyFailed'));
      });
    }
  };

  const handleClear = () => {
    setCalculationMode('skill');
    setSkillType('sword');
    setTrainerType('public');
    setWeaponType('lasting');
    setCurrentSkill('');
    setPercentToNext('');
    setTargetSkill('');
    setWeaponCount('');
    setLoyaltyBonus('0');
    setDoubleEvent(false);
    setWeaponPrice('200000');
    setTcPrice('1');
    setTcToMxn('200');
    setTcToGp('');
    setCalculated(false);
  };

  const skillOptions: SkillType[] = ['sword', 'axe', 'club', 'distance', 'shielding', 'magic'];
  const weaponTypeOptions: WeaponType[] = ['lasting', 'durable', 'regular'];

  const pricePerWeapon = parseGpInput(weaponPrice);
  const tcPerWeaponVal = parseFloat(tcPrice) || 0;
  const goldPerTc = parseGpInput(tcToGp) || 0;
  const effectiveTcCost = goldPerTc > 0 && pricePerWeapon > 0 ? pricePerWeapon / goldPerTc : 0;

  return (
    <div className='grid w-full items-center gap-4'>
      <div className='flex flex-col gap-2'>
        <Label>{ti('calculationMode')}</Label>
        <div className='flex gap-4'>
          {(['skill', 'weapons'] as CalcMode[]).map((mode) => (
            <label key={mode} className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='calc_mode'
                value={mode}
                checked={calculationMode === mode}
                onChange={() => { setCalculationMode(mode); setCalculated(false); }}
                className='size-4 accent-primary'
              />
              <span className='text-sm'>{ti(mode === 'skill' ? 'targetSkillMode' : 'targetWeaponsMode')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2'>
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

        <div className='flex flex-col gap-2'>
          <Label>{ti('weaponType')}</Label>
          <div className='flex flex-wrap gap-3'>
            {weaponTypeOptions.map((type) => (
              <label key={type} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='weapon_type'
                  value={type}
                  checked={weaponType === type}
                  onChange={() => { setWeaponType(type); setCalculated(false); }}
                  className='size-4 accent-primary'
                />
                <span className='text-sm'>{ti(type)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
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
        <div className='flex flex-col gap-2'>
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
        <div className='flex flex-col gap-2'>
          <Label htmlFor='pct_next'>{ti('percentToNext')}</Label>
          <Input
            id='pct_next'
            type='number'
            min='0'
            max='100'
            step='0.1'
            placeholder='0'
            value={percentToNext}
            onChange={(e) => { setPercentToNext(e.target.value); setCalculated(false); }}
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {calculationMode === 'skill' ? (
          <div className='flex flex-col gap-2'>
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
        ) : (
          <div className='flex flex-col gap-2'>
            <Label htmlFor='weapon_count'>{ti('weaponCount')}</Label>
            <Input
              id='weapon_count'
              type='number'
              min='1'
              max='999999'
              placeholder='100'
              value={weaponCount}
              onChange={(e) => { setWeaponCount(e.target.value); setCalculated(false); }}
            />
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='loyalty'>{ti('loyaltyBonus')}</Label>
          <Select value={loyaltyBonus} onValueChange={(v) => { setLoyaltyBonus(v); setCalculated(false); }}>
            <SelectTrigger id='loyalty'>
              <SelectValue placeholder={ti('loyaltyBonus')} />
            </SelectTrigger>
            <SelectContent position='popper'>
              {LOYALTY_OPTIONS.map((v) => (
                <SelectItem key={v} value={String(v)}>
                  {v}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className='flex items-center gap-2 cursor-pointer'>
        <input
          type='checkbox'
          checked={doubleEvent}
          onChange={(e) => { setDoubleEvent(e.target.checked); setCalculated(false); }}
          className='size-4 accent-primary'
        />
        <span className='text-sm'>{ti('doubleEvent')}</span>
      </label>

      {calculated && result && (
        <>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>{ti('pricing')}</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
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
              <div className='flex flex-col gap-1'>
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
              <div className='flex flex-col gap-1'>
                <Label htmlFor='tc_gp' className='text-xs'>{ti('tcToGp')}</Label>
                <Input
                  id='tc_gp'
                  type='text'
                  inputMode='numeric'
                  value={tcToGp}
                  onChange={(e) => setTcToGp(e.target.value)}
                  className='h-8 text-sm tabular-nums'
                />
              </div>
              <div className='flex flex-col gap-1'>
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
                {result.type === 'skill' ? (
                  <>
                    <tr className='border-b'>
                      <td className='px-3 py-2 text-muted-foreground'>{ti('totalXp')}</td>
                      <td className='px-3 py-2 text-right tabular-nums font-medium'>
                        {formatGp(Math.round(result.totalXp))}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-3 py-2 text-muted-foreground'>{ti('weaponsNeeded')}</td>
                      <td className='px-3 py-2 text-right tabular-nums font-medium'>
                        {Math.ceil(result.weaponsCount).toLocaleString()}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-3 py-2 text-muted-foreground'>{ti('trainingTime')}</td>
                      <td className='px-3 py-2 text-right tabular-nums font-medium'>
                        {formatGp(Math.ceil(result.trainingHours))} {ti('hours')}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className='border-b'>
                      <td className='px-3 py-2 text-muted-foreground'>{ti('resultingSkill')}</td>
                      <td className='px-3 py-2 text-right tabular-nums font-medium'>
                        {result.resultingSkill}
                        <span className='text-muted-foreground ml-1'>
                          ({result.resultPercent.toFixed(1)}%)
                        </span>
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-3 py-2 text-muted-foreground'>{ti('weaponsUsed')}</td>
                      <td className='px-3 py-2 text-right tabular-nums font-medium'>
                        {formatGp(parseInt(weaponCount, 10))}
                      </td>
                    </tr>
                  </>
                )}
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

          {effectiveTcCost > 0 && tcPerWeaponVal > 0 && (
            <div className='rounded-md border px-3 py-2 text-sm'>
              <span className='font-medium'>{ti('purchaseAdvice')}: </span>
              {effectiveTcCost < tcPerWeaponVal ? (
                <span className='text-green-600'>{ti('buyGoldAdvice')}</span>
              ) : (
                <span className='text-green-600'>{ti('buyTcAdvice')}</span>
              )}
            </div>
          )}

          <div className='flex gap-2'>
            <Button variant='outline' size='sm' className='gap-1.5' onClick={handleCopyResults}>
              <Copy className='size-3.5' data-icon />
              {ti('copyResults')}
            </Button>
          </div>

          {result.type === 'skill' && result.breakdown.length > 0 && (
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
                    {result.breakdown.map((row) => (
                      <tr key={row.level} className='border-b'>
                        <td className='px-2 py-1'>{row.level} → {row.level + 1}</td>
                        <td className='px-2 py-1 text-right tabular-nums'>{formatGp(row.xp)}</td>
                        <td className='px-2 py-1 text-right tabular-nums'>{row.weapons.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.breakdownTruncated && (
                  <p className='p-2 text-center text-muted-foreground'>{ti('breakdownTruncated')}</p>
                )}
              </div>
            </details>
          )}
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
