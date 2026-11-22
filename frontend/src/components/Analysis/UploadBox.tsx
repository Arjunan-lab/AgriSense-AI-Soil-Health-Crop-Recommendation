import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Trash2, ShieldAlert } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface UploadBoxProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  selectedFile,
  onFileChange,
  disabled = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ['jpg', 'jpeg', 'png'].includes(extension || '');
    
    if (!validTypes.includes(file.type) && !isValidExtension) {
      const msg = 'Unsupported file format. Only JPG, JPEG, and PNG are allowed.';
      setError(msg);
      toast.error(msg);
      return false;
    }

    // Check size: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const msg = 'File exceeds maximum size of 10 MB.';
      setError(msg);
      toast.error(msg);
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileChange(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileChange(file);
      }
    }
  };

  const onButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onFileChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        onChange={handleChange}
        disabled={disabled}
      />

      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
        Soil Image <span className="text-red-500">*</span>
      </label>

      {selectedFile && previewUrl ? (
        // Preview State
        <div className="relative group overflow-hidden border border-slate-200/80 dark:border-slate-800 rounded-card bg-slate-50/50 dark:bg-slate-900/50 p-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center space-x-4 min-w-0">
            {/* Image Preview Thumbnail */}
            <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Soil Preview"
                className="h-full w-full object-cover"
              />
            </div>
            {/* File info */}
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[300px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onButtonClick}
              disabled={disabled}
              className="text-xs font-bold px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors disabled:opacity-50"
            >
              Change
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </motion.button>
          </div>
        </div>
      ) : (
        // Upload Box State
        <motion.div
          whileHover={disabled ? {} : { scale: 1.01 }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`
            border-2 border-dashed rounded-card p-6 text-center cursor-pointer flex flex-col items-center justify-center space-y-3 transition-colors duration-200 min-h-[160px]
            ${isDragActive
              ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10'
              : error
                ? 'border-rose-300 bg-rose-50/10 dark:bg-rose-950/5'
                : 'border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-800 bg-white dark:bg-slate-900'}
            ${disabled ? 'opacity-50 cursor-not-allowed font-medium' : ''}
          `}
        >
          <div className={`p-3 rounded-full ${error ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20' : 'bg-primary-50 text-primary-500 dark:bg-primary-950/20'}`}>
            {error ? <ShieldAlert className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Drag & Drop soil image here, or <span className="text-primary-500 hover:text-primary-600 font-extrabold">browse</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Supports JPG, JPEG, PNG (max 10 MB)
            </p>
          </div>
          {error && (
            <p className="text-xs font-semibold text-rose-500 mt-1">
              {error}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default UploadBox;
