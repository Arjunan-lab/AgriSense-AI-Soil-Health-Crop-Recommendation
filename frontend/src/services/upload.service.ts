/**
 * Upload Service
 * Helper service for file & image uploads.
 */

import apiClient from '../api/client';

export const UploadService = {
  async uploadFile(file: File, endpoint: string = '/upload'): Promise<{ url: string; [key: string]: any }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadImage(imageFile: File, endpoint: string = '/chat/image'): Promise<{ url: string; [key: string]: any }> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default UploadService;
