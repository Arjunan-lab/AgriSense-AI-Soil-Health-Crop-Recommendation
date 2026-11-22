import React from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete this analysis?"
      message="This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      loading={loading}
    />
  );
};

export default DeleteDialog;
