import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', animate = false, delay = 0, ...props }) => {
  const baseClasses = 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden';
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-bold text-slate-800 dark:text-slate-100 ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end ${className}`}>
    {children}
  </div>
);
