import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    console.error('No access token found in localStorage');
    return {};
  }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const headers = getAuthHeaders();
      console.log('Fetching ingredients with headers:', headers);
      
      const { data } = await axios.get(
        `${API_URL}/ingredients`,
        headers
      );
      return data;
    },
  });
}

export function useIngredient(id: string) {
  return useQuery({
    queryKey: ['ingredient', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/ingredients/${id}`,
        getAuthHeaders()
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ingredientData: any) => {
      const headers = getAuthHeaders();
      console.log('Creating ingredient with headers:', headers);
      console.log('Ingredient data:', ingredientData);
      
      const { data } = await axios.post(
        `${API_URL}/ingredients`,
        ingredientData,
        headers
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data: ingredientData }: { id: string; data: any }) => {
      const { data } = await axios.patch(
        `${API_URL}/ingredients/${id}`,
        ingredientData,
        getAuthHeaders()
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(
        `${API_URL}/ingredients/${id}`,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}
