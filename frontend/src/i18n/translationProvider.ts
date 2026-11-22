/**
 * translationProvider.ts
 * -----------------------
 * Re-exports the central translation provider, hooks, and services.
 */

export { TranslationProvider, useTranslation, TranslationContext } from '../contexts/TranslationContext';
export { translationService, SUPPORTED_LANGUAGES } from '../services/translationService';
