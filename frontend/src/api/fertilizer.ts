import { apiClient } from './client';

export interface FertilizerPayload {
  soil_type: string;
  crop?: string;
  crop_name?: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph?: number;
  soil_ph?: number;
  organic_carbon?: number;
  conductivity?: number;
  electrical_conductivity?: number;
  ec?: number;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  location?: string;
}

export interface OrganicFertilizerItem {
  name: string;
  application: string;
  description: string;
  benefit?: string;
  notes?: string;
}

export interface ChemicalFertilizerItem {
  name: string;
  quantity: string;
  timing: string;
  nutrient?: string;
  application_method?: string;
  reason?: string;
  notes?: string;
}

export interface NutrientStatus {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  n_label?: string;
  p_label?: string;
  k_label?: string;
}

export interface ScheduleItem {
  stage: string;
  day: string;
  description: string;
}

export interface FertilizerResponse {
  id?: number;
  recommended_fertilizer: string;
  reason?: string;
  match_level: string;
  expected_improvement?: string;
  alternative_fertilizers?: string[];
  organic: OrganicFertilizerItem[];
  chemical: ChemicalFertilizerItem[];
  analysis?: any;
  nutrient_status: NutrientStatus;
  schedule: ScheduleItem[];
  benefits: string[];
  safety: string[];
  created_at?: string;
}

export interface FertilizerHistoryItem {
  id: number;
  user_id: number;
  soil_type: string;
  crop: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph?: number;
  conductivity?: number;
  recommendation_json: FertilizerResponse;
  created_at: string;
}

export interface PaginatedFertilizerHistory {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: FertilizerHistoryItem[];
}

export const fertilizerAPI = {
  recommend: async (payload: FertilizerPayload): Promise<FertilizerResponse> => {
    const formattedPayload = {
      soil_type: payload.soil_type,
      crop: payload.crop || payload.crop_name || 'Rice',
      nitrogen: payload.nitrogen,
      phosphorus: payload.phosphorus,
      potassium: payload.potassium,
      ph: payload.ph ?? payload.soil_ph ?? 6.5,
      organic_carbon: payload.organic_carbon ?? 0.54,
      conductivity: payload.conductivity ?? payload.electrical_conductivity ?? payload.ec ?? 0.61,
      temperature: payload.temperature,
      humidity: payload.humidity,
      rainfall: payload.rainfall,
      location: payload.location,
    };
    const res = await apiClient.post('/api/fertilizer/recommend', formattedPayload);
    const body = res.data;
    if (body && body.data && typeof body.data === 'object' && ('organic' in body.data || 'recommended_fertilizer' in body.data)) {
      return body.data;
    }
    return body;
  },

  recommendFertilizer: async (payload: FertilizerPayload): Promise<FertilizerResponse> => {
    return fertilizerAPI.recommend(payload);
  },

  getRecommendationHistory: async (params?: { page?: number; limit?: number }): Promise<PaginatedFertilizerHistory> => {
    const res = await apiClient.get('/api/fertilizer/history', { params });
    const body = res.data;
    if (body && body.data && Array.isArray(body.data)) {
      return body;
    }
    if (Array.isArray(body)) {
      return { total: body.length, page: 1, limit: 10, pages: 1, data: body };
    }
    return body || { total: 0, page: 1, limit: 10, pages: 1, data: [] };
  },

  getRecommendation: async (id: number): Promise<FertilizerHistoryItem> => {
    const res = await apiClient.get(`/api/fertilizer/history/${id}`);
    const body = res.data;
    if (body && body.data && typeof body.data === 'object') {
      return body.data;
    }
    return body;
  },

  deleteRecommendation: async (id: number): Promise<{ message: string; id: number }> => {
    const res = await apiClient.delete(`/api/fertilizer/history/${id}`);
    return res.data;
  },
};
