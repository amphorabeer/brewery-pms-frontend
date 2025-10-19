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
  // Add these types to src/types/index.ts

export type QcTestResult = 'PASS' | 'FAIL' | 'PENDING';

export interface QcTestType {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  category: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QcTest {
  id: string;
  batchId: string;
  testTypeId: string;
  testedBy: string;
  testedAt: string;
  result: QcTestResult;
  value?: number;
  notes?: string;
  attachments?: any;
  createdAt: string;
  updatedAt: string;
  testType?: QcTestType;
  batch?: {
    id: string;
    batchNumber: string;
    recipe: {
      id: string;
      name: string;
    };
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateQcTestTypeData {
  name: string;
  description?: string;
  category: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
}

export interface CreateQcTestData {
  batchId: string;
  testTypeId: string;
  testedAt: string;
  result: QcTestResult;
  value?: number;
  notes?: string;
  attachments?: any;
}

export interface QcStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
  passRate: string;
}

// Packaging Types
export type PackageType = 'BOTTLE' | 'KEG' | 'CAN' | 'GROWLER' | 'CROWLER';
export type PackagingStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface PackageFormat {
  id: string;
  orgId: string;
  name: string;
  type: PackageType;
  size: number;
  unit: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackagingOperation {
  id: string;
  batchId: string;
  packageFormatId: string;
  sku?: string;
  quantity: number;
  volumePackaged: number;
  packagedBy: string;
  packagedAt: string;
  status: PackagingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  batch?: {
    batchNumber: string;
    recipe: {
      name: string;
    };
  };
  packageFormat?: PackageFormat;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreatePackageFormatData {
  name: string;
  type: PackageType;
  size: number;
  unit: string;
  description?: string;
  isActive?: boolean;
}

export interface CreatePackagingOperationData {
  batchId: string;
  packageFormatId: string;
  quantity: number;
  volumePackaged: number;
  packagedAt: string;
  status?: PackagingStatus;
  notes?: string;
}

export interface PackagingStats {
  totalOperations: number;
  totalVolume: number;
  totalPackages: number;
  byType: Record<string, { count: number; volume: number; packages: number }>;
  byStatus: Record<string, number>;
}
// Supplier Types
export interface Supplier {
  organizationId: string;
  id: string;
  orgId: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierData {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  isActive?: boolean;
}
