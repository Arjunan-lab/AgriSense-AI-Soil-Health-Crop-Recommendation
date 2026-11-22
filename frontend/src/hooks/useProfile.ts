import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile, updateProfile as updateProfileApi } from '../api/profile';
import { User } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      const updated = await updateProfileApi(updates);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    refetch: loadProfile,
    updateProfile: saveProfile,
  };
}

export default useProfile;
