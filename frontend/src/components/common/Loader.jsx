import React from 'react';

// Circular animated spinner
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 stroke-2',
    md: 'h-8 w-8 stroke-[2.5]',
    lg: 'h-12 w-12 stroke-3',
  };

  return (
    <svg 
      className={`animate-spin text-primary-500 ${sizes[size]} ${className}`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
  );
};

// Pulsing loader box for components layout
export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const shapes = {
    rect: 'rounded-card',
    circle: 'rounded-full',
  };

  return (
    <div 
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${shapes[variant]} ${className}`} 
    />
  );
};

export const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="flex flex-col items-center space-y-4">
      <Spinner size="lg" />
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading page...</span>
    </div>
  </div>
);

// Full page loader overlay with agricultural spin
export const GlobalOverlay = ({ message = 'Processing, please wait...' }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200"
    >
      <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-card border border-slate-200/50 dark:border-slate-800 shadow-soft-lg flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {message}
        </span>
      </div>
    </div>
  );
};
