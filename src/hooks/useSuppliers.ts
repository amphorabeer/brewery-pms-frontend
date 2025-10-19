'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Supplier, CreateSupplierDto, UpdateSupplierDto, SupplierStats } from '@/types';

// Get all suppliers
export const useSuppliers = (search?: string) => {
  return useQuery({
    queryKey: ['suppliers', search],
    queryFn: async () => {
      const params = search ? { search } : {};
      const response = await api.get('/suppliers', { params });
      return response.data as Supplier[];
    },
  });
};

// Get supplier stats
export const useSupplierStats = () => {
  return useQuery({
    queryKey: ['suppliers', 'stats'],
    queryFn: async () => {
      const response = await api.get('/suppliers/stats');
      return response.data as SupplierStats;
    },
  });
};

// Get single supplier
export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: async () => {
      const response = await api.get(`/suppliers/${id}`);
      return response.data as Supplier;
    },
    enabled: !!id,
  });
};

// Create supplier
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSupplierDto) => {
      const response = await api.post('/suppliers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

// Update supplier
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSupplierDto }) => {
      const response = await api.patch(`/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

// Delete supplier
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

// Toggle supplier active status
export const useToggleSupplierActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/suppliers/${id}/toggle-active`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};