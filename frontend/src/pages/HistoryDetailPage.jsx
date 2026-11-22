/**
 * pages/HistoryDetailPage.jsx
 * ---------------------------
 * Skeleton placeholder for single history record view — Phase 2.
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, History } from 'lucide-react';
import { PageHeader } from '../components/common/FeedbackStates';
import { Skeleton } from '../components/common/Loader';

const HistoryDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Link
        to="/history"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-primary-500 transition-colors mb-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to History</span>
      </Link>

      <PageHeader
        title={`Analysis ${id}`}
        subtitle="Detailed soil analysis results and recommendations."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>

      <div className="flex items-center justify-center py-8 text-slate-400 dark:text-slate-600 space-x-2">
        <History className="h-5 w-5" />
        <span className="text-sm font-semibold">History detail view — coming in Phase 2</span>
      </div>
    </div>
  );
};

export default HistoryDetailPage;
