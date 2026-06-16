import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/api';

interface User {
  userId: string;
  email: string;
  displayName: string;
  subscriptionStatus?: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const cachedUser = localStorage.getItem('user');

      if (token && cachedUser) {
        apiClient.setToken(token);
        setUser(JSON.parse(cachedUser));
      }
    };

    checkAuth();
  }, []);

  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.signup(email, password, displayName);

      apiClient.setToken(response.accessToken);
      const userData: User = {
        userId: response.userId,
        email: response.email,
        displayName: response.displayName,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.login(email, password);

      apiClient.setToken(response.accessToken);
      const userData: User = {
        userId: response.userId,
        email: response.email,
        displayName: response.displayName,
        subscriptionStatus: response.subscriptionStatus,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      await apiClient.logout();

      apiClient.clearToken();
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
