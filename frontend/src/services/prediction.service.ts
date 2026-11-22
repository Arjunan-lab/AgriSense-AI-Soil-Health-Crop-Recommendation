/**
 * Prediction Service
 * High-level service wrapping crop recommendation & fertilizer calculation API endpoints.
 */

import { analyzeSoil, SoilData, SoilAnalysisResult } from '../api/analysis';
import { calculateFertilizer, FertilizerInput, FertilizerResult } from '../api/fertilizer';

export const PredictionService = {
  async predictCrop(data: SoilData): Promise<SoilAnalysisResult> {
    return analyzeSoil(data);
  },

  async calculateFertilizer(input: FertilizerInput): Promise<FertilizerResult> {
    return calculateFertilizer(input);
  },
};

export default PredictionService;
