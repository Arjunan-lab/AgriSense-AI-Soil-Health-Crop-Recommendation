import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Award,
  HeartPulse,
  Sprout,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Leaf,
  History,
} from 'lucide-react';
import { getDashboard } from '../api/dashboard';
import { DashboardResponse } from '../types/dashboard';
import { getCropIcon } from '../utils/formatters';
import StatsCard from '../components/Dashboard/StatsCard';

import LatestPrediction from '../components/Dashboard/LatestPrediction';
import DashboardSkeleton from '../components/Dashboard/DashboardSkeleton';
import { useLanguage } from '../context/LanguageContext';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    data,
    isLoading: loading,
    isError,
    error: queryError,
    refetch,
  } = useQuery<DashboardResponse, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboard,
  });

  const error = isError
    ? (queryError as any)?.response?.data?.detail ||
      queryError?.message ||
      t('Unable to load dashboard.')
    : null;

  const fetchDashboardData = () => refetch();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center p-8 border border-rose-100 dark:border-rose-950/20 rounded-card bg-rose-50/15 dark:bg-rose-950/5 shadow-soft max-w-lg mx-auto my-12"
      >
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-450 rounded-full mb-4">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-rose-800 dark:text-rose-350 mb-2">
          {t('Unable to load dashboard.')}
        </h3>
        <p className="text-sm text-rose-600/70 dark:text-rose-400/55 mb-6">
          {error}. {t('Please check your connection and try again.')}
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-card text-sm shadow-soft transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{t('Retry')}</span>
        </motion.button>
      </motion.div>
    );
  }

  if (!data || data.total_predictions === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">
            {t('Dashboard')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('Real-time agricultural insights and metrics overview.')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-card bg-white dark:bg-slate-900 shadow-soft max-w-2xl mx-auto my-6"
        >
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full mb-4">
            <Sprout className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t('No analyses yet.')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
            {t('Start your first soil analysis to receive AI crop recommendations and health diagnostics.')}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analysis')}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-card text-sm shadow-soft transition-colors cursor-pointer"
          >
            <Leaf className="h-4.5 w-4.5" />
            <span>{t('Analyze Soil')}</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Format statistics
  const formattedConfidence = data.average_confidence.toFixed(2);
  const formattedSoilHealth = data.average_soil_health.toFixed(2);
  
  // Format recommended crop with icon
  const cropRaw = data.most_recommended_crop || '';
  const cropCapitalized = cropRaw
    ? cropRaw.charAt(0).toUpperCase() + cropRaw.slice(1)
    : '—';
  const formattedCrop = cropRaw
    ? `${getCropIcon(cropRaw)} ${t(cropCapitalized)}`
    : '—';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">
          {t('Dashboard')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('Real-time agricultural insights and metrics overview.')}
        </p>
      </motion.div>

      {/* 4 Stats Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatsCard
          title={t('Total Predictions')}
          value={data.total_predictions}
          icon={Activity}
          delay={0}
        />
        <StatsCard
          title={t('Average Confidence')}
          value={`${formattedConfidence}%`}
          icon={Award}
          delay={0.06}
        />
        <StatsCard
          title={t('Average Soil Health')}
          value={formattedSoilHealth}
          icon={HeartPulse}
          delay={0.12}
        />
        <StatsCard
          title={t('Most Recommended Crop')}
          value={formattedCrop}
          icon={Sprout}
          delay={0.18}
        />
      </motion.div>

      {/* Latest Prediction Card */}
      {data.latest_prediction && (
        <motion.div variants={itemVariants}>
          <LatestPrediction prediction={data.latest_prediction} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
