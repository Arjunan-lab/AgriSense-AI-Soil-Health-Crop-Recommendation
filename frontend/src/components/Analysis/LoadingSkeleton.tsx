import React from 'react';
import { Skeleton } from '../common/Loader';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 2-Column Grid matching desktop results layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Side: Prediction Card + Probability bars */}
        <div className="space-y-6">
          {/* Soil Prediction Card Skeleton */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-6 shadow-soft space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <div className="flex items-center justify-between py-2">
              <Skeleton className="h-10 w-1/2 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Probability Chart Skeleton */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-6 shadow-soft space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-4 pt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Health Card + Recommendation Card */}
        <div className="space-y-6">
          {/* Soil Health Card Skeleton */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-6 shadow-soft space-y-5">
            <Skeleton className="h-4 w-1/3" />
            <div className="flex items-center space-x-6 py-2">
              <Skeleton className="h-20 w-20 rounded-full shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-24 rounded-lg" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-24 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Crop Recommendation Card Skeleton */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-6 shadow-soft space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-2/5 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="space-y-2.5 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 w-3/4" />
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Card Skeleton */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-6 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 w-full sm:w-auto">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-full sm:w-36 rounded-card shrink-0" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingSkeleton;
