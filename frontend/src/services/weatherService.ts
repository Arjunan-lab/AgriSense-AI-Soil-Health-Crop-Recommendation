import { weatherAPI, WeatherDataResponse, HourlyForecastResponse, SevenDayForecastResponse } from '../api/weather';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface GPSLocation {
  lat: number;
  lon: number;
  label?: string;
  fetchedAt: number;
}

export interface WeatherLocationQuery {
  lat?: number;
  lon?: number;
  city?: string;
}

// In-memory caches
const currentCache: Map<string, { data: WeatherDataResponse; timestamp: number }> = new Map();
const hourlyCache: Map<string, { data: HourlyForecastResponse; timestamp: number }> = new Map();
const forecastCache: Map<string, { data: SevenDayForecastResponse; timestamp: number }> = new Map();

function buildCacheKey(query: WeatherLocationQuery): string {
  if (query.city) return `city:${query.city.trim().toLowerCase()}`;
  if (query.lat !== undefined && query.lon !== undefined) {
    return `coords:${query.lat.toFixed(2)},${query.lon.toFixed(2)}`;
  }
  return 'default';
}

export const weatherService = {
  /**
   * Returns globally saved GPS location from localStorage if available.
   */
  getStoredGpsLocation(): GPSLocation | null {
    try {
      const stored = localStorage.getItem('agri_user_gps');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore JSON parse errors
    }
    return null;
  },

  /**
   * Prompts the browser for GPS geolocation ONCE, saves coordinates globally to localStorage.
   */
  async requestGpsLocation(): Promise<GPSLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: GPSLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            fetchedAt: Date.now(),
          };
          localStorage.setItem('agri_user_gps', JSON.stringify(loc));
          resolve(loc);
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },

  /**
   * Fetch current weather by GPS or city with 5-minute caching.
   */
  async fetchCurrentWeather(query: WeatherLocationQuery): Promise<WeatherDataResponse> {
    const cacheKey = buildCacheKey(query);
    const cached = currentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    let data: WeatherDataResponse;
    if (query.city) {
      data = await weatherAPI.searchCity(query.city);
    } else if (query.lat !== undefined && query.lon !== undefined) {
      data = await weatherAPI.getCurrent(query.lat, query.lon);
    } else {
      // Check stored GPS location fallback
      const gps = this.getStoredGpsLocation();
      if (gps) {
        data = await weatherAPI.getCurrent(gps.lat, gps.lon);
      } else {
        // Default Punjab coordinates fallback
        data = await weatherAPI.getCurrent(30.6845, 76.6175);
      }
    }

    currentCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  },

  /**
   * Fetch today's hourly weather forecast with 5-minute caching.
   */
  async fetchHourlyForecast(query: WeatherLocationQuery): Promise<HourlyForecastResponse> {
    const cacheKey = buildCacheKey(query);
    const cached = hourlyCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    let data: HourlyForecastResponse;
    if (query.city || (query.lat !== undefined && query.lon !== undefined)) {
      data = await weatherAPI.getHourlyForecast(query);
    } else {
      const gps = this.getStoredGpsLocation();
      if (gps) {
        data = await weatherAPI.getHourlyForecast({ lat: gps.lat, lon: gps.lon });
      } else {
        data = await weatherAPI.getHourlyForecast({ lat: 30.6845, lon: 76.6175 });
      }
    }

    hourlyCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  },

  /**
   * Fetch 7-day weather forecast with 5-minute caching.
   */
  async fetchDailyForecast(query: WeatherLocationQuery): Promise<SevenDayForecastResponse> {
    const cacheKey = buildCacheKey(query);
    const cached = forecastCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    let data: SevenDayForecastResponse;
    if (query.city || (query.lat !== undefined && query.lon !== undefined)) {
      data = await weatherAPI.getDailyForecast(query);
    } else {
      const gps = this.getStoredGpsLocation();
      if (gps) {
        data = await weatherAPI.getDailyForecast({ lat: gps.lat, lon: gps.lon });
      } else {
        data = await weatherAPI.getDailyForecast({ lat: 30.6845, lon: 76.6175 });
      }
    }

    forecastCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  },
};
