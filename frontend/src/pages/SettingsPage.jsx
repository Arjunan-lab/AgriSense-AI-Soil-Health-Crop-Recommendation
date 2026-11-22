/**
 * pages/SettingsPage.jsx
 * ----------------------
 * App preferences settings page. Full form integration in Phase 2.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from '../components/common/FeedbackStates';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import Button from '../components/common/Button';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light',  icon: Sun },
  { value: 'dark',  label: 'Dark',   icon: Moon },
];

const SettingsPage = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Settings"
        subtitle="Customise your Scatter AI experience."
      />

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Choose how Scatter AI looks on your device.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => { if (theme !== value) toggleTheme(); }}
                  className={`flex flex-col items-center justify-center space-y-2 p-4 rounded-card border-2 transition-all duration-200 font-semibold text-sm
                    ${theme === value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/20 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'}
                  `}
                >
                  <Icon className="h-6 w-6" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications placeholder */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
              Notification preferences — coming in Phase 2
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account danger zone */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
        <Card className="border-red-100 dark:border-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              These actions are irreversible. Please proceed with caution.
            </p>
            <Button variant="danger" size="sm" disabled>
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
