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

export const imbuements = {
  deathProtection: {
    name: "Lich Shroud",
    effect: "Death Protection",
    basic: [
      {
        itemName: "Flask of Embalming Fluid",
        quantity: 25,
        icon: imbuementsItemsIcons.deathProtection.flaskOfEmbalmingFluidGif,
      },
    ],
    intricate: [
      {
        itemName: "Flask of Embalming Fluid",
        quantity: 25,
        icon: imbuementsItemsIcons.deathProtection.flaskOfEmbalmingFluidGif,
      },
      {
        itemName: "Gloom Wolf Fur",
        quantity: 20,
        icon: imbuementsItemsIcons.deathProtection.gloomWolfFurGif,
      },
    ],
    powerful: [
      {
        itemName: "Flask of Embalming Fluid",
        quantity: 25,
        icon: imbuementsItemsIcons.deathProtection.flaskOfEmbalmingFluidGif,
      },
      {
        itemName: "Gloom Wolf Fur",
        quantity: 20,
        icon: imbuementsItemsIcons.deathProtection.gloomWolfFurGif,
      },
      {
        itemName: "Mystical Hourglass",
        quantity: 5,
        icon: imbuementsItemsIcons.deathProtection.mysticalHourglassGif,
      },
    ],
    icon: "deathProtection",
  },
  energyProtection: {
    name: "Cloud Fabric",
    effect: "Energy Protection",
    basic: [{ itemName: "Wyvern Talisman", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Wyvern Talisman", quantity: 20, icon: "" },
      { itemName: "Crawler Head Plating", quantity: 15, icon: "" },
    ],
    powerful: [
      { itemName: "Wyvern Talisman", quantity: 20, icon: "" },
      { itemName: "Crawler Head Plating", quantity: 15, icon: "" },
      { itemName: "Wyrm Scale", quantity: 10, icon: "" },
    ],
    icon: "energyProtection",
  },
  holyProtection: {
    name: "Demon Presence",
    effect: "Holy Protection",
    basic: [{ itemName: "Cultish Robe", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Cultish Robe", quantity: 25, icon: "" },
      { itemName: "Cultish Mask", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Cultish Robe", quantity: 25, icon: "" },
      { itemName: "Cultish Mask", quantity: 25, icon: "" },
      { itemName: "Hellspawn Tail", quantity: 20, icon: "" },
    ],
    icon: "holyProtection",
  },
  iceProtection: {
    name: "Quara Scale",
    effect: "Ice Protection",
    basic: [{ itemName: "Winter Wolf Fur", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Winter Wolf Fur", quantity: 25, icon: "" },
      { itemName: "Thick Fur", quantity: 15, icon: "" },
    ],
    powerful: [
      { itemName: "Winter Wolf Fur", quantity: 25, icon: "" },
      { itemName: "Thick Fur", quantity: 15, icon: "" },
      { itemName: "Deepling Warts", quantity: 10, icon: "" },
    ],
    icon: "iceProtection",
  },
  earthProtection: {
    name: "Snake Skin",
    effect: "Earth Protection",
    basic: [{ itemName: "Piece of Swampling Wood", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Piece of Swampling Wood", quantity: 25, icon: "" },
      { itemName: "Snake Skin", quantity: 20, icon: "" },
    ],
    powerful: [
      { itemName: "Piece of Swampling Wood", quantity: 25, icon: "" },
      { itemName: "Snake Skin", quantity: 20, icon: "" },
      { itemName: "Brimstone Fangs", quantity: 10, icon: "" },
    ],
    icon: "earthProtection",
  },
  fireProtection: {
    name: "Dragon Hide",
    effect: "Fire Protection",
    basic: [{ itemName: "Green Dragon Leather", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Green Dragon Leather", quantity: 20, icon: "" },
      { itemName: "Blazing Bone", quantity: 10, icon: "" },
    ],
    powerful: [
      { itemName: "Green Dragon Leather", quantity: 20, icon: "" },
      { itemName: "Blazing Bone", quantity: 10, icon: "" },
      { itemName: "Draken Sulphur", quantity: 5, icon: "" },
    ],
    icon: "fireProtection",
  },
  lifeLeech: {
    name: "Vampirism",
    effect: "Life Leech",
    basic: [{ itemName: "Vampire Teeth", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Vampire Teeth", quantity: 25, icon: "" },
      { itemName: "Bloody Pincers", quantity: 15, icon: "" },
    ],
    powerful: [
      { itemName: "Vampire Teeth", quantity: 25, icon: "" },
      { itemName: "Bloody Pincers", quantity: 15, icon: "" },
      { itemName: "Piece of Dead Brain", quantity: 5, icon: "" },
    ],
    icon: "lifeLeech",
  },
  velocityIncrease: {
    name: "Swiftness",
    effect: "Velocity Increase",
    basic: [{ itemName: "Damselfly Wing", quantity: 15, icon: "" }],
    intricate: [
      { itemName: "Damselfly Wing", quantity: 15, icon: "" },
      { itemName: "Compass", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Damselfly Wing", quantity: 15, icon: "" },
      { itemName: "Compass", quantity: 25, icon: "" },
      { itemName: "Waspoid Wing", quantity: 20, icon: "" },
    ],
    icon: "velocityIncrease",
  },
  paralysisRemoval: {
    name: "Vibrancy",
    effect: "Paralysis Removal",
    basic: [{ itemName: "Wereboar Hooves", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Wereboar Hooves", quantity: 20, icon: "" },
      { itemName: "Crystallized Anger", quantity: 15, icon: "" },
    ],
    powerful: [
      { itemName: "Wereboar Hooves", quantity: 20, icon: "" },
      { itemName: "Crystallized Anger", quantity: 15, icon: "" },
      { itemName: "Quill", quantity: 5, icon: "" },
    ],
    icon: "paralysisRemoval",
  },
  distanceSkill: {
    name: "Precision",
    effect: "Distance Skill",
    basic: [{ itemName: "Elven Scouting Glass", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Elven Scouting Glass", quantity: 25, icon: "" },
      { itemName: "Elven Hoof", quantity: 20, icon: "" },
    ],
    powerful: [
      { itemName: "Elven Scouting Glass", quantity: 25, icon: "" },
      { itemName: "Elven Hoof", quantity: 20, icon: "" },
      { itemName: "Metal Spike", quantity: 10, icon: "" },
    ],
    icon: "distanceSkill",
  },
  deathDamage: {
    name: "Reap",
    effect: "Death Damage",
    basic: [{ itemName: "Pile of Grave Earth", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Pile of Grave Earth", quantity: 25, icon: "" },
      { itemName: "Demonic Skeletal Hand", quantity: 20, icon: "" },
    ],
    powerful: [
      { itemName: "Pile of Grave Earth", quantity: 25, icon: "" },
      { itemName: "Demonic Skeletal Hand", quantity: 20, icon: "" },
      { itemName: "Petrified Scream", quantity: 5, icon: "" },
    ],
    icon: "deathDamage",
  },
  earthDamage: {
    name: "Venom",
    effect: "Earth Damage",
    basic: [{ itemName: "Swamp Grass", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Swamp Grass", quantity: 25, icon: "" },
      { itemName: "Poisonous Slime", quantity: 20, icon: "" },
    ],
    powerful: [
      { itemName: "Swamp Grass", quantity: 25, icon: "" },
      { itemName: "Poisonous Slime", quantity: 20, icon: "" },
      { itemName: "Slime Heart", quantity: 2, icon: "" },
    ],
    icon: "earthDamage",
  },
  energyDamage: {
    name: "Electrify",
    effect: "Energy Damage",
    basic: [{ itemName: "Rorc Feather", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Rorc Feather", quantity: 25, icon: "" },
      { itemName: "Peacock Feather Fan", quantity: 5, icon: "" },
    ],
    powerful: [
      { itemName: "Rorc Feather", quantity: 25, icon: "" },
      { itemName: "Peacock Feather Fan", quantity: 5, icon: "" },
      { itemName: "Energy Vein", quantity: 1, icon: "" },
    ],
    icon: "energyDamage",
  },
  fireDamage: {
    name: "Scorch",
    effect: "Fire Damage",
    basic: [{ itemName: "Fiery Heart", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Fiery Heart", quantity: 25, icon: "" },
      { itemName: "Green Dragon Scale", quantity: 5, icon: "" },
    ],
    powerful: [
      { itemName: "Fiery Heart", quantity: 25, icon: "" },
      { itemName: "Green Dragon Scale", quantity: 5, icon: "" },
      { itemName: "Demon Horn", quantity: 5, icon: "" },
    ],
    icon: "fireDamage",
  },
  iceDamage: {
    name: "Frost",
    effect: "Ice Damage",
    basic: [{ itemName: "Frosty Heart", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Frosty Heart", quantity: 25, icon: "" },
      { itemName: "Seacrest Hair", quantity: 10, icon: "" },
    ],
    powerful: [
      { itemName: "Frosty Heart", quantity: 25, icon: "" },
      { itemName: "Seacrest Hair", quantity: 10, icon: "" },
      { itemName: "Polar Bear Paw", quantity: 5, icon: "" },
    ],
    icon: "iceDamage",
  },
  manaLeech: {
    name: "Void",
    effect: "Mana Leech",
    basic: [{ itemName: "Rope Belt", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Rope Belt", quantity: 25, icon: "" },
      { itemName: "Silencer Claws", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Rope Belt", quantity: 25, icon: "" },
      { itemName: "Silencer Claws", quantity: 25, icon: "" },
      { itemName: "Some Grimeleech Wings", quantity: 5, icon: "" },
    ],
    icon: "manaLeech",
  },
  criticalDamage: {
    name: "Strike",
    effect: "Critical Damage",
    basic: [{ itemName: "Protective Charm", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Protective Charm", quantity: 20, icon: "" },
      { itemName: "Sabretooth", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Protective Charm", quantity: 20, icon: "" },
      { itemName: "Sabretooth", quantity: 25, icon: "" },
      { itemName: "Vexclaw Talon", quantity: 5, icon: "" },
    ],
    icon: "criticalDamage",
  },
  axeSkill: {
    name: "Chop",
    effect: "Axe Skill",
    basic: [{ itemName: "Orc Tooth", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Orc Tooth", quantity: 20, icon: "" },
      { itemName: "Battle Stone", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Orc Tooth", quantity: 20, icon: "" },
      { itemName: "Battle Stone", quantity: 25, icon: "" },
      { itemName: "Moohtant Horn", quantity: 20, icon: "" },
    ],
    icon: "axeSkill",
  },
  clubSkill: {
    name: "Bash",
    effect: "Club Skill",
    basic: [{ itemName: "Cyclops Toe", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Cyclops Toe", quantity: 20, icon: "" },
      { itemName: "Ogre Nose Ring", quantity: 15, icon: "" },
    ],
    powerful: [
      { itemName: "Cyclops Toe", quantity: 20, icon: "" },
      { itemName: "Ogre Nose Ring", quantity: 15, icon: "" },
      { itemName: "Warmaster's Wristguards", quantity: 10, icon: "" },
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
    basic: [{ itemName: "Lion's Mane", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Lion's Mane", quantity: 25, icon: "" },
      { itemName: "Mooh'tah Shell", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Lion's Mane", quantity: 25, icon: "" },
      { itemName: "Mooh'tah Shell", quantity: 25, icon: "" },
      { itemName: "War Crystal", quantity: 5, icon: "" },
    ],
    icon: "swordSkill",
  },
  shieldingSkill: {
    name: "Blockade",
    effect: "Shielding Skill",
    basic: [{ itemName: "Piece of Scarab Shell", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Piece of Scarab Shell", quantity: 20, icon: "" },
      { itemName: "Brimstone Shell", quantity: 25, icon: "" },
    ],
    powerful: [
      { itemName: "Piece of Scarab Shell", quantity: 20, icon: "" },
      { itemName: "Brimstone Shell", quantity: 25, icon: "" },
      { itemName: "Frazzle Skin", quantity: 25, icon: "" },
    ],
    icon: "shieldingSkill",
  },
  magicLevel: {
    name: "Ephifany",
    effect: "Magic Level",
    basic: [{ itemName: "Elvish Talisman", quantity: 25, icon: "" }],
    intricate: [
      { itemName: "Elvish Talisman", quantity: 25, icon: "" },
      { itemName: "Broken Shamanic Staff", quantity: 15, icon: "" },
    ],
    powerful: [
      { itemName: "Elvish Talisman", quantity: 25, icon: "" },
      { itemName: "Broken Shamanic Staff", quantity: 15, icon: "" },
      { itemName: "Strand of Medusa Hair", quantity: 15, icon: "" },
    ],
    icon: "magicLevel",
  },
  capacityIncrease: {
    name: "Featherweight",
    effect: "Capacity Increase",
    basic: [{ itemName: "Fairy Wings", quantity: 20, icon: "" }],
    intricate: [
      { itemName: "Fairy Wings", quantity: 20, icon: "" },
      { itemName: "Little Bowl of Myrrh", quantity: 10, icon: "" },
    ],
    powerful: [
      { itemName: "Fairy Wings", quantity: 20, icon: "" },
      { itemName: "Little Bowl of Myrrh", quantity: 10, icon: "" },
      { itemName: "Goosebump Leather", quantity: 5, icon: "" },
    ],
    icon: "capacityIncrease",
  },
};
