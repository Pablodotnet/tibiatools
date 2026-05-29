export interface TierProject {
  id: string;
  name: string;
  targetTier: number;
  currentTier: number;
  isPublic: boolean;
  ownerUid: string;
  ownerDisplayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierProjectEntry {
  id: string;
  projectId: string;
  fromTier: number;
  toTier: number;
  itemsUsed: string;
  costGp: number;
  notes: string;
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
  itemsUsed: string;
  costGp: number;
  notes: string;
}
