import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { HelpCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" closeOnOverlayClick={!loading}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' : 'bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400'}`}>
          <HelpCircle className="h-8 w-8" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>
        <div className="flex items-center space-x-3 w-full pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            className="w-full"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
