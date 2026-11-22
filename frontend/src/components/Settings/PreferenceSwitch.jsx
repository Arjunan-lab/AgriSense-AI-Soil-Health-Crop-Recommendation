/**
 * components/Settings/PreferenceSwitch.jsx
 * -----------------------------------------
 * Accessible toggle switch that persists its state to localStorage.
 *
 * Props:
 *   id          {string}   - localStorage key AND HTML id
 *   label       {string}   - visible label
 *   description {string}   - optional helper text
 *   defaultOn   {boolean}  - initial value when no localStorage key exists
 *   onChange    {function} - optional callback(newValue)
 *   disabled    {boolean}
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PreferenceSwitch = ({
  id,
  label,
  description,
  defaultOn = false,
  onChange,
  disabled = false,
}) => {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem(`pref_${id}`);
    if (stored !== null) return stored === 'true';
    return defaultOn;
  });

  const toggle = () => {
    if (disabled) return;
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(`pref_${id}`, String(next));
    onChange?.(next);
  };

  return (
    <div className="flex items-start justify-between space-x-4 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
      {/* Label + description */}
      <div className="flex-1 min-w-0">
        <label
          htmlFor={`switch-${id}`}
          className={`text-sm font-semibold cursor-pointer select-none ${
            disabled
              ? 'text-slate-400 dark:text-slate-500'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Toggle */}
      <button
        id={`switch-${id}`}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          ${enabled ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}
        `}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 35 }}
          style={{ translateX: enabled ? 20 : 2 }}
          className="inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 mt-[-0.5px]"
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default PreferenceSwitch;
