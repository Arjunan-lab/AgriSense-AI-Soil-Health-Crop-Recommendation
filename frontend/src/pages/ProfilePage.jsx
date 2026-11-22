/**
 * pages/ProfilePage.jsx
 * ---------------------
 * User profile display page. API integration in Phase 2.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/common/FeedbackStates';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { formatDate } from '../utils/formatters';

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-4 py-4 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
    <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-500 dark:text-primary-400 rounded-lg mt-0.5">
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value || '—'}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'US';

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your account information."
      />

      {/* Avatar + name card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-6">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-soft-lg shrink-0">
              {initials}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-50">
                {user?.username || 'User'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user?.email || 'No email provided'}
              </p>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account detail fields */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="!pt-0">
            <ProfileField icon={User}     label="Username"      value={user?.username} />
            <ProfileField icon={Mail}     label="Email Address" value={user?.email} />
            <ProfileField icon={Calendar} label="Member Since"  value={user?.created_at ? formatDate(user.created_at) : 'N/A'} />
            <ProfileField icon={ShieldCheck} label="Account Status" value="Active" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
