import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { getConfidenceColorClass, formatProbability } from '../../utils/formatters';
import { Award } from 'lucide-react';

interface PredictionCardProps {
  predictedSoil: string;
  confidence: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  predictedSoil,
  confidence,
}) => {
  const badgeColorClass = getConfidenceColorClass(confidence);

  return (
    <Card animate delay={0.05}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Award className="h-4.5 w-4.5 text-primary-500 shrink-0" />
          <span>Soil Type Prediction</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Predicted Class
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">
              {predictedSoil}
            </h2>
          </div>
          <div className="shrink-0 flex items-center">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold border shadow-sm ${badgeColorClass}`}
            >
              {formatProbability(confidence)} Confidence
            </span>
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Model Confidence</span>
            <span>{formatProbability(confidence)}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
