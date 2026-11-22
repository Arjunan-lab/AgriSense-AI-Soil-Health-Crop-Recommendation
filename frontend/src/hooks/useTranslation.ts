/**
 * useTranslation.ts
 * -----------------
 * Custom hook to consume the TranslationContext across components.
 */

import { useContext } from 'react';
import { TranslationContext } from '../contexts/TranslationContext';

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
