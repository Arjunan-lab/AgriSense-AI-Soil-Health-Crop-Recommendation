/**
 * Centralized Application Environment Configuration
 * Dynamically reconciles Vercel multi-service routing and local development environments.
 */

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // In production browser on Vercel shared-domain deployment, route through /api rewrite
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:8000';
};

export const env = {
  apiBaseUrl: getApiBaseUrl(),
  socketUrl: import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? `wss://${window.location.host}/ws` : 'ws://localhost:8000/ws'),
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api/uploads' : 'http://localhost:8000/uploads'),
  weatherApiUrl: import.meta.env.VITE_WEATHER_API_URL || 'https://api.open-meteo.com/v1',
  geocodingApiUrl: import.meta.env.VITE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1',
  nominatimApiUrl: import.meta.env.VITE_NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org',
  googleMapKey: import.meta.env.VITE_GOOGLE_MAP_KEY || '',
};

export default env;
