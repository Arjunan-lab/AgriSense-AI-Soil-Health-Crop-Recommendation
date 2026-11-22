import React from 'react';
import { Skeleton } from '../common/Loader';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200/50 dark:border-slate-800/80 mb-6 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* 4 Stats Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-card shadow-soft border border-slate-100 dark:border-slate-800/80 flex items-center justify-between h-[100px]"
          >
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-10 w-10" variant="rect" />
          </div>
        ))}
      </div>

      {/* Latest Prediction Skeleton */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-card shadow-soft border border-slate-100 dark:border-slate-800/80 overflow-hidden h-[340px] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Grid Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-28" />
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl space-y-4 h-[calc(100%-2rem)]">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
