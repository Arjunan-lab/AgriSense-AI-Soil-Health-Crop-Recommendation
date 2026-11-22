import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Image as ImageIcon, CheckCircle, Activity, Award } from 'lucide-react';
import { LatestPrediction as LatestPredictionType } from '../../types/dashboard';
import { formatDate, formatProbability, getConfidenceColorClass, getHealthScoreColorClass } from '../../utils/formatters';

interface LatestPredictionProps {
  prediction: LatestPredictionType;
}

export const LatestPrediction: React.FC<LatestPredictionProps> = ({ prediction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="bg-white dark:bg-slate-900 rounded-card shadow-soft border border-slate-100 dark:border-slate-800/80 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle className="h-4 w-4" />
            </span>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              Latest Analysis Results
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time EfficientNetB2 Soil Classification + CatBoost Recommendation
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(prediction.created_at)}</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Classification Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Soil Classification
          </h4>
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl space-y-3.5">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Predicted Soil Type</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize mt-0.5">
                {prediction.predicted_soil}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Confidence</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getConfidenceColorClass(prediction.confidence * 100)}`}>
                {formatProbability(prediction.confidence * 100)}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Uploaded Image</p>
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400">
                <ImageIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[200px]" title={prediction.uploaded_image_name}>
                  {prediction.uploaded_image_name || 'No image details'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Scoring */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Soil Health & Fertility
          </h4>
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Health Score</p>
                <p className={`text-xl font-extrabold mt-0.5 ${getHealthScoreColorClass(prediction.soil_health_score)}`}>
                  {prediction.soil_health_score.toFixed(1)}/100
                </p>
              </div>
              <div className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-400">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Health Class</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                {prediction.soil_health_class}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Soil Fertility</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                {prediction.soil_fertility}
              </p>
            </div>
          </div>
        </div>

        {/* Agronomic Recommendations */}
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Recommendations
          </h4>
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl space-y-3.5 h-[calc(100%-2rem)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Recommended Crop</p>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 capitalize">
                  {prediction.recommended_crop}
                </p>
              </div>
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg shrink-0">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Nutrient Deficiency</p>
              <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">
                {prediction.nutrient_deficiency || 'None detected'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Analysis ID</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <code className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded">
                  {prediction.analysis_id}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LatestPrediction;
