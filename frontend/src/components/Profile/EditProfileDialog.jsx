/**
 * components/Profile/EditProfileDialog.jsx
 * ------------------------------------------
 * Modal dialog for editing username and preferred language.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Globe, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import { updateProfile } from '../../api/profile';
import { useAuth } from '../../context/AuthContext';
import { fetchSupportedLanguages, FALLBACK_LANGUAGES } from '../../services/languages';

const EditProfileDialog = ({ isOpen, onClose, profile, onSaved }) => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('English');
  const [errors, setErrors] = useState({});
  const [languagesList, setLanguagesList] = useState(FALLBACK_LANGUAGES);

  useEffect(() => {
    fetchSupportedLanguages().then((list) => {
      if (list && list.length > 0) {
        setLanguagesList(list);
      }
    });
  }, []);

  // Pre-fill when dialog opens
  useEffect(() => {
    if (isOpen && profile) {
      setUsername(profile.username || '');
      setLanguage(profile.preferred_language || 'English');
      setErrors({});
    }
  }, [isOpen, profile]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!username.trim()) {
      e.username = 'Name is required';
    } else if (username.trim().length < 3) {
      e.username = 'Name must be at least 3 characters';
    } else if (username.trim().length > 50) {
      e.username = 'Name must be 50 characters or less';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Mutation ──────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await refreshUser(); // keep Navbar avatar/name in sync
      toast.success('Profile updated successfully!');
      onSaved?.();
      onClose();
    },
    onError: (err) => {
      const message =
        err?.response?.data?.detail || 'Failed to update profile. Please try again.';
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ username: username.trim(), preferred_language: language });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-profile-title"
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card shadow-soft-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-primary-50 dark:bg-primary-950/30 text-primary-500 dark:text-primary-400 rounded-lg">
                    <User className="h-4 w-4" />
                  </div>
                  <h2 id="edit-profile-title" className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Edit Profile
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                {/* Username */}
                <Input
                  label="Full Name"
                  icon={User}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  placeholder="Your display name"
                  error={errors.username}
                  required
                  autoFocus
                  maxLength={50}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                />

                {/* Language */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Preferred Language</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-card border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/45 transition-all duration-200 outline-none"
                    aria-label="Preferred language"
                  >
                    {languagesList.map((lang) => (
                      <option key={lang.code} value={lang.name}>
                        {lang.name} ({lang.native})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={Save}
                    loading={mutation.isPending}
                  >
                    Save Changes
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

export default EditProfileDialog;
