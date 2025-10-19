// ============================================
// USER & AUTH TYPES
// ============================================
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  orgId: string;
}

// ============================================
// LOCATION TYPES
// ============================================
export interface Location {
  id: string;
  name: string;
  address?: string;
  organizationId: string;
  type?: string;
  isActive?: boolean;
}

// ============================================
// INGREDIENT TYPES
// ============================================
export interface Ingredient {
  id: string;
  organizationId: string;
  name: string;
  type: 'MALT' | 'HOP' | 'YEAST' | 'WATER' | 'ADJUNCT' | 'OTHER';
  supplier: string | null;
  currentStock: number | null;
  unit: string;
  costPerUnit: number | null;
  minStock: number | null;
  maxStock: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  quantity: number;
  unit: string;
  timing?: string;
  notes?: string;
  ingredient: Ingredient;
}

// ============================================
// RECIPE TYPES
// ============================================
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

// ============================================
// BATCH TYPES
// ============================================
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

export interface Statistics {
  totalBatches: number;
  activeBatches: number;
  finishedBatches: number;
  cancelledBatches: number;
  totalVolumeProduced: number;
  averageAbv: string;
  statusBreakdown: Record<string, number>;
}

// ============================================
// TANK TYPES
// ============================================
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

// ============================================
// QC TYPES
// ============================================
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

// ============================================
// PACKAGING TYPES
// ============================================
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

// ============================================
// INVENTORY & PURCHASING TYPES
// ============================================

// Supplier Management
export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {}

// Purchase Orders
export type PurchaseOrderStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'CONFIRMED' 
  | 'PARTIALLY_RECEIVED' 
  | 'RECEIVED' 
  | 'CANCELLED';

export interface PurchaseOrder {
  id: string;
  organizationId: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  orderDate: string;
  expectedDeliveryDate: string | null;
  actualDeliveryDate: string | null;
  status: PurchaseOrderStatus;
  totalAmount: number;
  notes: string | null;
  items?: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  ingredientId: string;
  ingredient?: {
    id: string;
    name: string;
    unit: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreatePurchaseOrderDto {
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  notes?: string;
  items: CreatePurchaseOrderItemDto[];
}

export interface CreatePurchaseOrderItemDto {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdatePurchaseOrderDto {
  supplierId?: string;
  orderDate?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  status?: PurchaseOrderStatus;
  notes?: string;
}

// Stock Movements
export type StockMovementType = 
  | 'PURCHASE' 
  | 'PRODUCTION_USE' 
  | 'ADJUSTMENT' 
  | 'TRANSFER' 
  | 'WASTE';

export interface StockMovement {
  id: string;
  organizationId: string;
  ingredientId: string;
  ingredient?: {
    id: string;
    name: string;
    unit: string;
    currentStock?: number;
  };
  locationId: string | null;
  location?: {
    id: string;
    name: string;
  };
  movementType: StockMovementType;
  quantity: number;
  unitCost: number | null;
  referenceId: string | null;
  referenceType: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
}

export interface CreateStockMovementDto {
  ingredientId: string;
  locationId?: string;
  movementType: StockMovementType;
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
}

// Statistics & Reports
export interface InventoryStats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalPurchaseOrders: number;
  pendingOrders: number;
  totalStockValue: number;
  lowStockItems: number;
  recentMovements: number;
  topSuppliers: {
    supplier: Supplier;
    orderCount: number;
    totalValue: number;
  }[];
}

export interface StockLevel {
  ingredientId: string;
  ingredientName: string;
  currentStock: number;
  unit: string;
  minStock: number | null;
  maxStock: number | null;
  value: number;
  lastMovementDate: string | null;
  status: 'CRITICAL' | 'LOW' | 'NORMAL' | 'OVERSTOCKED';
}
// ============================================
// PHASE 2: ADDITIONAL TYPES
// ============================================

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export interface PurchaseOrderStats {
  total: number;
  draft: number;
  sent: number;
  receive