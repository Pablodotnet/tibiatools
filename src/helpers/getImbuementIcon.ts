import axeSkillIcon from "@/assets/imbuements/axeSkill.png";
import capacityIncreaseIcon from "@/assets/imbuements/capacityIncrease.png";
import clubSkillIcon from "@/assets/imbuements/clubSkill.png";
import criticalDamageIcon from "@/assets/imbuements/criticalDamage.png";
import deathDamageIcon from "@/assets/imbuements/deathDamage.png";
import deathProtectionIcon from "@/assets/imbuements/deathProtection.png";
import distanceSkillIcon from "@/assets/imbuements/distanceSkill.png";
import earthDamageIcon from "@/assets/imbuements/earthDamage.png";
import earthProtectionIcon from "@/assets/imbuements/earthProtection.png";
import energyDamageIcon from "@/assets/imbuements/energyDamage.png";
import energyProtectionIcon from "@/assets/imbuements/energyProtection.png";
import fireDamageIcon from "@/assets/imbuements/fireDamage.png";
import fireProtectionIcon from "@/assets/imbuements/fireProtection.png";
import fistSkillIcon from "@/assets/imbuements/fistSkill.png";
import holyProtectionIcon from "@/assets/imbuements/holyProtection.png";
import iceDamageIcon from "@/assets/imbuements/iceDamage.png";
import iceProtectionIcon from "@/assets/imbuements/iceProtection.png";
import lifeLeechIcon from "@/assets/imbuements/lifeLeech.png";
import magicLevelIcon from "@/assets/imbuements/magicLevel.png";
import manaLeechIcon from "@/assets/imbuements/manaLeech.png";
import paralysisRemovalIcon from "@/assets/imbuements/paralysisRemoval.png";
import shieldingSkillIcon from "@/assets/imbuements/shieldingSkill.png";
import swordSkillIcon from "@/assets/imbuements/swordSkill.png";
import velocityIncreaseIcon from "@/assets/imbuements/velocityIncrease.png";

const imbuementsIcons: Record<string, string> = {
  axeSkill: axeSkillIcon,
  capacityIncrease: capacityIncreaseIcon,
  clubSkill: clubSkillIcon,
  criticalDamage: criticalDamageIcon,
  deathDamage: deathDamageIcon,
  deathProtection: deathProtectionIcon,
  distanceSkill: distanceSkillIcon,
  earthDamage: earthDamageIcon,
  earthProtection: earthProtectionIcon,
  energyDamage: energyDamageIcon,
  energyProtection: energyProtectionIcon,
  fireDamage: fireDamageIcon,
  fireProtection: fireProtectionIcon,
  fistSkill: fistSkillIcon,
  holyProtection: holyProtectionIcon,
  iceDamage: iceDamageIcon,
  iceProtection: iceProtectionIcon,
  lifeLeech: lifeLeechIcon,
  magicLevel: magicLevelIcon,
  manaLeech: manaLeechIcon,
  paralysisRemoval: paralysisRemovalIcon,
  shieldingSkill: shieldingSkillIcon,
  swordSkill: swordSkillIcon,
  velocityIncrease: velocityIncreaseIcon,
};

export const getImbuementIcon = (iconName: string) =>
  imbuementsIcons[iconName] || "";
