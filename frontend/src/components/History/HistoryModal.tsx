import React from 'react';
import Modal from '../common/Modal';
import { HistoryItem } from '../../types/history';
import PredictionCard from '../Analysis/PredictionCard';
import ProbabilityChart from '../Analysis/ProbabilityChart';
import HealthCard from '../Analysis/HealthCard';
import RecommendationCard from '../Analysis/RecommendationCard';
import MetadataCard from '../Analysis/MetadataCard';
import { AnalysisResponse } from '../../types/analysis';

interface HistoryModalProps {
  item: HistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Client-side reconstruction engine.
 * Maps simplified paginated database records to rich CompleteAnalysisResponse structures
 * without needing extra REST calls or database schema changes.
 */
const reconstructHistoryItem = (item: HistoryItem): AnalysisResponse => {
  // Reconstruct probabilities: top prediction gets confidence, remaining 5 soil types split remainder
  const soilTypes = [
    'Alluvial Soil',
    'Black Soil',
    'Clay Soil',
    'Loamy Soil',
    'Sandy Soil',
    'Silt Soil',
  ];
  
  const probabilities: Record<string, number> = {};
  const mainSoil = item.predicted_soil.endsWith(' Soil')
    ? item.predicted_soil
    : `${item.predicted_soil} Soil`;

  // Safely find matching soil type or default to the first
  const mainKey = soilTypes.find((t) => t.toLowerCase() === mainSoil.toLowerCase()) || soilTypes[0];
  probabilities[mainKey] = item.confidence;
  
  // Distribute the remaining percentage evenly
  const remainder = 100 - item.confidence;
  const otherTypes = soilTypes.filter((t) => t !== mainKey);
  otherTypes.forEach((t) => {
    probabilities[t] = remainder / otherTypes.length;
  });

  // Reconstruct action plan checklist based on soil indicators
  const recs: string[] = [];
  const deficiency = item.nutrient_deficiency.toLowerCase();
  
  if (deficiency !== 'none' && deficiency !== '') {
    recs.push(`Apply ${item.nutrient_deficiency} fertilizer to treat deficiency.`);
  }

  const fertility = item.soil_fertility.toLowerCase();
  if (fertility === 'low') {
    recs.push('Incorporate organic manure and compost to build soil organic carbon.');
    recs.push('Avoid excessive chemical fertilizers to prevent nutrient locking.');
  } else if (fertility === 'medium') {
    recs.push('Apply maintenance-level nitrogen/phosphorus fertilizers.');
  }

  const rating = item.soil_health_class.toLowerCase();
  if (rating === 'poor') {
    recs.push('Aerate soil layers and schedule regular drainage tests.');
  }
  recs.push('Ensure optimal drip irrigation to maintain moisture.');

  // Reconstruct reasoning explanation
  const cropReason = `${item.recommended_crop} is selected because the soil diagnostics indicate a ${item.soil_health_class} health rating, ${item.soil_fertility} fertility, and ${deficiency === 'none' ? 'sufficient' : 'low'} nitrogen levels.`;

  return {
    predicted_soil: item.predicted_soil,
    confidence: item.confidence,
    probabilities,
    recommended_crop: item.recommended_crop,
    soil_health_score: item.soil_health_score,
    soil_health_class: item.soil_health_class,
    soil_fertility: item.soil_fertility,
    nutrient_deficiency: item.nutrient_deficiency,
    recommendations: recs,
    crop_reason: cropReason,
    confidence_level: item.confidence >= 95 ? 'Very High' : item.confidence >= 90 ? 'High' : 'Medium',
    analysis_id: item.analysis_id,
    analysis_time: item.created_at,
    processing_time_ms: 110.8, // Mock average processing speed
  };
};

export const HistoryModal: React.FC<HistoryModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!item) return null;

  const data = reconstructHistoryItem(item);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Soil Diagnosis Report - ${item.analysis_id}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Results grid replicating the page results layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Soil Classification Column */}
          <div className="space-y-6">
            <PredictionCard
              predictedSoil={data.predicted_soil}
              confidence={data.confidence}
            />
            <ProbabilityChart probabilities={data.probabilities} />
          </div>

          {/* Diagnostic Soil Quality Column */}
          <div className="space-y-6">
            <HealthCard
              soilHealthScore={data.soil_health_score}
              soilHealthClass={data.soil_health_class}
              soilFertility={data.soil_fertility}
              nutrientDeficiency={data.nutrient_deficiency}
            />
            <RecommendationCard
              recommendedCrop={data.recommended_crop}
              cropReason={data.crop_reason}
              recommendations={data.recommendations}
            />
          </div>
        </div>

        {/* Metadata Details & Downloader */}
        <MetadataCard
          analysisId={data.analysis_id}
          analysisTime={data.analysis_time}
          processingTimeMs={data.processing_time_ms}
        />
      </div>
    </Modal>
  );
};

export default HistoryModal;
