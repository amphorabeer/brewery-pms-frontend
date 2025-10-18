'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  QcTestType,
  QcTest,
  QcStats,
  CreateQcTestTypeData,
  CreateQcTestData,
} from '@/types';

// ========================================
// QC TEST TYPES HOOKS
// ========================================

export const useQcTestTypes = (activeOnly = true) => {
  return useQuery({
    queryKey: ['qc-test-types', activeOnly],
    queryFn: async () => {
      const response = await api.get('/qc/test-types', {
        params: { activeOnly },
      });
      return response.data as QcTestType[];
    },
  });
};

export const useQcTestType = (id: string) => {
  return useQuery({
    queryKey: ['qc-test-type', id],
    queryFn: async () => {
      const response = await api.get(`/qc/test-types/${id}`);
      return response.data as QcTestType;
    },
    enabled: !!id,
  });
};

export const useCreateQcTestType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQcTestTypeData) => {
      const response = await api.post('/qc/test-types', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-test-types'] });
    },
  });
};

export const useUpdateQcTestType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateQcTestTypeData> }) => {
      const response = await api.patch(`/qc/test-types/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-test-types'] });
    },
  });
};

export const useDeleteQcTestType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/qc/test-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-test-types'] });
    },
  });
};

// ========================================
// QC TESTS HOOKS
// ========================================

export const useQcTests = (batchId?: string) => {
  return useQuery({
    queryKey: ['qc-tests', batchId],
    queryFn: async () => {
      const response = await api.get('/qc/tests', {
        params: batchId ? { batchId } : {},
      });
      return response.data as QcTest[];
    },
  });
};

export const useQcTest = (id: string) => {
  return useQuery({
    queryKey: ['qc-test', id],
    queryFn: async () => {
      const response = await api.get(`/qc/tests/${id}`);
      return response.data as QcTest;
    },
    enabled: !!id,
  });
};

export const useCreateQcTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQcTestData) => {
      const response = await api.post('/qc/tests', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['qc-tests'] });
      queryClient.invalidateQueries({ queryKey: ['qc-tests', variables.batchId] });
      queryClient.invalidateQueries({ queryKey: ['qc-stats'] });
      queryClient.invalidateQueries({ queryKey: ['qc-stats', variables.batchId] });
    },
  });
};

export const useUpdateQcTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateQcTestData> }) => {
      const response = await api.patch(`/qc/tests/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-tests'] });
      queryClient.invalidateQueries({ queryKey: ['qc-stats'] });
    },
  });
};

export const useDeleteQcTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/qc/tests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qc-tests'] });
      queryClient.invalidateQueries({ queryKey: ['qc-stats'] });
    },
  });
};

// ========================================
// STATISTICS HOOK
// ========================================

export const useQcStats = (batchId?: string) => {
  return useQuery({
    queryKey: ['qc-stats', batchId],
    queryFn: async () => {
      const response = await api.get('/qc/stats', {
        params: batchId ? { batchId } : {},
      });
      return response.data as QcStats;
    },
  });
};
