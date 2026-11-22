import { apiClient } from './client';

export const dashboardAPI = {
  getFarmerStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    return data;
  },
  getDashboardData: async () => {
    const { data } = await apiClient.get('/dashboard');
    return data;
  }
};
