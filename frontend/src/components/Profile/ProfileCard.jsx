/**
 * components/Profile/ProfileCard.jsx
 * ------------------------------------
 * Displays the user avatar (initials gradient), name, email, verified badge,
 * and a compact statistics strip sourced from the dashboard API.
 *
 * Props:
 *   profile  {UserProfile}     - from GET /profile
 *   stats    {DashboardData}   - from GET /dashboard (optional, shows skeletons)
 *   onEdit   {function}        - opens EditProfileDialog
 *   onChangePassword {function}- opens ChangePasswordDialog
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Pencil, KeyRound, BarChart3, Clock, Calendar, Hash,
} from 'lucide-react';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';

// ── Initials ─────────────────────────────────────────────────────────────────

const getInitials = (username) => {
  if (!username) return 'US';
  const parts = username.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ── Stat item ─────────────────────────────────────────────────────────────────

const StatItem = ({ icon: Icon, label, value, loading }) => (
  <div className="flex flex-col items-center justify-center space-y-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
    <div className="p-1.5 bg-primary-50 dark:bg-primary-950/30 text-primary-500 dark:text-primary-400 rounded-lg">
      <Icon className="h-4 w-4" />
    </div>
    {loading ? (
      <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
    ) : (
      <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">{value}</span>
    )}
    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-center leading-tight">
      {label}
    </span>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const ProfileCard = ({ profile, stats, statsLoading, onEdit, onChangePassword }) => {
  const initials = getInitials(profile?.username);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card shadow-soft overflow-hidden"
    >
      {/* Hero gradient bar */}
      <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-400 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent)]" />
      </div>

      {/* Avatar + name section */}
      <div className="px-6 pb-5">
        {/* Avatar overlapping the bar */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-soft-lg border-4 border-white dark:border-slate-900 shrink-0">
            {initials}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              icon={KeyRound}
              onClick={onChangePassword}
              aria-label="Change password"
            >
              Password
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Pencil}
              onClick={onEdit}
              aria-label="Edit profile"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Name + meta */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-50">
              {profile?.username || '—'}
            </h2>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email || '—'}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 rounded-full text-[11px] font-semibold border border-primary-100 dark:border-primary-900/40">
              <span>🌐</span>
              <span>{profile?.preferred_language || 'English'}</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
              <Hash className="h-3 w-3" />
              <span>ID {profile?.id || '—'}</span>
            </span>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <StatItem
            icon={BarChart3}
            label="Analyses"
            value={stats?.total_predictions ?? '—'}
            loading={statsLoading}
          />
          <StatItem
            icon={Clock}
            label="Last Analysis"
            value={
              stats?.latest_prediction?.created_at
                ? new Date(stats.latest_prediction.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : '—'
            }
            loading={statsLoading}
          />
          <StatItem
            icon={Calendar}
            label="Member Since"
            value={
              profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'
            }
            loading={!profile}
          />
          <StatItem
            icon={Hash}
            label="User ID"
            value={profile?.id ? `#${profile.id}` : '—'}
            loading={!profile}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
