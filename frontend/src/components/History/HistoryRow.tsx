import React from 'react';
import { motion } from 'framer-motion';
import { Eye, FileDown, Trash2, Calendar, Award, Sprout, Image, HeartPulse } from 'lucide-react';
import { HistoryItem } from '../../types/history';
import { formatDate, formatProbability } from '../../utils/formatters';
import { StatusChip } from '../common/FeedbackStates';
import { Spinner } from '../common/Loader';

interface HistoryRowProps {
  item: HistoryItem;
  viewMode: 'row' | 'card';
  onView: (item: HistoryItem) => void;
  onDownload: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
  isDownloading?: boolean;
}

export const HistoryRow: React.FC<HistoryRowProps> = ({
  item,
  viewMode,
  onView,
  onDownload,
  onDelete,
  isDownloading = false,
}) => {
  const formattedDate = formatDate(item.created_at);
  const formattedConfidence = formatProbability(item.confidence);

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (viewMode === 'card') {
    return (
      <motion.div
        variants={rowVariants}
        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between space-y-4"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between border-b border-slate-50 dark:border-slate-800/50 pb-3 min-w-0">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase block tracking-wider">
              Analysis ID
            </span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-50 truncate block">
              {item.analysis_id}
            </span>
          </div>
          <div className="flex items-center text-slate-400 text-xs font-semibold shrink-0">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{formattedDate.split(' at ')[0]}</span>
          </div>
        </div>

        {/* Card Body Grid */}
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
          {/* Soil Type */}
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold block mb-0.5">Soil Type</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center">
              <Award className="h-3.5 w-3.5 text-primary-500 mr-1 shrink-0" />
              {item.predicted_soil.replace(' Soil', '')}
            </span>
          </div>

          {/* Confidence */}
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold block mb-0.5">Confidence</span>
            <span className="font-extrabold text-slate-700 dark:text-slate-200">
              {formattedConfidence}
            </span>
          </div>

          {/* Recommended Crop */}
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold block mb-0.5">Recommended Crop</span>
            <span className="font-bold text-primary-650 dark:text-primary-400 flex items-center">
              <Sprout className="h-3.5 w-3.5 mr-1 shrink-0" />
              {item.recommended_crop}
            </span>
          </div>

          {/* Soil Health */}
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-semibold block mb-0.5">Soil Health</span>
            <StatusChip status={item.soil_health_class} className="font-bold text-[10px]" />
          </div>
        </div>

        {/* Card Footer: Image name & Actions */}
        <div className="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between gap-4">
          {/* Image name */}
          <div className="flex items-center text-slate-400 text-[10px] min-w-0 font-medium">
            <Image className="h-3.5 w-3.5 mr-1 shrink-0" />
            <span className="truncate">{item.uploaded_image_name}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => onView(item)}
              title="View Details"
              className="p-2 text-slate-500 hover:text-primary-550 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDownload(item)}
              disabled={isDownloading}
              title="Download PDF"
              className="p-2 text-slate-500 hover:text-primary-550 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? <Spinner size="sm" /> : <FileDown className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onDelete(item)}
              title="Delete Record"
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop Table Row View
  return (
    <motion.tr
      variants={rowVariants}
      className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors duration-150"
    >
      {/* Analysis ID */}
      <td className="px-6 py-4.5 text-sm font-bold text-slate-800 dark:text-slate-100">
        {item.analysis_id}
      </td>

      {/* Date */}
      <td className="px-6 py-4.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {formattedDate}
      </td>

      {/* Predicted Soil Type */}
      <td className="px-6 py-4.5">
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800">
          {item.predicted_soil}
        </span>
      </td>

      {/* Confidence */}
      <td className="px-6 py-4.5 text-sm font-extrabold text-slate-750 dark:text-slate-200">
        {formattedConfidence}
      </td>

      {/* Recommended Crop */}
      <td className="px-6 py-4.5 text-sm font-bold text-slate-800 dark:text-slate-200">
        <div className="flex items-center space-x-1.5 text-primary-650 dark:text-primary-400">
          <Sprout className="h-4 w-4 shrink-0" />
          <span>{item.recommended_crop}</span>
        </div>
      </td>

      {/* Soil Health Quality Class */}
      <td className="px-6 py-4.5">
        <StatusChip status={item.soil_health_class} className="font-bold text-[10px]" />
      </td>

      {/* Uploaded Image Name */}
      <td className="px-6 py-4.5 text-xs text-slate-400 dark:text-slate-500 truncate max-w-[150px] font-medium" title={item.uploaded_image_name}>
        <div className="flex items-center space-x-1.5">
          <Image className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{item.uploaded_image_name}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5 text-right">
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => onView(item)}
            className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDownload(item)}
            disabled={isDownloading}
            className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Download PDF report"
          >
            {isDownloading ? <Spinner size="sm" /> : <FileDown className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all duration-200 cursor-pointer"
            title="Delete analysis record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default HistoryRow;
