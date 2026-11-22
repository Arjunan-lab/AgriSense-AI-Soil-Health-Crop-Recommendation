import { apiClient } from './client';

export const analysisAPI = {
  predict: async (formData: FormData) => {
    const { data } = await apiClient.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  completeAnalysis: async (payload: any) => {
    let formData: FormData;

    if (payload instanceof FormData) {
      formData = payload;
      // Map N, P, K if they exist and full names don't
      if (!formData.has('nitrogen') && formData.has('N')) formData.append('nitrogen', formData.get('N') as string);
      if (!formData.has('phosphorus') && formData.has('P')) formData.append('phosphorus', formData.get('P') as string);
      if (!formData.has('potassium') && formData.has('K')) formData.append('potassium', formData.get('K') as string);
    } else {
      formData = new FormData();
      const fileToUpload = payload.file || payload.image;
      if (fileToUpload) formData.append('file', fileToUpload);
      
      formData.append('nitrogen', payload.N || payload.nitrogen);
      formData.append('phosphorus', payload.P || payload.phosphorus);
      formData.append('potassium', payload.K || payload.potassium);
      if (payload.ph) formData.append('ph', payload.ph);
      if (payload.organic_carbon) formData.append('organic_carbon', payload.organic_carbon);
      if (payload.electrical_conductivity) formData.append('electrical_conductivity', payload.electrical_conductivity);
      if (payload.temperature) formData.append('temperature', payload.temperature);
      if (payload.humidity) formData.append('humidity', payload.humidity);
      if (payload.rainfall) formData.append('rainfall', payload.rainfall);
    }

    // Ensure strictly required fields have fallback values if missing
    if (!formData.has('organic_carbon')) formData.append('organic_carbon', '1.5');
    if (!formData.has('electrical_conductivity')) formData.append('electrical_conductivity', '1.2');
    if (!formData.has('temperature')) formData.append('temperature', '25');
    if (!formData.has('humidity')) formData.append('humidity', '60');
    if (!formData.has('rainfall')) formData.append('rainfall', '100');

    const { data } = await apiClient.post('/complete-analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};
