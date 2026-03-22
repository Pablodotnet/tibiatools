import { VocationsIcons } from "./vocations-icons";

export type VocationsListItem = {
  id: string;
  name: string;
  icon: string;
};

export const vocations: VocationsListItem[] = [
  {
    id: "druid",
    name: "Druid",
    icon: VocationsIcons.druidGif,
  },
  {
    id: "knight",
    name: "Knight",
    icon: VocationsIcons.knightGif,
  },
  {
    id: "monk",
    name: "Monk",
    icon: VocationsIcons.monkGif,
  },
  {
    id: "paladin",
    name: "Paladin",
    icon: VocationsIcons.paladinGif,
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    icon: VocationsIcons.sorcererGif,
  },
];
