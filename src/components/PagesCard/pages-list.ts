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
    title: 'titleImbueCost',
    url: '/imbue-cost-calculator',
    description: 'descriptionImbueCost',
    icon: PagesIcons.manaLeechPng,
  },
  {
    title: 'titleExerciseWeapons',
    url: '/exercise-weapons',
    description: 'descriptionExerciseWeapons',
    icon: PagesIcons.swordSkillPng,
  },
  {
    title: 'titleEquipment',
    url: '/equipment-reference',
    description: 'descriptionEquipment',
    icon: PagesIcons.shieldingSkillPng,
  },
  {
    title: 'titleOfflineTraining',
    url: '/offline-training',
    description: 'descriptionOfflineTraining',
    icon: PagesIcons.distanceSkillPng,
  },
  {
    title: 'titleLevel',
    url: '/level-calculator',
    description: 'descriptionLevel',
    icon: PagesIcons.magicLevelPng,
  },
  {
    title: 'titleBlessCalculator',
    url: '/bless-calculator',
    description: 'descriptionBlessCalculator',
    icon: PagesIcons.holyProtectionPng,
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

export const privatePagesList: PageListItem[] = [
  {
    title: 'titleMyTierProjects',
    url: '/myTierProjects',
    description: 'descriptionMyTierProjects',
    icon: PagesIcons.tierGif,
  },
];

const publicPagesListItem: PageListItem = {
  title: 'titlePublicProjects',
  url: '/public-projects',
  description: 'descriptionPublicProjects',
  icon: PagesIcons.tierGif,
};

export const getPagesList: (loggedIn: boolean) => PageListItem[] = (
  loggedIn: boolean,
) => {
  if (!loggedIn) {
    return [...pagesList, publicPagesListItem];
  }
  return [...pagesList, ...privatePagesList];
};
