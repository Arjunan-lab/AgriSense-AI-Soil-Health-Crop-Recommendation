/**
 * Language Service
 * Preferred application language management.
 */

import { TokenService } from './token.service';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languages';

export const LanguageService = {
  getPreferredLanguage(): string {
    return TokenService.getPreferredLanguage() || DEFAULT_LANGUAGE;
  },

  setPreferredLanguage(langCode: string): void {
    TokenService.setPreferredLanguage(langCode);
  },

  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  },
};

export default LanguageService;
