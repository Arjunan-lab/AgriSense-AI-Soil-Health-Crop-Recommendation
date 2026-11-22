/**
 * components/Settings/SettingsCard.jsx
 * ---------------------------------------
 * Reusable grouped settings section wrapper.
 *
 * Props:
 *   title       {string}       - Section title
 *   description {string}       - Optional subtitle text
 *   icon        {LucideIcon}   - Optional icon next to title
 *   children    {ReactNode}
 *   className   {string}
 *   delay       {number}       - Framer Motion stagger delay
 */
import React from 'react';
import { motion } from 'framer-motion';

const SettingsCard = ({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={`bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card shadow-soft overflow-hidden ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-500 dark:text-primary-400 rounded-lg shrink-0">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-5">
        {children}
      </div>
    </motion.div>
  );
};

export default SettingsCard;
