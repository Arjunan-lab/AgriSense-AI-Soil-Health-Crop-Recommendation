import { CropRecommendationItem, WeatherData } from './analysis';

export interface HistoryItem {
  id: number;
  user_id: number;
  predicted_soil: string;
  confidence: number;
  recommended_crop: string;
  recommended_crops?: CropRecommendationItem[];
  soil_health_score: number;
  soil_health_class: string;
  soil_fertility: string;
  nutrient_deficiency: string;
  uploaded_image_name: string;
  weather_data?: WeatherData;
  created_at: string;
  analysis_id: string;
}

export interface HistoryResponse {
  total: number;
  page: number;
  limit: number;
  items: HistoryItem[];
}
