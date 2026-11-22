/**
 * Theme Service
 * Theme mode management (light, dark, system).
 */

const THEME_STORAGE_KEY = 'theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeService = {
  getTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return stored || 'system';
  },

  setTheme(theme: ThemeMode): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
  },

  applyTheme(theme: ThemeMode): void {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },
};

export default ThemeService;
