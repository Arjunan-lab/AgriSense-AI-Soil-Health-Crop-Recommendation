import { useState, useEffect, useCallback } from 'react';
import {
  weatherService,
  WeatherLocationQuery,
  GPSLocation,
} from '../services/weatherService';
import {
  WeatherDataResponse,
  HourlyForecastResponse,
  SevenDayForecastResponse,
} from '../api/weather';

export function useCurrentWeather(query: WeatherLocationQuery) {
  const [data, setData] = useState<WeatherDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await weatherService.fetchCurrentWeather(query);
      setData(res);
    } catch (err: any) {
      console.error('Failed to fetch current weather:', err);
      setError('Unable to fetch weather. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [query.lat, query.lon, query.city]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useHourlyWeather(query: WeatherLocationQuery) {
  const [data, setData] = useState<HourlyForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await weatherService.fetchHourlyForecast(query);
      setData(res);
    } catch (err: any) {
      console.error('Failed to fetch hourly weather:', err);
      setError('Unable to fetch hourly forecast.');
    } finally {
      setLoading(false);
    }
  }, [query.lat, query.lon, query.city]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useSevenDayForecast(query: WeatherLocationQuery) {
  const [data, setData] = useState<SevenDayForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await weatherService.fetchDailyForecast(query);
      setData(res);
    } catch (err: any) {
      console.error('Failed to fetch 7-day forecast:', err);
      setError('Unable to fetch 7-day forecast.');
    } finally {
      setLoading(false);
    }
  }, [query.lat, query.lon, query.city]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useGpsLocation() {
  const [gps, setGps] = useState<GPSLocation | null>(() =>
    weatherService.getStoredGpsLocation()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestGps = useCallback(async () => {
    // If already stored, return cached GPS without prompting again
    const stored = weatherService.getStoredGpsLocation();
    if (stored) {
      setGps(stored);
      return stored;
    }

    setLoading(true);
    setError(null);
    try {
      const location = await weatherService.requestGpsLocation();
      setGps(location);
      return location;
    } catch (err: any) {
      console.warn('GPS location request failed:', err);
      setError('Location access denied. Search by city instead.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { gps, loading, error, requestGps };
}
