export interface TierProject {
  id: string;
  name: string;
  targetTier: number;
  currentTier: number;
  isPublic: boolean;
  ownerUid: string;
  ownerDisplayName: string;
  totalSpentGp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierProjectItem {
  name: string;
  costGp: number;
  marketPriceGp?: number;
}

export interface TierProjectEntry {
  id: string;
  projectId: string;
  fromTier: number;
  toTier: number;
  items: TierProjectItem[];
  notes: string;
  method?: string;
  classification?: number;
  exaltedCores?: number;
  exaltedCorePriceGp?: number;
  createdAt: Date;
}

export interface TierProjectFormData {
  name: string;
  targetTier: number;
  isPublic: boolean;
}

export interface TierProjectEntryFormData {
  fromTier: number;
  toTier: number;
  items: TierProjectItem[];
  notes: string;
  method?: string;
  classification?: number;
  exaltedCores?: number;
}
