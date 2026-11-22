/**
 * components/Settings/DangerZone.jsx
 * ------------------------------------
 * Privacy section: Download Data + Delete Account.
 * Delete Account requires the user to type "DELETE MY ACCOUNT" in a
 * confirmation dialog before the API call is made.
 *
 * Props:
 *   onAccountDeleted {function} - called after successful deletion (AuthContext.logout + navigate)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import { exportData, deleteAccount } from '../../api/profile';

const CONFIRM_PHRASE = 'DELETE MY ACCOUNT';

// ── Download Data ─────────────────────────────────────────────────────────────
const DownloadDataButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soilsense-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch {
      toast.error('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-between space-x-4 py-4 border-b border-slate-100 dark:border-slate-800/60">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Download My Data</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Export all your analysis history as a JSON file.
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={handleDownload}
        disabled={loading}
        aria-label="Download my data"
        className="flex items-center space-x-2 px-3.5 py-2 rounded-card border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        <span>{loading ? 'Exporting…' : 'Export JSON'}</span>
      </motion.button>
    </div>
  );
};

// ── Delete Confirmation Dialog ────────────────────────────────────────────────
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirmed, isDeleting }) => {
  const [phrase, setPhrase] = useState('');
  const canDelete = phrase.trim() === CONFIRM_PHRASE;

  const handleClose = () => {
    setPhrase('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950/40 rounded-card shadow-soft-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-red-100 dark:border-red-950/20 bg-red-50/50 dark:bg-red-950/10">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-red-100 dark:bg-red-950/30 text-red-500 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <h2 id="delete-dialog-title" className="text-base font-bold text-red-700 dark:text-red-400">
                    Delete Account
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-400 font-semibold mb-1">
                    ⚠️ This action is irreversible
                  </p>
                  <p className="text-xs text-red-600/80 dark:text-red-400/70 leading-relaxed">
                    Deleting your account will permanently remove your profile, all analysis history, and all associated data. This cannot be undone.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirm-phrase"
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    Type{' '}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 rounded text-[11px] font-mono">
                      {CONFIRM_PHRASE}
                    </code>{' '}
                    to confirm:
                  </label>
                  <input
                    id="confirm-phrase"
                    type="text"
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder={CONFIRM_PHRASE}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-card border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <Button type="button" variant="outline" size="sm" onClick={handleClose} disabled={isDeleting}>
                    Cancel
                  </Button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={onConfirmed}
                    disabled={!canDelete || isDeleting}
                    className="flex items-center space-x-2 px-4 py-2 rounded-card bg-red-500 hover:bg-red-600 text-white text-sm font-semibold border border-transparent shadow-soft transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span>{isDeleting ? 'Deleting…' : 'Delete My Account'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Main DangerZone component ─────────────────────────────────────────────────
const DangerZone = ({ onAccountDeleted }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteAccount({ confirm_phrase: CONFIRM_PHRASE }),
    onSuccess: () => {
      toast.success('Account deleted. Goodbye!');
      setShowDeleteDialog(false);
      onAccountDeleted?.();
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to delete account.';
      toast.error(msg);
    },
  });

  return (
    <>
      <DownloadDataButton />

      <div className="flex items-start justify-between space-x-4 py-4">
        <div>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">Delete Account</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Permanently delete your account and all data. This cannot be undone.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          aria-label="Delete account"
          className="flex items-center space-x-2 px-3.5 py-2 rounded-card border border-red-300 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Account</span>
        </motion.button>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirmed={() => deleteMutation.mutate()}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};

export default DangerZone;
