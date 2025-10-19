import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  organization?: any;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  login: async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      console.log('Login response:', data);

      // IMPORTANT: Backend returns accessToken (not access_token)
      if (data.accessToken) {
        localStorage.setItem('access_token', data.accessToken);
        console.log('Access token saved:', data.accessToken.substring(0, 20) + '...');
      }
      
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
        console.log('Refresh token saved');
      }

      // Set user
      if (data.user) {
        set({ user: data.user, loading: false });
        console.log('User set:', data.user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: data, loading: false });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, loading: false });
    }
  },
}));
