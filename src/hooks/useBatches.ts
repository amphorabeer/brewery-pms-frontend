'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Batch, BatchStatus, Statistics } from '@/types';

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