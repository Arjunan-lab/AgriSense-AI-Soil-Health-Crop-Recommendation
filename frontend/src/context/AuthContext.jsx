import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { isTokenExpired } from '../utils/jwt';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  const login = useCallback(async (accessToken, refreshToken, userData) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    setLoading(false);
  }, []);

  // Fetch current user details
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/get');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to retrieve user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        await fetchCurrentUser();
      } else {
        logout();
      }
    };

    initAuth();

    // Listen to automatic logouts triggered by axios interceptors
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, [fetchCurrentUser, logout]);

  const value = {
    isAuthenticated: !!token && !isTokenExpired(token),
    user,
    token,
    loading,
    login,
    logout,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
