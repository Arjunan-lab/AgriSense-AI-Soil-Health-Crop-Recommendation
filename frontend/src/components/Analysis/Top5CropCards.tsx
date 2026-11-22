import React from 'react';
import { Award, CheckCircle2, TrendingUp, Sprout } from 'lucide-react';
import { CropRecommendationItem } from '../../types/analysis';

interface Top5CropCardsProps {
  crops: CropRecommendationItem[];
}

export const Top5CropCards: React.FC<Top5CropCardsProps> = ({ crops }) => {
  if (!crops || crops.length === 0) return null;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { label: '🥇 #1 Top Match', bg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-800' };
      case 2:
        return { label: '🥈 #2 Recommended', bg: 'bg-slate-500/10 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700' };
      case 3:
        return { label: '🥉 #3 Suitable', bg: 'bg-amber-700/10 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border-amber-600/30' };
      default:
        return { label: `#${rank} Alternative`, bg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-750' };
    }
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability?.toLowerCase()) {
      case 'excellent':
        return 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
      case 'very good':
        return 'bg-teal-500/15 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400 border-teal-300 dark:border-teal-800';
      case 'good':
        return 'bg-blue-500/15 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-amber-500/15 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-300 dark:border-amber-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-card p-5 space-y-4 shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Top 5 Crop Recommendations
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Ranked probabilistically by CatBoost using soil & weather conditions
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          AI Probabilistic Model
        </span>
      </div>

      <div className="space-y-3">
        {crops.map((item) => {
          const badge = getRankBadge(item.rank);
          const suitabilityClass = getSuitabilityColor(item.suitability);

          return (
            <div
              key={item.rank}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                item.rank === 1
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">
                    {item.crop}
                  </h4>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${suitabilityClass}`}>
                    {item.suitability}
                  </span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                    {item.confidence}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    item.rank === 1
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : item.rank === 2
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                      : item.rank === 3
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500'
                  }`}
                  style={{ width: `${Math.min(item.confidence, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Top5CropCards;
