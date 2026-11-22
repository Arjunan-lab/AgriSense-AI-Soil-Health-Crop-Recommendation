/**
 * Token Service
 * Centralized JWT token management for localStorage.
 */

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const LEGACY_TOKEN_KEY = 'token';
const PREFERRED_LANG_KEY = 'preferred_language';

export const TokenService = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens(accessToken: string, refreshToken?: string): void {
    this.setAccessToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  },

  getPreferredLanguage(): string | null {
    return localStorage.getItem(PREFERRED_LANG_KEY);
  },

  setPreferredLanguage(lang: string): void {
    localStorage.setItem(PREFERRED_LANG_KEY, lang);
  },
};

export default TokenService;
