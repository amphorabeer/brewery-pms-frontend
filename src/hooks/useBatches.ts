'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Batch, BatchStatus, Statistics } from '@/types';

// Fermentation Log Types
export interface FermentationLog {
  id: string;
  batchId: string;
  measuredAt: string;
  temperature: number;
  gravity?: number;
  ph?: number;
  pressure?: number;
  notes?: string;
}

export interface CreateFermentationLogData {
  measuredAt: string;
  temperature: number;
  gravity?: number;
  ph?: number;
  pressure?: number;
  notes?: string;
}

// Existing Batch Hooks
export const useBatches = (status?: BatchStatus) => {
  return useQuery({
    queryKey: ['batches', status],
    queryFn: async () => {
      const response = await api.get('/batches', {
        params: status ? { status } : {},
      });
      return response.data as Batch[];
    },
  });
};

export const useBatch = (id: string) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: async () => {
      const response = await api.get(`/batches/${id}`);
      return response.data as Batch;
    },
    enabled: !!id,
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/batches/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useBatchStatistics = () => {
  return useQuery({
    queryKey: ['batch-statistics'],
    queryFn: async () => {
      const response = await api.get('/batches/statistics');
      return response.data as Statistics;
    },
  });
};

// ============================================
// 🆕 FERMENTATION LOGS HOOKS (NEW!)
// ============================================

// Get fermentation logs for a batch
export const useFermentationLogs = (batchId: string) => {
  return useQuery({
    queryKey: ['fermentation-logs', batchId],
    queryFn: async () => {
      const response = await api.get(`/batches/${batchId}/fermentation-logs`);
      return response.data as FermentationLog[];
    },
    enabled: !!batchId,
  });
};

// Add fermentation log
export const useAddFermentationLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId, data }: { batchId: string; data: CreateFermentationLogData }) => {
      const response = await api.post(`/batches/${batchId}/fermentation-logs`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the logs query and the batch query
      queryClient.invalidateQueries({ queryKey: ['fermentation-logs', variables.batchId] });
      queryClient.invalidateQueries({ queryKey: ['batch', variables.batchId] });
    },
  });
};

// Delete fermentation log
export const useDeleteFermentationLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId, logId }: { batchId: string; logId: string }) => {
      await api.delete(`/batches/${batchId}/fermentation-logs/${logId}`);
    },
    onSuccess: (_, variables) => {
      // Invalidate logs query after deletion
      queryClient.invalidateQueries({ queryKey: ['fermentation-logs', variables.batchId] });
    },
  });
};
