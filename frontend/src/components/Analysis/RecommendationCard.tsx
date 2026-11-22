import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { Sprout, CheckCircle2 } from 'lucide-react';
import { getCropIcon } from '../../utils/formatters';

interface RecommendationCardProps {
  recommendedCrop: string;
  cropReason: string;
  recommendations: string[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendedCrop,
  cropReason,
  recommendations,
}) => {
  return (
    <Card animate delay={0.24}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Sprout className="h-4.5 w-4.5 text-primary-500 shrink-0" />
          <span>AI Crop Recommendation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Recommendation Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
            Recommended Crop
          </span>
          <h2 className="text-3xl font-extrabold text-primary-650 dark:text-primary-400 tracking-tight flex items-baseline space-x-2">
            <span className="text-4xl leading-none mr-2 shrink-0">{getCropIcon(recommendedCrop)}</span>
            <span>{recommendedCrop}</span>
          </h2>
        </div>


        {/* Diagnostic Reasoning */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-card">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            Recommendation Rationale
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {cropReason}
          </p>
        </div>

        {/* Actionable recommendations checklist */}
        {recommendations.length > 0 && (
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Recommended Soil Actions
            </h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-400 leading-normal"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
