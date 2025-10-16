import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export function useIngredients() {
  const queryClient = useQueryClient();

  const { data: ingredients, isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/ingredients`, getAuthHeaders());
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newIngredient: any) => {
      const { data } = await axios.post(
        `${API_URL}/ingredients`,
        newIngredient,
        getAuthHeaders()
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/ingredients/${id}`, getAuthHeaders());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  return {
    ingredients,
    isLoading,
    createIngredient: createMutation.mutateAsync,
    deleteIngredient: deleteMutation.mutateAsync,
  };
}

export function useIngredient(id: string) {
  const queryClient = useQueryClient();

  const { data: ingredient, isLoading } = useQuery({
    queryKey: ['ingredients', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/ingredients/${id}`, getAuthHeaders());
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedIngredient: any) => {
      const { data } = await axios.patch(
        `${API_URL}/ingredients/${id}`,
        updatedIngredient,
        getAuthHeaders()
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients', id] });
    },
  });

  return {
    ingredient,
    isLoading,
    updateIngredient: updateMutation.mutateAsync,
  };
}