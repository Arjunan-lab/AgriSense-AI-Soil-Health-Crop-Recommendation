import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-card transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white border-transparent focus:ring-primary-500 shadow-soft hover:shadow-soft-lg',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white border-transparent focus:ring-secondary-500 shadow-soft',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white border-transparent focus:ring-accent-500 shadow-soft',
    outline: 'bg-transparent hover:bg-slate-100 text-slate-700 border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-primary-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-transparent focus:ring-red-500 shadow-soft',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
