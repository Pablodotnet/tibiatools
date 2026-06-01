export type SkillType = 'melee' | 'distance' | 'shielding' | 'magic' | 'fist';

export type VocationId = 'knight' | 'paladin' | 'sorcerer' | 'druid' | 'monk';

export type TrainingType = 'offline' | 'online';

type VocationSkillConfig = {
  skillConstant: number;
  vocationConstant: number;
  skillOffset: number;
  offlineSpPerMinute: number;
};

const SKILL_OFFSET_NON_MAGIC = 10;
const SKILL_OFFSET_MAGIC = 0;

const SKILL_CONSTANTS: Record<SkillType, number> = {
  melee: 50,
  distance: 30,
  shielding: 100,
  magic: 1600,
  fist: 50,
};

const VOCATION_CONSTANTS: Record<VocationId, Record<SkillType, number>> = {
  knight: { melee: 1.1, distance: 1.4, shielding: 1.1, magic: 3.0, fist: 1.1 },
  paladin: { melee: 1.2, distance: 1.1, shielding: 1.1, magic: 1.4, fist: 1.2 },
  sorcerer: { melee: 2.0, distance: 2.0, shielding: 1.5, magic: 1.1, fist: 1.5 },
  druid: { melee: 1.8, distance: 1.8, shielding: 1.5, magic: 1.1, fist: 1.5 },
  monk: { melee: 1.4, distance: 1.5, shielding: 1.15, magic: 1.25, fist: 1.1 },
};

const OFFLINE_SP_PER_MINUTE: Record<SkillType, number> = {
  melee: 15,
  distance: 12,
  shielding: 15,
  magic: 30,
  fist: 15,
};

export function getSkillConfig(vocation: VocationId, skill: SkillType): VocationSkillConfig {
  return {
    skillConstant: SKILL_CONSTANTS[skill],
    vocationConstant: VOCATION_CONSTANTS[vocation][skill],
    skillOffset: skill === 'magic' ? SKILL_OFFSET_MAGIC : SKILL_OFFSET_NON_MAGIC,
    offlineSpPerMinute: OFFLINE_SP_PER_MINUTE[skill],
  };
}

export function spToNextLevel(skillLevel: number, config: VocationSkillConfig): number {
  return config.skillConstant * Math.pow(config.vocationConstant, skillLevel - config.skillOffset);
}

export function cumulativeSpTo(skillLevel: number, config: VocationSkillConfig): number {
  const { skillConstant, vocationConstant, skillOffset } = config;
  if (skillLevel <= skillOffset) return 0;
  const b = vocationConstant;
  const n = skillLevel - skillOffset;
  return skillConstant * (Math.pow(b, n) - 1) / (b - 1);
}

export function skillFromTotalSp(totalSp: number, config: VocationSkillConfig): number {
  const { skillConstant, vocationConstant, skillOffset } = config;
  const b = vocationConstant;
  return Math.log(totalSp * (b - 1) / skillConstant + 1) / Math.log(b) + skillOffset;
}

export function spToPercentThrough(prevSkill: number, spProgress: number, config: VocationSkillConfig): number {
  const needed = spToNextLevel(prevSkill, config);
  if (needed <= 0) return 0;
  return Math.min(spProgress / needed * 100, 99.9);
}

export type OfflineTrainingInput = {
  vocation: VocationId;
  skill: SkillType;
  currentSkill: number;
  currentPercent: number;
  targetSkill: number;
  loyaltyPercent: number;
};

export type OfflineTrainingInputTime = {
  vocation: VocationId;
  skill: SkillType;
  currentSkill: number;
  currentPercent: number;
  trainingHours: number;
  loyaltyPercent: number;
};

export type OfflineTrainingResult = {
  startingTotalSp: number;
  finalTotalSp: number;
  startingSkill: number;
  endingSkill: number;
  endingPercent: number;
  totalSpGained: number;
  totalMinutes: number;
  trainingDays: number;
  sessions12h: number;
};

function spPerMinOnline(level: number, loyaltyPercent: number): number {
  return (level + 3) * 30 * (1 + loyaltyPercent / 100);
}

function buildResult(
  config: VocationSkillConfig,
  startingSkill: number,
  startingTotalSp: number,
  totalSpGained: number,
  totalMinutes: number,
  trainingType: TrainingType,
): OfflineTrainingResult {
  const finalTotalSp = startingTotalSp + totalSpGained;
  const endingSkill = Math.floor(skillFromTotalSp(finalTotalSp, config));
  const endingPercent = spToPercentThrough(endingSkill, finalTotalSp - cumulativeSpTo(endingSkill, config), config);

  return {
    startingTotalSp,
    finalTotalSp,
    startingSkill,
    endingSkill,
    endingPercent,
    totalSpGained,
    totalMinutes,
    trainingDays: trainingType === 'offline' ? totalMinutes / (60 * 12) : totalMinutes / (60 * 24),
    sessions12h: Math.ceil(totalMinutes / (60 * 12)),
  };
}

export function calculateOfflineTrainingToSkill(
  input: OfflineTrainingInput,
  trainingType: TrainingType = 'offline',
): OfflineTrainingResult {
  const config = getSkillConfig(input.vocation, input.skill);

  const spSoFar = cumulativeSpTo(input.currentSkill, config);
  const spIntoCurrent = spToNextLevel(input.currentSkill, config) * input.currentPercent / 100;
  const startingTotalSp = spSoFar + spIntoCurrent;

  const targetTotalSp = cumulativeSpTo(input.targetSkill, config);
  const spNeeded = targetTotalSp - startingTotalSp;

  let totalMinutes: number;

  if (trainingType === 'online') {
    totalMinutes = 0;
    for (let lvl = input.currentSkill; lvl < input.targetSkill; lvl++) {
      let needed = spToNextLevel(lvl, config);
      if (lvl === input.currentSkill) {
        needed -= spIntoCurrent;
      }
      totalMinutes += needed / spPerMinOnline(lvl, input.loyaltyPercent);
    }
  } else {
    const spPerMin = config.offlineSpPerMinute * (1 + input.loyaltyPercent / 100);
    totalMinutes = spNeeded / spPerMin;
  }

  return buildResult(config, input.currentSkill, startingTotalSp, spNeeded, totalMinutes, trainingType);
}

export function calculateOfflineTrainingByTime(
  input: OfflineTrainingInputTime,
  trainingType: TrainingType = 'offline',
): OfflineTrainingResult {
  const config = getSkillConfig(input.vocation, input.skill);

  const spSoFar = cumulativeSpTo(input.currentSkill, config);
  const spIntoCurrent = spToNextLevel(input.currentSkill, config) * input.currentPercent / 100;
  const startingTotalSp = spSoFar + spIntoCurrent;

  const totalMinutes = input.trainingHours * 60;

  let spGained: number;

  if (trainingType === 'online') {
    let remainingMinutes = totalMinutes;
    let lvl = input.currentSkill;
    let progress = input.currentPercent;
    spGained = 0;

    while (remainingMinutes > 0 && lvl < 9999) {
      const needed = spToNextLevel(lvl, config) * (1 - progress / 100);
      const perMin = spPerMinOnline(lvl, input.loyaltyPercent);
      const minutesNeeded = needed / perMin;

      if (remainingMinutes >= minutesNeeded) {
        remainingMinutes -= minutesNeeded;
        spGained += needed;
        lvl++;
        progress = 0;
      } else {
        spGained += remainingMinutes * perMin;
        remainingMinutes = 0;
      }
    }
  } else {
    const spPerMin = config.offlineSpPerMinute * (1 + input.loyaltyPercent / 100);
    spGained = spPerMin * totalMinutes;
  }

  return buildResult(config, input.currentSkill, startingTotalSp, spGained, totalMinutes, trainingType);
}
