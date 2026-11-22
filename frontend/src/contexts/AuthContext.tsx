import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { profileAPI } from '../api/profile';

export interface User {
  id: number;
  email: string;
  username: string;
  role?: string;
  is_admin?: boolean;
  phone?: string;
  bio?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  preferred_language?: number;
  preferred_language_name?: string;
  two_factor_enabled?: boolean;
  profile_picture?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
  autoSaveLocation: (loc: { country?: string; state?: string; district?: string; city?: string; latitude?: number; longitude?: number }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // First try fetching extended profile
      const data = await profileAPI.getProfile();
      setUser(data);
    } catch (error) {
      try {
        const fallbackMe = await authAPI.me();
        setUser(fallbackMe);
      } catch (meError) {
        console.error('Failed to fetch authenticated user:', meError);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string, loggedInUser: User) => {
    localStorage.setItem('access_token', token);
    setUser(loggedInUser);
    fetchUser(); // Refresh extended profile immediately
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const autoSaveLocation = async (loc: { country?: string; state?: string; district?: string; city?: string; latitude?: number; longitude?: number }) => {
    if (!user) return;
    try {
      const updated = await profileAPI.updateLocation(loc);
      setUser(updated);
    } catch (err) {
      console.warn('Failed to auto-save location to profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refetchUser: fetchUser,
        updateUser,
        autoSaveLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
