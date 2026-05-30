import { imbuementsItemsIcons } from "@/helpers/imbuements-items-icons";

export const imbuementsTypes = {
  basic: {
    price: 5000,
    successRate: 90,
    priceForFullSucess: 10000,
    premium: false,
  },
  intricate: {
    price: 30000,
    successRate: 70,
    priceForFullSuccess: 30000,
    premium: true,
  },
  powerful: {
    price: 200000,
    successRate: 50,
    priceForFullSuccess: 50000,
    premium: true,
  },
};

export const imbuingsAvailableByType = {
  armors: [
    "deathProtection",
    "energyProtection",
    "holyProtection",
    "iceProtection",
    "earthProtection",
    "fireProtection",
    "lifeLeech",
  ],
  boots: ["velocityIncrease", "paralysisRemoval"],
  bows: [
    "distanceSkill",
    "deathDamage",
    "earthDamage",
    "energyDamage",
    "fireDamage",
    "iceDamage",
    "lifeLeech",
    "manaLeech",
    "criticalDamage",
  ],
  crossbows: [
    "distanceSkill",
    "deathDamage",
    "earthDamage",
    "energyDamage",
    "fireDamage",
    "iceDamage",
    "lifeLeech",
    "manaLeech",
    "criticalDamage",
  ],
  helmets: [
    "axeSkill",
    "clubSkill",
    "swordSkill",
    "shieldingSkill",
    "distanceSkill",
    "magicLevel",
    "manaLeech",
  ], // Magic Level has exceptions
  rods: ["magicLevel", "lifeLeech", "manaLeech", "criticalDamage"], // Critical has exceptions
  wands: ["magicLevel", "lifeLeech", "manaLeech", "criticalDamage"], // Critical has exceptions
  shields: [
    "deathProtection",
    "energyProtection",
    "holyProtection",
    "iceProtection",
    "earthProtection",
    "fireProtection",
    "shieldingSkill",
  ],
  spellbooks: [
    "deathProtection",
    "energyProtection",
    "holyProtection",
    "iceProtection",
    "earthProtection",
    "fireProtection",
    "shieldingSkill",
  ],
  axes: [
    "axeSkill",
    "clubSkill",
    "swordSkill",
    "deathDamage",
    "earthDamage",
    "energyDamage",
    "fireDamage",
    "iceDamage",
    "lifeLeech",
    "manaLeech",
    "criticalDamage",
  ],
  clubs: [
    "axeSkill",
    "clubSkill",
    "swordSkill",
    "deathDamage",
    "earthDamage",
    "energyDamage",
    "fireDamage",
    "iceDamage",
    "lifeLeech",
    "manaLeech",
    "criticalDamage",
  ],
  swords: [
    "axeSkill",
    "clubSkill",
    "swordSkill",
    "deathDamage",
    "earthDamage",
    "energyDamage",
    "fireDamage",
    "iceDamage",
    "lifeLeech",
    "manaLeech",
    "criticalDamage",
  ],
  backpacks: ["capacityIncrease"],
};

// Elemental imbuement IDs grouped by element for conflict detection
export const elementBlockedImbuements: Record<string, string[]> = {
  death: ['deathProtection', 'deathDamage'],
  earth: ['earthProtection', 'earthDamage'],
  energy: ['energyProtection', 'energyDamage'],
  fire: ['fireProtection', 'fireDamage'],
  ice: ['iceProtection', 'iceDamage'],
  holy: ['holyProtection'],
};

const icons = imbuementsItemsIcons;

export const imbuements = {
  deathProtection: {
    name: "Lich Shroud",
    effect: "Death Protection",
    basic: [{ itemName: "Flask of Embalming Fluid", quantity: 25, icon: icons.deathProtection.flaskOfEmbalmingFluidGif }],
    intricate: [
      { itemName: "Flask of Embalming Fluid", quantity: 25, icon: icons.deathProtection.flaskOfEmbalmingFluidGif },
      { itemName: "Gloom Wolf Fur", quantity: 20, icon: icons.deathProtection.gloomWolfFurGif },
    ],
    powerful: [
      { itemName: "Flask of Embalming Fluid", quantity: 25, icon: icons.deathProtection.flaskOfEmbalmingFluidGif },
      { itemName: "Gloom Wolf Fur", quantity: 20, icon: icons.deathProtection.gloomWolfFurGif },
      { itemName: "Mystical Hourglass", quantity: 5, icon: icons.deathProtection.mysticalHourglassGif },
    ],
    icon: "deathProtection",
  },
  energyProtection: {
    name: "Cloud Fabric",
    effect: "Energy Protection",
    basic: [{ itemName: "Wyvern Talisman", quantity: 20, icon: icons.energyProtection.wyvernTalismanGif }],
    intricate: [
      { itemName: "Wyvern Talisman", quantity: 20, icon: icons.energyProtection.wyvernTalismanGif },
      { itemName: "Crawler Head Plating", quantity: 15, icon: icons.energyProtection.crawlerHeadPlatingGif },
    ],
    powerful: [
      { itemName: "Wyvern Talisman", quantity: 20, icon: icons.energyProtection.wyvernTalismanGif },
      { itemName: "Crawler Head Plating", quantity: 15, icon: icons.energyProtection.crawlerHeadPlatingGif },
      { itemName: "Wyrm Scale", quantity: 10, icon: icons.energyProtection.wyrmScaleGif },
    ],
    icon: "energyProtection",
  },
  holyProtection: {
    name: "Demon Presence",
    effect: "Holy Protection",
    basic: [{ itemName: "Cultish Robe", quantity: 25, icon: icons.holyProtection.cultishRobeGif }],
    intricate: [
      { itemName: "Cultish Robe", quantity: 25, icon: icons.holyProtection.cultishRobeGif },
      { itemName: "Cultish Mask", quantity: 25, icon: icons.holyProtection.cultishMaskGif },
    ],
    powerful: [
      { itemName: "Cultish Robe", quantity: 25, icon: icons.holyProtection.cultishRobeGif },
      { itemName: "Cultish Mask", quantity: 25, icon: icons.holyProtection.cultishMaskGif },
      { itemName: "Hellspawn Tail", quantity: 20, icon: icons.holyProtection.hellspawnTailGif },
    ],
    icon: "holyProtection",
  },
  iceProtection: {
    name: "Quara Scale",
    effect: "Ice Protection",
    basic: [{ itemName: "Winter Wolf Fur", quantity: 25, icon: icons.iceProtection.winterWolfFurGif }],
    intricate: [
      { itemName: "Winter Wolf Fur", quantity: 25, icon: icons.iceProtection.winterWolfFurGif },
      { itemName: "Thick Fur", quantity: 15, icon: icons.iceProtection.thickFurGif },
    ],
    powerful: [
      { itemName: "Winter Wolf Fur", quantity: 25, icon: icons.iceProtection.winterWolfFurGif },
      { itemName: "Thick Fur", quantity: 15, icon: icons.iceProtection.thickFurGif },
      { itemName: "Deepling Warts", quantity: 10, icon: icons.iceProtection.deeplingWartsGif },
    ],
    icon: "iceProtection",
  },
  earthProtection: {
    name: "Snake Skin",
    effect: "Earth Protection",
    basic: [{ itemName: "Piece of Swampling Wood", quantity: 25, icon: icons.earthProtection.pieceOfSwamplingWoodGif }],
    intricate: [
      { itemName: "Piece of Swampling Wood", quantity: 25, icon: icons.earthProtection.pieceOfSwamplingWoodGif },
      { itemName: "Snake Skin", quantity: 20, icon: icons.earthProtection.snakeSkinGif },
    ],
    powerful: [
      { itemName: "Piece of Swampling Wood", quantity: 25, icon: icons.earthProtection.pieceOfSwamplingWoodGif },
      { itemName: "Snake Skin", quantity: 20, icon: icons.earthProtection.snakeSkinGif },
      { itemName: "Brimstone Fangs", quantity: 10, icon: icons.earthProtection.brimstoneFangsGif },
    ],
    icon: "earthProtection",
  },
  fireProtection: {
    name: "Dragon Hide",
    effect: "Fire Protection",
    basic: [{ itemName: "Green Dragon Leather", quantity: 20, icon: icons.fireProtection.greenDragonLeatherGif }],
    intricate: [
      { itemName: "Green Dragon Leather", quantity: 20, icon: icons.fireProtection.greenDragonLeatherGif },
      { itemName: "Blazing Bone", quantity: 10, icon: icons.fireProtection.blazingBoneGif },
    ],
    powerful: [
      { itemName: "Green Dragon Leather", quantity: 20, icon: icons.fireProtection.greenDragonLeatherGif },
      { itemName: "Blazing Bone", quantity: 10, icon: icons.fireProtection.blazingBoneGif },
      { itemName: "Draken Sulphur", quantity: 5, icon: icons.fireProtection.drakenSulphurGif },
    ],
    icon: "fireProtection",
  },
  lifeLeech: {
    name: "Vampirism",
    effect: "Life Leech",
    basic: [{ itemName: "Vampire Teeth", quantity: 25, icon: icons.lifeLeech.vampireTeethGif }],
    intricate: [
      { itemName: "Vampire Teeth", quantity: 25, icon: icons.lifeLeech.vampireTeethGif },
      { itemName: "Bloody Pincers", quantity: 15, icon: icons.lifeLeech.bloodyPincersGif },
    ],
    powerful: [
      { itemName: "Vampire Teeth", quantity: 25, icon: icons.lifeLeech.vampireTeethGif },
      { itemName: "Bloody Pincers", quantity: 15, icon: icons.lifeLeech.bloodyPincersGif },
      { itemName: "Piece of Dead Brain", quantity: 5, icon: icons.lifeLeech.pieceOfDeadBrainGif },
    ],
    icon: "lifeLeech",
  },
  velocityIncrease: {
    name: "Swiftness",
    effect: "Velocity Increase",
    basic: [{ itemName: "Damselfly Wing", quantity: 15, icon: icons.velocity.damselflyWingGif }],
    intricate: [
      { itemName: "Damselfly Wing", quantity: 15, icon: icons.velocity.damselflyWingGif },
      { itemName: "Compass", quantity: 25, icon: icons.velocity.compassGif },
    ],
    powerful: [
      { itemName: "Damselfly Wing", quantity: 15, icon: icons.velocity.damselflyWingGif },
      { itemName: "Compass", quantity: 25, icon: icons.velocity.compassGif },
      { itemName: "Waspoid Wing", quantity: 20, icon: icons.velocity.waspoidWingGif },
    ],
    icon: "velocityIncrease",
  },
  paralysisRemoval: {
    name: "Vibrancy",
    effect: "Paralysis Removal",
    basic: [{ itemName: "Wereboar Hooves", quantity: 20, icon: icons.paralysisRemoval.wereboarHoovesGif }],
    intricate: [
      { itemName: "Wereboar Hooves", quantity: 20, icon: icons.paralysisRemoval.wereboarHoovesGif },
      { itemName: "Crystallized Anger", quantity: 15, icon: icons.paralysisRemoval.crystallizedAngerGif },
    ],
    powerful: [
      { itemName: "Wereboar Hooves", quantity: 20, icon: icons.paralysisRemoval.wereboarHoovesGif },
      { itemName: "Crystallized Anger", quantity: 15, icon: icons.paralysisRemoval.crystallizedAngerGif },
      { itemName: "Quill", quantity: 5, icon: icons.paralysisRemoval.quillGif },
    ],
    icon: "paralysisRemoval",
  },
  distanceSkill: {
    name: "Precision",
    effect: "Distance Skill",
    basic: [{ itemName: "Elven Scouting Glass", quantity: 25, icon: icons.distance.elvenScoutingGlassGif }],
    intricate: [
      { itemName: "Elven Scouting Glass", quantity: 25, icon: icons.distance.elvenScoutingGlassGif },
      { itemName: "Elven Hoof", quantity: 20, icon: icons.distance.elvenHoofGif },
    ],
    powerful: [
      { itemName: "Elven Scouting Glass", quantity: 25, icon: icons.distance.elvenScoutingGlassGif },
      { itemName: "Elven Hoof", quantity: 20, icon: icons.distance.elvenHoofGif },
      { itemName: "Metal Spike", quantity: 10, icon: icons.distance.metalSpikeGif },
    ],
    icon: "distanceSkill",
  },
  deathDamage: {
    name: "Reap",
    effect: "Death Damage",
    basic: [{ itemName: "Pile of Grave Earth", quantity: 25, icon: icons.deathDamage.pileOfGraveEarthGif }],
    intricate: [
      { itemName: "Pile of Grave Earth", quantity: 25, icon: icons.deathDamage.pileOfGraveEarthGif },
      { itemName: "Demonic Skeletal Hand", quantity: 20, icon: icons.deathDamage.demonicSkeletalHandGif },
    ],
    powerful: [
      { itemName: "Pile of Grave Earth", quantity: 25, icon: icons.deathDamage.pileOfGraveEarthGif },
      { itemName: "Demonic Skeletal Hand", quantity: 20, icon: icons.deathDamage.demonicSkeletalHandGif },
      { itemName: "Petrified Scream", quantity: 5, icon: icons.deathDamage.petrifiedScreamGif },
    ],
    icon: "deathDamage",
  },
  earthDamage: {
    name: "Venom",
    effect: "Earth Damage",
    basic: [{ itemName: "Swamp Grass", quantity: 25, icon: icons.earthDamage.swampGrassGif }],
    intricate: [
      { itemName: "Swamp Grass", quantity: 25, icon: icons.earthDamage.swampGrassGif },
      { itemName: "Poisonous Slime", quantity: 20, icon: icons.earthDamage.poisonousSlimeGif },
    ],
    powerful: [
      { itemName: "Swamp Grass", quantity: 25, icon: icons.earthDamage.swampGrassGif },
      { itemName: "Poisonous Slime", quantity: 20, icon: icons.earthDamage.poisonousSlimeGif },
      { itemName: "Slime Heart", quantity: 2, icon: icons.earthDamage.slimeHeartGif },
    ],
    icon: "earthDamage",
  },
  energyDamage: {
    name: "Electrify",
    effect: "Energy Damage",
    basic: [{ itemName: "Rorc Feather", quantity: 25, icon: icons.energyDamage.rorcFeatherGif }],
    intricate: [
      { itemName: "Rorc Feather", quantity: 25, icon: icons.energyDamage.rorcFeatherGif },
      { itemName: "Peacock Feather Fan", quantity: 5, icon: icons.energyDamage.peacockFeatherFanGif },
    ],
    powerful: [
      { itemName: "Rorc Feather", quantity: 25, icon: icons.energyDamage.rorcFeatherGif },
      { itemName: "Peacock Feather Fan", quantity: 5, icon: icons.energyDamage.peacockFeatherFanGif },
      { itemName: "Energy Vein", quantity: 1, icon: icons.energyDamage.energyVeinGif },
    ],
    icon: "energyDamage",
  },
  fireDamage: {
    name: "Scorch",
    effect: "Fire Damage",
    basic: [{ itemName: "Fiery Heart", quantity: 25, icon: icons.fireDamage.fieryHeartGif }],
    intricate: [
      { itemName: "Fiery Heart", quantity: 25, icon: icons.fireDamage.fieryHeartGif },
      { itemName: "Green Dragon Scale", quantity: 5, icon: icons.fireDamage.greenDragonScaleGif },
    ],
    powerful: [
      { itemName: "Fiery Heart", quantity: 25, icon: icons.fireDamage.fieryHeartGif },
      { itemName: "Green Dragon Scale", quantity: 5, icon: icons.fireDamage.greenDragonScaleGif },
      { itemName: "Demon Horn", quantity: 5, icon: icons.fireDamage.demonHornGif },
    ],
    icon: "fireDamage",
  },
  iceDamage: {
    name: "Frost",
    effect: "Ice Damage",
    basic: [{ itemName: "Frosty Heart", quantity: 25, icon: icons.iceDamage.frostyHeartGif }],
    intricate: [
      { itemName: "Frosty Heart", quantity: 25, icon: icons.iceDamage.frostyHeartGif },
      { itemName: "Seacrest Hair", quantity: 10, icon: icons.iceDamage.seacrestHairGif },
    ],
    powerful: [
      { itemName: "Frosty Heart", quantity: 25, icon: icons.iceDamage.frostyHeartGif },
      { itemName: "Seacrest Hair", quantity: 10, icon: icons.iceDamage.seacrestHairGif },
      { itemName: "Polar Bear Paw", quantity: 5, icon: icons.iceDamage.polarBearPawGif },
    ],
    icon: "iceDamage",
  },
  manaLeech: {
    name: "Void",
    effect: "Mana Leech",
    basic: [{ itemName: "Rope Belt", quantity: 25, icon: icons.manaLeech.ropeBeltGif }],
    intricate: [
      { itemName: "Rope Belt", quantity: 25, icon: icons.manaLeech.ropeBeltGif },
      { itemName: "Silencer Claws", quantity: 25, icon: icons.manaLeech.silencerClawsGif },
    ],
    powerful: [
      { itemName: "Rope Belt", quantity: 25, icon: icons.manaLeech.ropeBeltGif },
      { itemName: "Silencer Claws", quantity: 25, icon: icons.manaLeech.silencerClawsGif },
      { itemName: "Some Grimeleech Wings", quantity: 5, icon: icons.manaLeech.someGrimeleechWingsGif },
    ],
    icon: "manaLeech",
  },
  criticalDamage: {
    name: "Strike",
    effect: "Critical Damage",
    basic: [{ itemName: "Protective Charm", quantity: 20, icon: icons.criticalDamage.protectiveCharmGif }],
    intricate: [
      { itemName: "Protective Charm", quantity: 20, icon: icons.criticalDamage.protectiveCharmGif },
      { itemName: "Sabretooth", quantity: 25, icon: icons.criticalDamage.sabretoothGif },
    ],
    powerful: [
      { itemName: "Protective Charm", quantity: 20, icon: icons.criticalDamage.protectiveCharmGif },
      { itemName: "Sabretooth", quantity: 25, icon: icons.criticalDamage.sabretoothGif },
      { itemName: "Vexclaw Talon", quantity: 5, icon: icons.criticalDamage.vexclawTalonGif },
    ],
    icon: "criticalDamage",
  },
  axeSkill: {
    name: "Chop",
    effect: "Axe Skill",
    basic: [{ itemName: "Orc Tooth", quantity: 20, icon: icons.axe.orcToothGif }],
    intricate: [
      { itemName: "Orc Tooth", quantity: 20, icon: icons.axe.orcToothGif },
      { itemName: "Battle Stone", quantity: 25, icon: icons.axe.battleStoneGif },
    ],
    powerful: [
      { itemName: "Orc Tooth", quantity: 20, icon: icons.axe.orcToothGif },
      { itemName: "Battle Stone", quantity: 25, icon: icons.axe.battleStoneGif },
      { itemName: "Moohtant Horn", quantity: 20, icon: icons.axe.moohtantHornGif },
    ],
    icon: "axeSkill",
  },
  clubSkill: {
    name: "Bash",
    effect: "Club Skill",
    basic: [{ itemName: "Cyclops Toe", quantity: 20, icon: icons.club.cyclopsToeGif }],
    intricate: [
      { itemName: "Cyclops Toe", quantity: 20, icon: icons.club.cyclopsToeGif },
      { itemName: "Ogre Nose Ring", quantity: 15, icon: icons.club.ogreNoseRingGif },
    ],
    powerful: [
      { itemName: "Cyclops Toe", quantity: 20, icon: icons.club.cyclopsToeGif },
      { itemName: "Ogre Nose Ring", quantity: 15, icon: icons.club.ogreNoseRingGif },
      { itemName: "Warmaster's Wristguards", quantity: 10, icon: icons.club.warmastersWristguardGif },
    ],
    icon: "clubSkill",
  },
  fistSkill: {
    name: "Punch",
    effect: "Fist Fighting Skill",
    basic: [{ itemName: "Ghostly Tissue", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Ghostly Tissue", quantity: 20, icon: "" },
      { itemName: "Mantassin Tail", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Ghostly Tissue", quantity: 20, icon: "" },
      { itemName: "Mantassin Tail", quantity: 25, icon: "" },
      { itemName: "Gold-Brocaded Cloth", quantity: 10, icon: "" },
    ],
    icon: "fistSkill",
  },
  swordSkill: {
    name: "Slash",
    effect: "Sword Skill",
    basic: [{ itemName: "Lion's Mane", quantity: 25, icon: icons.sword.lionsManeGif }],
    intricate: [
      { itemName: "Lion's Mane", quantity: 25, icon: icons.sword.lionsManeGif },
      { itemName: "Mooh'tah Shell", quantity: 25, icon: icons.sword.moohTahShellGif },
    ],
    powerful: [
      { itemName: "Lion's Mane", quantity: 25, icon: icons.sword.lionsManeGif },
      { itemName: "Mooh'tah Shell", quantity: 25, icon: icons.sword.moohTahShellGif },
      { itemName: "War Crystal", quantity: 5, icon: icons.sword.warCrystalGif },
    ],
    icon: "swordSkill",
  },
  shieldingSkill: {
    name: "Blockade",
    effect: "Shielding Skill",
    basic: [{ itemName: "Piece of Scarab Shell", quantity: 20, icon: icons.shielding.pieceOfScarabShellGif }],
    intricate: [
      { itemName: "Piece of Scarab Shell", quantity: 20, icon: icons.shielding.pieceOfScarabShellGif },
      { itemName: "Brimstone Shell", quantity: 25, icon: icons.shielding.brimsontShellGif },
    ],
    powerful: [
      { itemName: "Piece of Scarab Shell", quantity: 20, icon: icons.shielding.pieceOfScarabShellGif },
      { itemName: "Brimstone Shell", quantity: 25, icon: icons.shielding.brimsontShellGif },
      { itemName: "Frazzle Skin", quantity: 25, icon: icons.shielding.frazzleSkinGif },
    ],
    icon: "shieldingSkill",
  },
  magicLevel: {
    name: "Ephifany",
    effect: "Magic Level",
    basic: [{ itemName: "Elvish Talisman", quantity: 25, icon: icons.magicLevel.elvishTalismanGif }],
    intricate: [
      { itemName: "Elvish Talisman", quantity: 25, icon: icons.magicLevel.elvishTalismanGif },
      { itemName: "Broken Shamanic Staff", quantity: 15, icon: icons.magicLevel.brokenShamanicStaffGif },
    ],
    powerful: [
      { itemName: "Elvish Talisman", quantity: 25, icon: icons.magicLevel.elvishTalismanGif },
      { itemName: "Broken Shamanic Staff", quantity: 15, icon: icons.magicLevel.brokenShamanicStaffGif },
      { itemName: "Strand of Medusa Hair", quantity: 15, icon: icons.magicLevel.strandOfMedusaHairGif },
    ],
    icon: "magicLevel",
  },
  capacityIncrease: {
    name: "Featherweight",
    effect: "Capacity Increase",
    basic: [{ itemName: "Fairy Wings", quantity: 20, icon: icons.capacityIncrease.fairyWingsGif }],
    intricate: [
      { itemName: "Fairy Wings", quantity: 20, icon: icons.capacityIncrease.fairyWingsGif },
      { itemName: "Little Bowl of Myrrh", quantity: 10, icon: icons.capacityIncrease.littleBowlOfMyrrhGif },
    ],
    powerful: [
      { itemName: "Fairy Wings", quantity: 20, icon: icons.capacityIncrease.fairyWingsGif },
      { itemName: "Little Bowl of Myrrh", quantity: 10, icon: icons.capacityIncrease.littleBowlOfMyrrhGif },
      { itemName: "Goosebump Leather", quantity: 5, icon: icons.capacityIncrease.goosebumpLeatherGif },
    ],
    icon: "capacityIncrease",
  },
};
