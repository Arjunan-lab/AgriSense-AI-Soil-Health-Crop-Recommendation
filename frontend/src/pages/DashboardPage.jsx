/**
 * pages/DashboardPage.jsx
 * -----------------------
 * Skeleton placeholder — full implementation in Phase 2.
 */
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { PageHeader } from '../components/common/FeedbackStates';
import { Skeleton } from '../components/common/Loader';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Your soil intelligence overview and recent activity."
      />

      {/* Stat card skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>

      {/* Chart + table skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>

      <div className="flex items-center justify-center py-8 text-slate-400 dark:text-slate-600 space-x-2">
        <LayoutDashboard className="h-5 w-5" />
        <span className="text-sm font-semibold">Dashboard — coming in Phase 2</span>
      </div>
    </div>
  );
};

export default DashboardPage;
