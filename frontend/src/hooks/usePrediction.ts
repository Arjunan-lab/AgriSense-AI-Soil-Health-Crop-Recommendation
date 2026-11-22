import { useState } from 'react';
import { analyzeSoil, SoilData, SoilAnalysisResult } from '../api/analysis';
import { calculateFertilizer, FertilizerInput, FertilizerResult } from '../api/fertilizer';

export function usePrediction() {
  const [cropResult, setCropResult] = useState<SoilAnalysisResult | null>(null);
  const [fertilizerResult, setFertilizerResult] = useState<FertilizerResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const predictCrop = async (data: SoilData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyzeSoil(data);
      setCropResult(res);
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Crop prediction failed.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const predictFertilizer = async (input: FertilizerInput) => {
    try {
      setLoading(true);
      setError(null);
      const res = await calculateFertilizer(input);
      setFertilizerResult(res);
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Fertilizer calculation failed.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cropResult,
    fertilizerResult,
    loading,
    error,
    predictCrop,
    predictFertilizer,
  };
}

export default usePrediction;
