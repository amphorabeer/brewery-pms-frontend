export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  orgId: string;
}

export type BatchStatus =
  | 'PLANNED'
  | 'BREWING'
  | 'FERMENTING'
  | 'CONDITIONING'
  | 'PACKAGING'
  | 'FINISHED'
  | 'CANCELLED';

export interface FermentationLog {
  id: string;
  measuredAt: string;
  temperature: number;
  gravity?: number;
  ph?: number;
  pressure?: number;
  notes?: string;
}

export interface Statistics {
  totalBatches: number;
  activeBatches: number;
  finishedBatches: number;
  cancelledBatches: number;
  totalVolumeProduced: number;
  averageAbv: string;
  statusBreakdown: Record<string, number>;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  organizationId: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  status: BatchStatus;
  brewDate: string;
  fermentationStartDate?: string;
  packagedDate?: string;
  finishedDate?: string;
  expectedVolume: number;
  actualVolume?: number;
  og?: number;
  fg?: number;
  abv?: number;
  notes?: string;
  recipe: {
    id: string;
    name: string;
    style: string;
  };
  location: {
    id: string;
    name: string;
  };
  tank?: {
    id: string;
    name: string;
    type: string;
    capacity: number;
    status: string;
  };
  fermentationLogs?: FermentationLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  type: string;
  unit: string;
  stock?: number;
}

export interface RecipeIngredient {
  id: string;
  quantity: number;
  unit: string;
  timing?: string;
  notes?: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: string;
  name: string;
  style: string;
  batchSize: number;
  abv?: number;
  ibu?: number;
  og?: number;
  fg?: number;
  mashTemp?: number;
  mashTime?: number;
  boilTime?: number;
  fermentTemp?: number;
  fermentDays?: number;
  notes?: string;
  ingredients?: RecipeIngredient[];
}

export type TankType = 
  | 'FERMENTER'
  | 'BRIGHT_TANK'
  | 'CONDITIONING_TANK'
  | 'MATURATION_TANK';

export type TankStatus =
  | 'EMPTY'
  | 'IN_USE'
  | 'CLEANING'
  | 'MAINTENANCE';