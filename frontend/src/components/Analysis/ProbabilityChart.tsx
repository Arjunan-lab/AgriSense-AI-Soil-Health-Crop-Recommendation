import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { formatProbability } from '../../utils/formatters';
import { BarChart3 } from 'lucide-react';

interface ProbabilityChartProps {
  probabilities: Record<string, number>;
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  probabilities,
}) => {
  // Normalize and clean up probability keys, sort descending
  const sortedProbabilities = Object.entries(probabilities)
    .map(([name, value]) => {
      // Strip " Soil" if present for cleaner display
      const displayName = name.endsWith(' Soil') ? name.slice(0, -5) : name;
      return { name: displayName, value };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <Card animate delay={0.12}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <BarChart3 className="h-4.5 w-4.5 text-primary-500 shrink-0" />
          <span>Soil Probability Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedProbabilities.map((item, index) => {
          const isHighest = index === 0;

          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold transition-all duration-300">
                <span
                  className={
                    isHighest
                      ? 'text-primary-600 dark:text-primary-400 font-extrabold scale-[1.01] origin-left'
                      : 'text-slate-600 dark:text-slate-400'
                  }
                >
                  {item.name} {isHighest && '✨'}
                </span>
                <span
                  className={
                    isHighest
                      ? 'text-primary-600 dark:text-primary-400 font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 font-semibold'
                  }
                >
                  {formatProbability(item.value)}
                </span>
              </div>

              {/* Progress bar container */}
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 + 0.15 }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    isHighest
                      ? 'bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProbabilityChart;
