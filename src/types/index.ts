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



export interface Recipe {
  id: string;
  name: string;
  style: string;
  batchSize: number;
  abv: number;
  ibu: number;
  og: number;
  fg: number;
  mashTemp?: number;      // ← დაამატე
  mashDuration?: number;  // ← დაამატე (თუ გჭირდება)
  boilDuration?: number;  // ← დაამატე (თუ გჭირდება)
  notes?: string;
}

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
  fermentationStartDate?: string;  // ← დაამატე
  packagedDate?: string;            // ← დაამატე
  finishedDate?: string;            // ← დაამატე
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
  fermentationLogs?: FermentationLog[];
  createdAt: string;
  updatedAt: string;
}