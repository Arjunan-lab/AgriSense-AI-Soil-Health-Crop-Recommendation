import { apiClient } from './client';

export const translationsAPI = {
  getLanguages: async () => {
    const { data } = await apiClient.get('/api/languages');
    return data;
  },
  getTranslations: async (lang: string) => {
    const { data } = await apiClient.get('/api/translations', {
      params: { lang }
    });
    return data;
  },
  /** Admin-only: create a new translation key (triggers Sarvam AI for all languages) */
  createTranslationKey: async (
    token: string,
    payload: { key: string; english: string; category?: string; description?: string }
  ) => {
    const { data } = await apiClient.post('/api/admin/translation-key', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
