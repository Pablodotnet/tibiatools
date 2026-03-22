import { PagesIcons } from "@/helpers";

export type PageListItem = {
  title: string;
  url: string;
  description: string;
  icon: string;
};

export const pagesList: PageListItem[] = [
  {
    title: 'Real Money Calculator',
    url: '/real-money-calculator',
    description: 'Calculate how much real money will cost your Tibia gold.',
    icon: PagesIcons.goldcoinGif,
  },
  {
    title: 'Tibia Coins to Real Money Calculator',
    url: '/coins-to-money',
    description: 'Calculate how much real money will cost your Tibia Coins.',
    icon: PagesIcons.crystalWolfGif,
  },
  {
    title: 'Imbuing System',
    url: '/imbuings',
    description: 'What imbuings can you put on your items?',
    icon: PagesIcons.imbuingshrineGif,
  },
  {
    title: 'Hunting Spots',
    url: '/hunting-spots',
    description:
      'Find the best hunting spots for your level and which set to use.',
    icon: PagesIcons.guzzlemawGif,
  },
  {
    title: 'Exaltation/Forge System',
    url: '/exaltation',
    description: 'Learn how exaltation works and how to use it.',
    icon: PagesIcons.forgeGif,
  },
];
