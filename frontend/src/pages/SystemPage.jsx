/**
 * pages/SystemPage.jsx
 * --------------------
 * System health and model information status page.
 * Skeleton placeholder — full API integration in Phase 2.
 */
import React from 'react';
import { Activity, Server, Cpu, Shield, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader, StatCard } from '../components/common/FeedbackStates';
import { Skeleton } from '../components/common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

const STATUS_ITEMS = [
  { label: 'API Server',             icon: Server,   status: 'Operational' },
  { label: 'PostgreSQL Database',    icon: Database, status: 'Connected' },
  { label: 'TensorFlow EfficientNet',icon: Cpu,      status: 'Loaded' },
  { label: 'CatBoost Models',        icon: Activity, status: 'Ready' },
  { label: 'JWT Authentication',     icon: Shield,   status: 'Configured' },
];

const SystemPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Status"
        subtitle="Real-time status of all backend services, models, and integrations."
      />

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {STATUS_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-primary-50 dark:bg-primary-950/20 text-primary-500 dark:text-primary-400 rounded-card">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Service integration</p>
                  </div>
                </div>
                {/* Placeholder badge */}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  {item.status}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Model info skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-5 text-center">
            Live model details fetched from GET /health and GET /model-info — Phase 2
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemPage;
