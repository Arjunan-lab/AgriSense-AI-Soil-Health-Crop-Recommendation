/**
 * components/Profile/ChangePasswordDialog.jsx
 * ---------------------------------------------
 * Secure password change modal with:
 *   - Current / New / Confirm password fields
 *   - Eye-toggle for each field
 *   - Inline strength indicator for new password
 *   - Inline validation messages
 *   - React Query mutation + toast feedback
 *
 * Props:
 *   isOpen  {boolean}
 *   onClose {function}
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import { changePassword } from '../../api/profile';

// ── Password strength rules ───────────────────────────────────────────────────
const RULES = [
  { id: 'length',    label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter',   test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'One lowercase letter',   test: (pw) => /[a-z]/.test(pw) },
  { id: 'digit',     label: 'One digit (0–9)',         test: (pw) => /\d/.test(pw) },
];

const StrengthIndicator = ({ password }) => {
  const passed = RULES.filter((r) => r.test(password)).length;
  const pct = (passed / RULES.length) * 100;
  const color =
    passed <= 1 ? 'bg-rose-500' :
    passed === 2 ? 'bg-amber-400' :
    passed === 3 ? 'bg-lime-400'  : 'bg-emerald-500';

  if (!password) return null;
  return (
    <div className="space-y-2 mt-1">
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.id} className={`flex items-center space-x-1 text-[11px] font-medium ${ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
              {ok ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ── Password input with eye toggle ────────────────────────────────────────────
const PasswordInput = ({ label, value, onChange, error, placeholder, autoFocus, id }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
        {label}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Lock className="h-4 w-4" />
        </div>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full pl-11 pr-10 py-2.5 rounded-card border text-sm transition-all duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20'
              : 'border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-950/45'
            }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
};

// ── Main dialog ───────────────────────────────────────────────────────────────
const ChangePasswordDialog = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({ current: '', newPw: '', confirm: '' });
      setErrors({});
    }
  }, [isOpen]);

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.current) e.current = 'Current password is required';
    if (!form.newPw) {
      e.newPw = 'New password is required';
    } else if (!RULES.every((r) => r.test(form.newPw))) {
      e.newPw = 'Password does not meet the requirements above';
    }
    if (form.newPw !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
      onClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to change password.';
      if (msg.toLowerCase().includes('current')) {
        setErrors((prev) => ({ ...prev, current: msg }));
      } else {
        toast.error(msg);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      current_password: form.current,
      new_password: form.newPw,
      confirm_new_password: form.confirm,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="change-pw-title"
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card shadow-soft-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-accent-50 dark:bg-accent-950/30 text-accent-500 dark:text-accent-400 rounded-lg">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <h2 id="change-pw-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Change Password
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <PasswordInput
                  id="current-pw"
                  label="Current Password"
                  value={form.current}
                  onChange={setField('current')}
                  placeholder="Your current password"
                  autoFocus
                  error={errors.current}
                />

                <div className="space-y-2">
                  <PasswordInput
                    id="new-pw"
                    label="New Password"
                    value={form.newPw}
                    onChange={setField('newPw')}
                    placeholder="New password"
                    error={errors.newPw}
                  />
                  <StrengthIndicator password={form.newPw} />
                </div>

                <PasswordInput
                  id="confirm-pw"
                  label="Confirm New Password"
                  value={form.confirm}
                  onChange={setField('confirm')}
                  placeholder="Repeat new password"
                  error={errors.confirm}
                />

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent" size="sm" icon={Lock} loading={mutation.isPending}>
                    Update Password
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordDialog;
