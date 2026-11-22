import { apiClient } from './client';

export const authAPI = {
  login: async (credentials: any) => {
    const { data } = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    return data;
  },
  
  register: async (userData: any) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },
  
  me: async () => {
    const { data } = await apiClient.get('/auth/users/me');
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  }
};
