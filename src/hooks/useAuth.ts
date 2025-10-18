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
    const token = localStorage.getItem('token'); // Changed from 'access_token'
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token'); // Changed from 'access_token'
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user } = response.data;
    
    localStorage.setItem('token', accessToken); // Changed from 'access_token'
    localStorage.setItem('user', JSON.stringify(user)); // Also save user
    setUser(user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token'); // Changed from 'access_token'
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
};