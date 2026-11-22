import api from './api';
import { env } from '../config/env';

export interface WeatherInfo {
  latitude?: number;
  longitude?: number;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  locationName: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  weatherCondition: string;
  source: 'geolocation' | 'city' | 'cached';
  timestamp: number;
}

const CACHE_KEY = 'scatter_ai_weather_cache';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache

export const detectUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};

export const fetchWeatherByCoords = async (lat: number, lon: number, ignoreCache: boolean = false): Promise<WeatherInfo> => {
  if (!ignoreCache) {
    const cached = getCachedWeather();
    if (cached && cached.latitude && Math.abs(cached.latitude - lat) < 0.05 && Math.abs((cached.longitude || 0) - lon) < 0.05) {
      return cached;
    }
  }

  try {
    const res = await api.get('/weather/current', { params: { lat, lon } });
    const data = res.data;

    const locName = data.location_name || (data.city ? `${data.city}${data.state ? ', ' + data.state : ''}` : `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);

    const info: WeatherInfo = {
      latitude: lat,
      longitude: lon,
      city: data.city,
      district: data.district,
      state: data.state,
      country: data.country,
      locationName: locName,
      temperature: data.temperature,
      humidity: data.humidity,
      rainfall: data.rainfall,
      windSpeed: data.wind_speed || 0,
      pressure: data.pressure || 1013.25,
      weatherCondition: data.weather_condition || 'Clear',
      source: 'geolocation',
      timestamp: Date.now(),
    };

    setCachedWeather(info);
    return info;
  } catch (error) {
    console.warn('Backend /weather/current failed, calling configured weather API directly...');
    const weatherUrl = `${env.weatherApiUrl}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,precipitation,surface_pressure,wind_speed_10m,weather_code`;
    const res = await fetch(weatherUrl);
    const data = await res.json();
    const current = data.current || {};

    const info: WeatherInfo = {
      latitude: lat,
      longitude: lon,
      locationName: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
      temperature: Math.round((current.temperature_2m || 25.0) * 10) / 10,
      humidity: Math.round((current.relative_humidity_2m || 60.0) * 10) / 10,
      rainfall: Math.round((current.rain || current.precipitation || 0.0) * 10) / 10,
      windSpeed: Math.round((current.wind_speed_10m || 5.0) * 10) / 10,
      pressure: Math.round((current.surface_pressure || 1013.25) * 10) / 10,
      weatherCondition: 'Clear',
      source: 'geolocation',
      timestamp: Date.now(),
    };

    setCachedWeather(info);
    return info;
  }
};

export const fetchWeatherByCity = async (cityName: string): Promise<WeatherInfo> => {
  const cleanCity = cityName.trim();
  if (!cleanCity) {
    throw new Error('Please enter a city name.');
  }

  try {
    const res = await api.get('/weather/search', { params: { city: cleanCity } });
    const data = res.data;

    const locName = data.location_name || (data.city ? `${data.city}${data.state ? ', ' + data.state : ''}` : cleanCity);

    const info: WeatherInfo = {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city || cleanCity,
      district: data.district,
      state: data.state,
      country: data.country,
      locationName: locName,
      temperature: data.temperature,
      humidity: data.humidity,
      rainfall: data.rainfall,
      windSpeed: data.wind_speed || 0,
      pressure: data.pressure || 1013.25,
      weatherCondition: data.weather_condition || 'Clear',
      source: 'city',
      timestamp: Date.now(),
    };

    setCachedWeather(info);
    return info;
  } catch (error: any) {
    console.warn('Backend city search failed, calling configured geocoding API directly...');
    const geoUrl = `${env.geocodingApiUrl}/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      throw new Error(`City "${cleanCity}" not found.`);
    }

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${cleanCity}" not found. Try another city.`);
    }

    const { latitude, longitude, name, country, admin1 } = geoData.results[0];
    const locName = `${name}${admin1 ? ', ' + admin1 : ''}${country ? ', ' + country : ''}`;

    return fetchWeatherByCoords(latitude, longitude, true).then((w) => ({
      ...w,
      city: name,
      state: admin1,
      country: country,
      locationName: locName,
      source: 'city',
    }));
  }
};

const getCachedWeather = (): WeatherInfo | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: WeatherInfo = JSON.parse(raw);
    if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return { ...cached, source: 'cached' };
    }
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (e) {
    return null;
  }
};

const setCachedWeather = (info: WeatherInfo) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(info));
  } catch (e) {
    console.warn('Failed to cache weather in localStorage');
  }
};
