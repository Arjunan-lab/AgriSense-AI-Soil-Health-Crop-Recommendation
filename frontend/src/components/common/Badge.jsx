import React from 'react';

const variantStyles = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
  blue: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
  amber: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
  slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50',
};

const dotColors = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-400',
  purple: 'bg-purple-500',
};

export const Badge = ({
  children,
  variant = 'emerald',
  showDot = false,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const selectedVariant = variantStyles[variant] || variantStyles.emerald;
  const selectedDot = dotColors[variant] || dotColors.emerald;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-wide transition-colors ${sizeClasses} ${selectedVariant} ${className}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${selectedDot} animate-pulse`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
