/**
 * pages/History.tsx
 * -----------------
 * Analysis History page — full React Query integration with runtime translations.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { History, Sprout, RefreshCw, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

import { getHistory, deleteHistory } from '../api/history';
import { downloadReport } from '../api/analysis';
import { HistoryItem } from '../types/history';
import { PageHeader } from '../components/common/FeedbackStates';
import SearchBar from '../components/History/SearchBar';
import HistoryTable from '../components/History/HistoryTable';
import HistorySkeleton from '../components/History/HistorySkeleton';
import Pagination from '../components/History/Pagination';
import HistoryModal from '../components/History/HistoryModal';
import DeleteDialog from '../components/History/DeleteDialog';
import { useLanguage } from '../context/LanguageContext';

export const historyKeys = {
  all: ['history'] as const,
  lists: () => [...historyKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...historyKeys.lists(), { page, limit }] as const,
};

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // ── Pagination state ─────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // ── Filter / search state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // ── Modal state ───────────────────────────────────────────────────────────
  const [viewItem, setViewItem] = useState<HistoryItem | null>(null);

  // ── Delete dialog state ───────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<HistoryItem | null>(null);

  // ── PDF download tracking ─────────────────────────────────────────────────
  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>({});

  // ── React Query: Fetch history ────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: historyKeys.list(page, limit),
    queryFn: () => getHistory(page, limit),
    placeholderData: (prev) => prev,
  });

  // ── React Query: Delete mutation ──────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteTarget(null);
      toast.success(t('Analysis deleted successfully.'));
    },
    onError: () => {
      toast.error(t('Failed to delete. Please try again.'));
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleView = useCallback((item: HistoryItem) => {
    setViewItem(item);
  }, []);

  const handleDownload = useCallback(async (item: HistoryItem) => {
    setDownloadingIds((prev) => ({ ...prev, [item.analysis_id]: true }));
    try {
      await downloadReport(item.analysis_id, `Soil_Analysis_Report_${item.analysis_id}.pdf`);
      toast.success(t('Report downloaded successfully!'));
    } catch {
      toast.error(t('Failed to download report. Please try again.'));
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [item.analysis_id]: false }));
    }
  }, [t]);

  const handleDeleteRequest = useCallback((item: HistoryItem) => {
    setDeleteTarget(item);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.analysis_id);
  }, [deleteTarget, deleteMutation]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // ── Client-side filter + sort pipeline ───────────────────────────────────
  const filteredItems = useMemo(() => {
    let items = data?.items ?? [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.analysis_id.toLowerCase().includes(q) ||
          item.predicted_soil.toLowerCase().includes(q) ||
          item.recommended_crop.toLowerCase().includes(q)
      );
    }

    if (healthFilter !== 'all') {
      items = items.filter(
        (item) => item.soil_health_class.toLowerCase() === healthFilter.toLowerCase()
      );
    }

    switch (sortOrder) {
      case 'oldest':
        items = [...items].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'highest_confidence':
        items = [...items].sort((a, b) => b.confidence - a.confidence);
        break;
      case 'lowest_confidence':
        items = [...items].sort((a, b) => a.confidence - b.confidence);
        break;
      default:
        items = [...items].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return items;
  }, [data?.items, searchQuery, healthFilter, sortOrder]);

  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-full pb-12">
        <PageHeader
          title={t('Analysis History')}
          subtitle={t('Browse, search, and manage all your previous soil analyses.')}
        />
        <div className="h-14 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card shadow-soft animate-pulse" />
        <HistorySkeleton limit={limit} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 max-w-full pb-12">
        <PageHeader
          title={t('Analysis History')}
          subtitle={t('Browse, search, and manage all your previous soil analyses.')}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center p-10 border border-rose-100 dark:border-rose-950/20 rounded-card bg-rose-50/15 dark:bg-rose-950/5 shadow-soft max-w-lg mx-auto my-8"
        >
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full mb-4">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-bold text-rose-800 dark:text-rose-350 mb-2">
            {t('Unable to load history.')}
          </h3>
          <p className="text-sm text-rose-600/70 dark:text-rose-400/55 mb-6">
            {t('There was an error retrieving your analysis records. Check your connection and try again.')}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => refetch()}
            className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-card text-sm shadow-soft transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t('Retry')}</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full pb-12">
      <PageHeader
        title={t('Analysis History')}
        subtitle={t('Browse, search, and manage all your previous soil analyses.')}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        healthFilter={healthFilter}
        onHealthFilterChange={setHealthFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        totalCount={filteredItems.length}
      />

      {totalItems === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-card bg-white dark:bg-slate-900 shadow-soft max-w-xl mx-auto my-6"
        >
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full mb-4">
            <Sprout className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t('No analysis records found')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            {t('Run your first soil analysis to build a history of crop recommendations.')}
          </p>
          <button
            onClick={() => navigate('/analysis')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-card text-sm shadow-soft transition-colors cursor-pointer"
          >
            {t('Analyze Soil')}
          </button>
        </motion.div>
      ) : (
        <>
          <HistoryTable
            items={filteredItems}
            onView={handleView}
            onDownload={handleDownload}
            onDelete={handleDeleteRequest}
            downloadingIds={downloadingIds}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            limit={limit}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      {viewItem && (
        <HistoryModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          onDownload={handleDownload}
          isDownloading={!!downloadingIds[viewItem.analysis_id]}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          item={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default HistoryPage;
