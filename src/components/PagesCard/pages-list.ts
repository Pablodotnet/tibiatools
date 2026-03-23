import { PagesIcons } from "@/helpers";

export type PageListItem = {
  title: string;
  url: string;
  description: string;
  icon: string;
};

export const pagesList: PageListItem[] = [
  {
    title: 'titleRealMoney',
    url: '/real-money-calculator',
    description: 'descriptionRealMoney',
    icon: PagesIcons.goldcoinGif,
  },
  {
    title: 'titleTibiaCoins',
    url: '/coins-to-money',
    description: 'descriptionTibiaCoins',
    icon: PagesIcons.crystalWolfGif,
  },
  {
    title: 'titleImbuing',
    url: '/imbuings',
    description: 'descriptionImbuing',
    icon: PagesIcons.imbuingshrineGif,
  },
  {
    title: 'titleHuntSpots',
    url: '/hunting-spots',
    description: 'descriptionHuntSpots',
    icon: PagesIcons.guzzlemawGif,
  },
  {
    title: 'titleExaltation',
    url: '/exaltation',
    description: 'descriptionExaltation',
    icon: PagesIcons.forgeGif,
  },
];
