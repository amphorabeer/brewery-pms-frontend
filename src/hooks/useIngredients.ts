import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface Ingredient {
  id: string;
  orgId: string;
  name: string;
  type: string;
  supplier?: string;
  costPerUnit?: number;
  unit: string;
  stock?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientDto {
  name: string;
  type: string;
  supplier?: string;
  costPerUnit?: number;
  unit: string;
  stock?: number;
  notes?: string;
  isActive?: boolean;
}

export function useIngredients(search?: string) {
  const queryClient = useQueryClient();

  // Fetch all ingredients
  const query = useQuery({
    queryKey: ['ingredients', search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const response = await api.get(`/ingredients?${params.toString()}`);
      return response.data as Ingredient[];
    },
  });

  // Create ingredient mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateIngredientDto) => {
      const response = await api.post('/ingredients', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Ingredient created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create ingredient');
    },
  });

  // Update ingredient mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateIngredientDto> }) => {
      const response = await api.patch(`/ingredients/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Ingredient updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update ingredient');
    },
  });

  // Delete ingredient mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ingredients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Ingredient deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete ingredient');
    },
  });

  return {
    ingredients: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createIngredient: createMutation.mutate,
    updateIngredient: updateMutation.mutate,
    deleteIngredient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook for single ingredient
export function useIngredient(id: string) {
  return useQuery({
    queryKey: ['ingredient', id],
    queryFn: async () => {
      const response = await api.get(`/ingredients/${id}`);
      return response.data as Ingredient;
    },
    enabled: !!id,
  });
}