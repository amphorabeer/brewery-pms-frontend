'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface Location {
  id: string;
  name: string;
  address?: string;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await api.get('/locations');
      return response.data as Location[];
    },
  });
};
