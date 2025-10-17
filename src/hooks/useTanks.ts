import { useState, useEffect } from 'react';

export interface Tank {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: string;
  location?: string;
  notes?: string;
  batches?: any[];
}

export const useTanks = () => {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTanks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tanks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTanks(data);
      }
    } catch (error) {
      console.error('Error fetching tanks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTanks();
  }, []);

  const createTank = async (tankData: Partial<Tank>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tanks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(tankData),
      }
    );

    if (response.ok) {
      await fetchTanks();
      return true;
    }
    return false;
  };

  const updateTank = async (id: string, tankData: Partial<Tank>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tanks/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(tankData),
      }
    );

    if (response.ok) {
      await fetchTanks();
      return true;
    }
    return false;
  };

  const deleteTank = async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tanks/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    if (response.ok) {
      await fetchTanks();
      return true;
    }
    return false;
  };

  return {
    tanks,
    isLoading,
    createTank,
    updateTank,
    deleteTank,
    refetch: fetchTanks,
  };
};
