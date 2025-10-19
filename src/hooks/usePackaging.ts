'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  PackageFormat,
  PackagingOperation,
  PackagingStats,
  CreatePackageFormatData,
  CreatePackagingOperationData,
} from '@/types';

// ========================================
// PACKAGE FORMATS HOOKS
// ========================================

export const usePackageFormats = (activeOnly = true) => {
  return useQuery({
    queryKey: ['package-formats', activeOnly],
    queryFn: async () => {
      const response = await api.get('/packaging/formats', {
        params: { activeOnly },
      });
      return response.data as PackageFormat[];
    },
  });
};

export const usePackageFormat = (id: string) => {
  return useQuery({
    queryKey: ['package-format', id],
    queryFn: async () => {
      const response = await api.get(`/packaging/formats/${id}`);
      return response.data as PackageFormat;
    },
    enabled: !!id,
  });
};

export const useCreatePackageFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePackageFormatData) => {
      const response = await api.post('/packaging/formats', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['package-formats'] });
    },
  });
};

export const useUpdatePackageFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePackageFormatData> }) => {
      const response = await api.patch(`/packaging/formats/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['package-formats'] });
    },
  });
};

export const useDeletePackageFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/packaging/formats/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['package-formats'] });
    },
  });
};

// ========================================
// PACKAGING OPERATIONS HOOKS
// ========================================

export const usePackagingOperations = (batchId?: string) => {
  return useQuery({
    queryKey: ['packaging-operations', batchId],
    queryFn: async () => {
      const response = await api.get('/packaging/operations', {
        params: batchId ? { batchId } : {},
      });
      return response.data as PackagingOperation[];
    },
  });
};

export const usePackagingOperation = (id: string) => {
  return useQuery({
    queryKey: ['packaging-operation', id],
    queryFn: async () => {
      const response = await api.get(`/packaging/operations/${id}`);
      return response.data as PackagingOperation;
    },
    enabled: !!id,
  });
};

export const useCreatePackagingOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePackagingOperationData) => {
      const response = await api.post('/packaging/operations', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['packaging-operations'] });
      queryClient.invalidateQueries({ queryKey: ['packaging-operations', variables.batchId] });
      queryClient.invalidateQueries({ queryKey: ['packaging-stats'] });
      queryClient.invalidateQueries({ queryKey: ['packaging-stats', variables.batchId] });
    },
  });
};

export const useUpdatePackagingOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePackagingOperationData> }) => {
      const response = await api.patch(`/packaging/operations/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packaging-operations'] });
      queryClient.invalidateQueries({ queryKey: ['packaging-stats'] });
    },
  });
};

export const useDeletePackagingOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/packaging/operations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packaging-operations'] });
      queryClient.invalidateQueries({ queryKey: ['packaging-stats'] });
    },
  });
};

// ========================================
// STATISTICS HOOK
// ========================================

export const usePackagingStats = (batchId?: string) => {
  return useQuery({
    queryKey: ['packaging-stats', batchId],
    queryFn: async () => {
      const response = await api.get('/packaging/stats', {
        params: batchId ? { batchId } : {},
      });
      return response.data as PackagingStats;
    },
  });
};
