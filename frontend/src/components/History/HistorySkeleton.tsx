import React from 'react';
import { Skeleton } from '../common/Loader';

interface HistorySkeletonProps {
  limit?: number;
}

export const HistorySkeleton: React.FC<HistorySkeletonProps> = ({ limit = 10 }) => {
  return (
    <div className="w-full">
      {/* Desktop Table View Skeleton */}
      <div className="hidden lg:block w-full overflow-hidden border border-slate-200/60 dark:border-slate-800/80 rounded-card bg-white dark:bg-slate-900 shadow-soft">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-28" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
              <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
              <th className="px-6 py-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {[...Array(limit)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4.5"><Skeleton className="h-4 w-28" /></td>
                <td className="px-6 py-4.5"><Skeleton className="h-4 w-24" /></td>
                <td className="px-6 py-4.5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                <td className="px-6 py-4.5"><Skeleton className="h-4 w-12" /></td>
                <td className="px-6 py-4.5"><Skeleton className="h-4 w-20" /></td>
                <td className="px-6 py-4.5"><Skeleton className="h-6 w-16 rounded-full" /></td>
                <td className="px-6 py-4.5"><Skeleton className="h-4 w-32" /></td>
                <td className="px-6 py-4.5 text-right flex justify-end items-center space-x-2">
                  <Skeleton className="h-7 w-12 rounded-lg" />
                  <Skeleton className="h-7 w-12 rounded-lg" />
                  <Skeleton className="h-7 w-8 rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet / Mobile Card Grid Skeleton */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(limit)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-5 shadow-soft space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 pb-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySkeleton;
