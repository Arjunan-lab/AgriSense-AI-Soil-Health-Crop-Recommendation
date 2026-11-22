import { useState } from 'react';
import { UploadService } from '../services/upload.service';

export function useUpload() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, endpoint?: string) => {
    try {
      setUploading(true);
      setError(null);
      const res = await UploadService.uploadFile(file, endpoint);
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Upload failed.';
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file: File, endpoint?: string) => {
    try {
      setUploading(true);
      setError(null);
      const res = await UploadService.uploadImage(file, endpoint);
      return res;
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Image upload failed.';
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadFile,
    uploadImage,
  };
}

export default useUpload;
