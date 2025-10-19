import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all purchase orders
export function usePurchaseOrders() {
  return useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/purchase-orders`,
        getAuthHeaders()
      );
      return data;
    },
  });
}

// Fetch single purchase order
export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/purchase-orders/${id}`,
        getAuthHeaders()
      );
      return data;
    },
    enabled: !!id,
  });
}

// Create purchase order
export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await axios.post(
        `${API_URL}/purchase-orders`,
        orderData,
        getAuthHeaders()
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

// Update purchase order status
export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await axios.patch(
        `${API_URL}/purchase-orders/${id}/status`,
        { status },
        getAuthHeaders()
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

// Receive purchase order
export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.post(
        `${API_URL}/purchase-orders/${id}/receive`,
        {},
        getAuthHeaders()
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

// Delete purchase order
export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(
        `${API_URL}/purchase-orders/${id}`,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}
