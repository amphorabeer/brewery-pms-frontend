'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  orgId: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user } = response.data;
    
    localStorage.setItem('access_token', accessToken);
    setUser(user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
};