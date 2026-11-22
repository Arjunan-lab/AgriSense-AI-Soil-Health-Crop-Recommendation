/**
 * Helper utility to decode JWT and check for expiration.
 */

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Current time in seconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
