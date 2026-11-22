/**
 * components/Settings/ThemeSelector.jsx
 * ---------------------------------------
 * Three-option pill selector: Light / Dark / System.
 * Calls setThemeMode() from ThemeContext directly.
 *
 * Props: none (reads from ThemeContext internally)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const OPTIONS = [
  { value: 'light',  label: 'Light',  icon: Sun,     description: 'Always use light mode' },
  { value: 'dark',   label: 'Dark',   icon: Moon,    description: 'Always use dark mode' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Match your OS preference' },
];

const ThemeSelector = () => {
  const { theme, setThemeMode } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Theme selection">
      {OPTIONS.map(({ value, label, icon: Icon, description }) => {
        const isActive = theme === value;
        return (
          <motion.button
            key={value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme — ${description}`}
            onClick={() => setThemeMode(value)}
            className={`
              relative flex flex-col items-center justify-center space-y-2.5 p-4 rounded-xl border-2 
              transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${isActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }
            `}
          >
            {/* Active indicator dot */}
            {isActive && (
              <motion.div
                layoutId="theme-active"
                className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary-500"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}

            {/* Icon */}
            <div
              className={`p-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Label */}
            <span
              className={`text-xs font-bold tracking-wide ${
                isActive
                  ? 'text-primary-700 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {label}
            </span>

            {/* Description (hidden on sm, shown on md+) */}
            <span className="hidden sm:block text-[10px] text-slate-400 dark:text-slate-500 text-center leading-tight">
              {description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
