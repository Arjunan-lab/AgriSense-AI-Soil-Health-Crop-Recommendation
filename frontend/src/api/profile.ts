import { apiClient } from './client';

export interface ProfilePayload {
  username?: string;
  bio?: string;
  phone?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  preferred_language?: number | string;
  profile_picture?: string;
}

export const profileAPI = {
  getProfile: async () => {
    const { data } = await apiClient.get('/profile');
    return data;
  },

  updateProfile: async (payload: ProfilePayload) => {
    const { data } = await apiClient.patch('/profile', payload);
    return data;
  },

  updateLocation: async (locationData: {
    country?: string;
    state?: string;
    district?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const { data } = await apiClient.patch('/profile', locationData);
    return data;
  },

  updateLanguage: async (language_id: number) => {
    const { data } = await apiClient.patch('/user/settings/language', { language_id });
    return data;
  },

  uploadPicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/profile/picture', formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },
};
