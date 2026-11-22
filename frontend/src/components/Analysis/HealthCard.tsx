import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { HeartPulse } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface HealthCardProps {
  soilHealthScore: number;
  soilHealthClass: string;
  soilFertility: string;
  nutrientDeficiency: string;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  soilHealthScore,
  soilHealthClass,
  soilFertility,
  nutrientDeficiency,
}) => {
  // SVG Config
  const radius = 36;
  const circumference = 2 * Math.PI * radius; // ~226.19
  const offset = circumference - (soilHealthScore / 100) * circumference;

  // Color mappings
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Emerald
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const getScoreBgColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getHealthClassBadge = (className: string) => {
    const norm = className.toLowerCase();
    if (norm.includes('good') || norm.includes('excellent') || norm.includes('high')) {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
    }
    if (norm.includes('moderate') || norm.includes('fair') || norm.includes('medium')) {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    }
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
  };

  const getFertilityBadge = (fertility: string) => {
    const norm = fertility.toLowerCase();
    if (norm === 'high') {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
    }
    if (norm === 'medium') {
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
    }
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
  };

  const getDeficiencyBadge = (deficiency: string) => {
    const norm = deficiency.toLowerCase();
    if (norm === 'none' || norm === 'no' || norm === 'healthy') {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
    }
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
  };

  const scoreColor = getScoreColor(soilHealthScore);
  const scoreTextClass = getScoreBgColorClass(soilHealthScore);

  return (
    <Card animate delay={0.18}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <HeartPulse className="h-4.5 w-4.5 text-primary-500 shrink-0" />
          <span>Soil Health Diagnostics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Section: Radial Score Ring */}
        <div className="flex items-center space-x-6">
          <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="h-full w-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="40"
                cy="40"
                r={radius}
                stroke={scoreColor}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-base font-extrabold tracking-tight ${scoreTextClass}`}>
                {formatNumber(soilHealthScore, 1)}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase">
                Score
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Health Quality Index
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This score measures the nutrient sufficiency, biological carbon, and physical quality indexes of your soil.
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Health Class */}
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800/80 pt-3 sm:pt-0 sm:pl-4 first:border-0 first:pt-0 first:pl-0">
            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
              Health Rating
            </span>
            <div className="pt-1">
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getHealthClassBadge(soilHealthClass)}`}>
                {soilHealthClass}
              </span>
            </div>
          </div>

          {/* Soil Fertility */}
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800/80 pt-3 sm:pt-0 sm:pl-4 first:border-0 first:pt-0 first:pl-0">
            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
              Fertility Class
            </span>
            <div className="pt-1">
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getFertilityBadge(soilFertility)}`}>
                {soilFertility}
              </span>
            </div>
          </div>

          {/* Deficiency */}
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800/80 pt-3 sm:pt-0 sm:pl-4 first:border-0 first:pt-0 first:pl-0">
            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
              Nutrient Deficiency
            </span>
            <div className="pt-1">
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getDeficiencyBadge(nutrientDeficiency)}`}>
                {nutrientDeficiency}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthCard;
