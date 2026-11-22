/**
 * useFieldLabel.ts
 * -----------------
 * React hook for resolving localized field label text in the current user language.
 *
 * The backend always returns English JSON keys (e.g. "predicted_soil", "confidence").
 * This hook maps those keys to their localized display labels using the static
 * FIELD_LABELS lookup table — zero API calls, zero latency.
 *
 * Usage:
 *   const label = useFieldLabel("predicted_soil");
 *   // Returns "ਅਨੁਮਾਨਿਤ ਮਿੱਟੀ" for Punjabi, "অনুমানিত মাটি" for Bengali, etc.
 *
 *   // Batch lookup helper:
 *   const fl = useFieldLabels();
 *   <span>{fl("confidence")}</span>
 */

import { useLanguage } from '../context/LanguageContext';
import { getFieldLabel, FieldLabelKey } from '../i18n/fieldLabels';

/**
 * Returns the localized display label for a single API field key.
 * Automatically uses the current user's preferred language from LanguageContext.
 *
 * @param key - The canonical English JSON field key (e.g. "predicted_soil")
 * @returns The localized label string for the active language
 */
export function useFieldLabel(key: FieldLabelKey | string): string {
  const { currentLanguage } = useLanguage();
  return getFieldLabel(key, currentLanguage);
}

/**
 * Returns a translation function bound to the current user language.
 * Useful when you need to localize multiple fields without calling the hook repeatedly.
 *
 * @returns fl(key) — a function that maps a field key to its localized label
 *
 * Example:
 *   const fl = useFieldLabels();
 *   <th>{fl("predicted_soil")}</th>
 *   <th>{fl("confidence")}</th>
 */
export function useFieldLabels(): (key: string) => string {
  const { currentLanguage } = useLanguage();
  return (key: string) => getFieldLabel(key, currentLanguage);
}
