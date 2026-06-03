export type Difficulty = 'easy' | 'medium' | 'hard' | 'very_hard' | 'boss';

export interface BestiaryEntry {
  key: string;
  name: string;
  difficulty: Difficulty;
  killsRequired: number;
  charmPoints: number;
  race: 'creature' | 'boss';
}

export interface CharmDefinition {
  key: string;
  name: string;
  cost: number;
  description: string;
  type: 'offensive' | 'defensive' | 'utility';
}

export const BESTIARY_MONSTERS: BestiaryEntry[] = [
  { key: 'rotworm', name: 'Rotworm', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'cyclops', name: 'Cyclops', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'tarantula', name: 'Tarantula', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'dragon', name: 'Dragon', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'dragon_lord', name: 'Dragon Lord', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'demon', name: 'Demon', difficulty: 'hard', killsRequired: 2000, charmPoints: 15, race: 'creature' },
  { key: 'frost_dragon', name: 'Frost Dragon', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'hellhound', name: 'Hellhound', difficulty: 'hard', killsRequired: 2000, charmPoints: 15, race: 'creature' },
  { key: 'lizard_high_guard', name: 'Lizard High Guard', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'lizard_templar', name: 'Lizard Templar', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'lich', name: 'Lich', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'necromancer', name: 'Necromancer', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'nightmare', name: 'Nightmare', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'nightmare_scion', name: 'Nightmare Scion', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'ornate_mummy', name: 'Ornate Mummy', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'priestess', name: 'Priestess', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'quara', name: 'Quara', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'quara_pincher', name: 'Quara Pincher', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'rat', name: 'Rat', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'serpent_spawn', name: 'Serpent Spawn', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'skeleton', name: 'Skeleton', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'slime', name: 'Slime', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'spider', name: 'Spider', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'stone_golem', name: 'Stone Golem', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'troll', name: 'Troll', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'warlock', name: 'Warlock', difficulty: 'hard', killsRequired: 2000, charmPoints: 15, race: 'creature' },
  { key: 'werewolf', name: 'Werewolf', difficulty: 'easy', killsRequired: 500, charmPoints: 5, race: 'creature' },
  { key: 'yeti', name: 'Yeti', difficulty: 'medium', killsRequired: 1000, charmPoints: 10, race: 'creature' },
  { key: 'ferumbras', name: 'Ferumbras', difficulty: 'boss', killsRequired: 1, charmPoints: 10, race: 'boss' },
  { key: 'grorlam', name: 'Grorlam', difficulty: 'boss', killsRequired: 1, charmPoints: 10, race: 'boss' },
  { key: 'plagirath', name: 'Plagirath', difficulty: 'boss', killsRequired: 1, charmPoints: 10, race: 'boss' },
  { key: 'zamulosh', name: 'Zamulosh', difficulty: 'boss', killsRequired: 1, charmPoints: 10, race: 'boss' },
];

export const CHARMS: CharmDefinition[] = [
  { key: 'dodge', name: 'Dodge', cost: 100, description: '20% chance to avoid damage from your assigned creature', type: 'defensive' },
  { key: 'parry', name: 'Parry', cost: 200, description: 'Reflects 25% of damage back', type: 'defensive' },
  { key: 'wound', name: 'Wound', cost: 300, description: 'Adds 5% physical damage', type: 'offensive' },
  { key: 'poison', name: 'Poison', cost: 300, description: 'Adds poison damage over time', type: 'offensive' },
  { key: 'zap', name: 'Zap', cost: 300, description: 'Adds energy damage', type: 'offensive' },
  { key: 'freeze', name: 'Freeze', cost: 300, description: 'Adds ice damage', type: 'offensive' },
  { key: 'curse', name: 'Curse', cost: 300, description: 'Adds death damage', type: 'offensive' },
  { key: 'enflame', name: 'Enflame', cost: 300, description: 'Adds fire damage', type: 'offensive' },
  { key: 'scorch', name: 'Scorch', cost: 300, description: 'Adds earth damage', type: 'offensive' },
  { key: 'gut', name: 'Gut', cost: 300, description: 'Adds holy damage', type: 'offensive' },
  { key: 'low_blow', name: 'Low Blow', cost: 400, description: 'Adds 15% critical hit chance', type: 'offensive' },
  { key: 'adrenaline_burst', name: 'Adrenaline Burst', cost: 500, description: 'Grants haste for 15s when damaged', type: 'utility' },
  { key: 'numb', name: 'Numb', cost: 400, description: 'Reduces creature speed', type: 'utility' },
  { key: 'cripple', name: 'Cripple', cost: 400, description: 'Reduces creature damage output', type: 'utility' },
  { key: 'drain', name: 'Drain', cost: 400, description: 'Heals 5% of damage dealt', type: 'utility' },
  { key: 'charm_healing', name: 'Charm Healing', cost: 500, description: 'Heals 25% of damage from assigned creature', type: 'defensive' },
  { key: 'poison_skin', name: 'Poison Skin', cost: 250, description: 'Poisons attacker on melee hit', type: 'defensive' },
  { key: 'thorns', name: 'Thorns', cost: 250, description: 'Reflects 10% physical damage back', type: 'defensive' },
];

export function calculateCharmPoints(completedKeys: string[]): number {
  return BESTIARY_MONSTERS
    .filter((m) => completedKeys.includes(m.key))
    .reduce((sum, m) => sum + m.charmPoints, 0);
}


