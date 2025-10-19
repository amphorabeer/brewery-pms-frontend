import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  PurchaseOrder,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  StockMovement,
  CreateStockMovementDto,
  InventoryStats,
  StockLevel,
} from '@/types';

// ============================================
// SUPPLIERS
// ============================================

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data } = await api.get<Supplier[]>('/suppliers');
      return data;
    },
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const { data } = await api.get<Supplier>(`/suppliers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSupplierDto) => {
      const response = await api.post<Supplier>('/suppliers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSupplierDto }) => {
      const response = await api.patch<Supplier>(`/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

// ============================================
// PURCHASE ORDERS
// ============================================

export function usePurchaseOrders() {
  return useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data } = await api.get<PurchaseOrder[]>('/purchase-orders');
      return data;
    },
  });
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: async () => {
      const { data } = await api.get<PurchaseOrder>(`/purchase-orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePurchaseOrderDto) => {
      const response = await api.post<PurchaseOrder>('/purchase-orders', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePurchaseOrderDto }) => {
      const response = await api.patch<PurchaseOrder>(`/purchase-orders/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/purchase-orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
    },
  });
}

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<PurchaseOrder>(`/purchase-orders/${id}/receive`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', id] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

// ============================================
// STOCK MOVEMENTS
// ============================================

export function useStockMovements(ingredientId?: string) {
  return useQuery({
    queryKey: ['stock-movements', ingredientId],
    queryFn: async () => {
      const url = ingredientId 
        ? `/stock-movements?ingredientId=${ingredientId}`
        : '/stock-movements';
      const { data } = await api.get<StockMovement[]>(url);
      return data;
    },
  });
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStockMovementDto) => {
      const response = await api.post<StockMovement>('/stock-movements', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

// ============================================
// STATISTICS & REPORTS
// ============================================

export function useInventoryStats() {
  return useQuery({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      const { data } = await api.get<InventoryStats>('/inventory/stats');
      return data;
    },
  });
}

export function useStockLevels() {
  return useQuery({
    queryKey: ['stock-levels'],
    queryFn: async () => {
      const { data } = await api.get<StockLevel[]>('/inventory/stock-levels');
      return data;
    },
  });
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: async () => {
      const { data } = await api.get<StockLevel[]>('/inventory/low-stock');
      return data;
    },
  });
}
