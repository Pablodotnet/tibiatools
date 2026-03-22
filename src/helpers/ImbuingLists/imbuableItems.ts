import { armors } from "./armors";
import { axes } from "./axes";
import { backpacks } from "./backpacks";
import { boots } from "./boots";
import { bows } from "./bows";
import { clubs } from "./clubs";
import { crossbows } from "./crossbows";
import { helmets } from "./helmets";
import { rods } from "./rods";
import { shields } from "./shields";
import { spellbooks } from "./spellbooks";
import { swords } from "./swords";
import { wands } from "./wands";

export type ImbuableItem = {
  name: string;
  icon: string;
  imbuingSlots: number;
};

export type ImbuablesListSection = {
  displayName: string;
  items: ImbuableItem[];
};

export const imbuableItems: { [key: string]: ImbuablesListSection } = {
  armors: {
    displayName: "Armors",
    items: armors,
  },
  axes: {
    displayName: "Axes",
    items: axes,
  },
  backpacks: {
    displayName: "Backpacks",
    items: backpacks,
  },
  boots: {
    displayName: "Boots",
    items: boots,
  },
  bows: {
    displayName: "Bows",
    items: bows,
  },
  clubs: {
    displayName: "Clubs",
    items: clubs,
  },
  crossbows: {
    displayName: "Crossbows",
    items: crossbows,
  },
  helmets: {
    displayName: "Helmets",
    items: helmets,
  },
  rods: {
    displayName: "Rods",
    items: rods,
  },
  shields: {
    displayName: "Shields",
    items: shields,
  },
  spellbooks: {
    displayName: "Spellbooks",
    items: spellbooks,
  },
  swords: {
    displayName: "Swords",
    items: swords,
  },
  wands: {
    displayName: "Wands",
    items: wands,
  },
};
