export interface LatestPrediction {
  id: number;
  user_id: number;
  predicted_soil: string;
  confidence: number;
  recommended_crop: string;
  soil_health_score: number;
  soil_health_class: string;
  soil_fertility: string;
  nutrient_deficiency: string;
  uploaded_image_name: string;
  created_at: string;
  analysis_id: string;
}

export interface DashboardResponse {
  total_predictions: number;
  average_confidence: number;
  average_soil_health: number;
  most_predicted_soil: string | null;
  most_recommended_crop: string | null;
  latest_prediction: LatestPrediction | null;
  recent_notifications?: any[];
}
