import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-900 p-6 rounded-card shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between"
    >

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-50">
          {value}
        </div>
      </div>
      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 rounded-card">
        <Icon className="h-6 w-6" />
      </div>
    </motion.div>
  );
};

export default StatsCard;
