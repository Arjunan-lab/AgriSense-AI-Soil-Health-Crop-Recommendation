import React from 'react';
import { motion } from 'framer-motion';
import { HistoryItem } from '../../types/history';
import HistoryRow from './HistoryRow';

interface HistoryTableProps {
  items: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onDownload: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
  downloadingIds: Record<string, boolean>;
}

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const HistoryTable: React.FC<HistoryTableProps> = ({
  items,
  onView,
  onDownload,
  onDelete,
  downloadingIds,
}) => {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <motion.div
        variants={tableContainerVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:block w-full overflow-hidden border border-slate-200/60 dark:border-slate-800/80 rounded-card bg-white dark:bg-slate-900 shadow-soft"
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500">
              <th className="px-6 py-4">Analysis ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Predicted Soil</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">Recommended Crop</th>
              <th className="px-6 py-4">Soil Health</th>
              <th className="px-6 py-4">Uploaded Image</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {items.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
                viewMode="row"
                onView={onView}
                onDownload={onDownload}
                onDelete={onDelete}
                isDownloading={!!downloadingIds[item.analysis_id]}
              />
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Tablet & Mobile Card List View */}
      <motion.div
        variants={tableContainerVariants}
        initial="hidden"
        animate="visible"
        className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {items.map((item) => (
          <HistoryRow
            key={item.id}
            item={item}
            viewMode="card"
            onView={onView}
            onDownload={onDownload}
            onDelete={onDelete}
            isDownloading={!!downloadingIds[item.analysis_id]}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default HistoryTable;
