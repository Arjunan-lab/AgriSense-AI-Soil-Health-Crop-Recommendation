export interface AnalysisResponse {
  predicted_soil: string;
  confidence: number;
  probabilities: Record<string, number>;
  recommended_crop: string;
  soil_health_score: number;
  soil_health_class: string;
  soil_fertility: string;
  nutrient_deficiency: string;
  recommendations: string[];
  crop_reason: string;
  confidence_level: string;
  analysis_id: string;
  analysis_time: string;
  processing_time_ms: number;
}

export interface AnalysisFormInputs {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organic_carbon: number;
  electrical_conductivity: number;
  temperature: number;
  humidity: number;
}
