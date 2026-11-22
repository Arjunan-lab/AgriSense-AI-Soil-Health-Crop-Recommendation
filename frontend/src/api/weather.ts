import { apiClient } from './client';

export interface WeatherDataResponse {
  latitude?: number;
  longitude?: number;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  location_name?: string;
  temperature: number;
  feels_like?: number;
  humidity: number;
  rainfall: number;
  wind_speed?: number;
  pressure?: number;
  cloud_cover?: number;
  dew_point?: number;
  sunrise?: string;
  sunset?: string;
  is_day?: number;
  weather_condition?: string;
  weather_icon?: string;
  fetched_at?: string;
}

export interface HourlyItem {
  time: string;
  temperature: number;
  humidity: number;
  rain_probability: number;
  wind_speed: number;
  weather_condition: string;
  weather_icon: string;
}

export interface HourlyForecastResponse {
  city?: string;
  location_name?: string;
  hourly: HourlyItem[];
}

export interface ForecastDayItem {
  day: string;
  date: string;
  temp_min: number;
  temp_max: number;
  rain: string;
  humidity: number;
  wind: number;
  condition: string;
  weather_icon: string;
  sunrise?: string;
  sunset?: string;
  uv_index?: number;
  desc?: string;
}

export interface SevenDayForecastResponse {
  city?: string;
  location_name?: string;
  forecast: ForecastDayItem[];
}

export const weatherAPI = {
  getCurrent: async (lat: number, lon: number): Promise<WeatherDataResponse> => {
    const { data } = await apiClient.get('/weather/current', {
      params: { lat, lon },
    });
    return data;
  },

  searchCity: async (city: string): Promise<WeatherDataResponse> => {
    const { data } = await apiClient.get('/weather/search', {
      params: { city },
    });
    return data;
  },

  getHourlyForecast: async (params: { lat?: number; lon?: number; city?: string }): Promise<HourlyForecastResponse> => {
    const { data } = await apiClient.get('/weather/hourly', {
      params,
    });
    return data;
  },

  getDailyForecast: async (params: { lat?: number; lon?: number; city?: string }): Promise<SevenDayForecastResponse> => {
    const { data } = await apiClient.get('/weather/forecast', {
      params,
    });
    return data;
  },

  storeWeather: async (weatherData: any) => {
    const { data } = await apiClient.post('/weather/store', weatherData);
    return data;
  },
};
