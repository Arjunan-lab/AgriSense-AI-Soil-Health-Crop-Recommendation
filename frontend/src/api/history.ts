import { apiClient } from './client';

export const historyAPI = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get('/history', { params });
    return data;
  },
  getOne: async (id: number | string) => {
    const { data } = await apiClient.get(`/history/${id}`);
    return data;
  },
  downloadReport: async (id: number | string) => {
    const response = await apiClient.get(`/analysis/${id}/report`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Analysis_Report_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
