import { env } from '../config/env';

/**
 * formatDisplayName — Proper title-case formatting for user display names.
 *
 * Rules:
 *  - Capitalize first letter of each word
 *  - Collapse multiple spaces
 *  - Handle hyphens (Mary-Jane)
 *  - Handle apostrophes (O'Connor)
 *  - Normalize mixed case (TaNiShA → Tanisha)
 *  - Never modify stored/database value — display only
 */
export function formatDisplayName(raw: string | null | undefined): string {
  if (!raw || !raw.trim()) return '';

  return raw
    .trim()
    .replace(/\s+/g, ' ')           // collapse multiple spaces
    .split(' ')
    .map(word =>
      word
        .split('-')
        .map(part =>
          part
            .split("'")
            .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())
            .join("'")
        )
        .join('-')
      )
    .join(' ');
}

/**
 * getInitials — Generate avatar initials from a display name.
 *
 * Rules:
 *  - Single name → first letter (e.g. "Tanisha" → "T")
 *  - Two names → first letter of each (e.g. "Tanisha Sharma" → "TS")
 *  - Three+ names → first and last initials (e.g. "Mary Jane Watson" → "MW")
 */
export function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return 'U';

  const parts = name.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);

  if (parts.length === 1) return parts[0][0].toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();

  // 3+ names: first + last
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * getProfilePictureUrl — Resolve backend profile picture path to absolute URL.
 */
export function getProfilePictureUrl(path?: string | null): string | undefined {
  if (!path || typeof path !== 'string' || !path.trim()) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const baseUrl = env.apiBaseUrl;
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
