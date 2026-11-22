import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, Search, RefreshCw, AlertCircle, Thermometer, Droplets, CloudRain, Wind, Gauge, Sun, Cloud, CloudLightning } from 'lucide-react';
import { fetchWeatherByCoords, fetchWeatherByCity, detectUserLocation, WeatherInfo } from '../../services/weather';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

interface WeatherWidgetProps {
  onWeatherUpdate: (weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    weatherCondition: string;
    locationName: string;
    latitude?: number;
    longitude?: number;
    city?: string;
    state?: string;
    country?: string;
  }) => void;
  disabled?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ onWeatherUpdate, disabled }) => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cityInput, setCityInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const notifyParent = (info: WeatherInfo) => {
    onWeatherUpdate({
      temperature: info.temperature,
      humidity: info.humidity,
      rainfall: info.rainfall,
      windSpeed: info.windSpeed,
      pressure: info.pressure,
      weatherCondition: info.weatherCondition,
      locationName: info.locationName,
      latitude: info.latitude,
      longitude: info.longitude,
      city: info.city,
      state: info.state,
      country: info.country,
    });
  };

  const loadAutoWeather = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const { lat, lon } = await detectUserLocation();
      const info = await fetchWeatherByCoords(lat, lon, forceRefresh);
      setWeather(info);
      notifyParent(info);
      toast.success(`${t('Live weather loaded')}: ${info.locationName}`);
    } catch (err: any) {
      console.warn('GPS permission denied or timeout:', err);
      setError(t('Location permission denied. Search your city manually below.'));
      toast.error(t('Location permission denied. Enter your city below.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAutoWeather(false);
  }, []);

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault(); // CRITICAL: Stop page reload!
    if (!cityInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const info = await fetchWeatherByCity(cityInput.trim());
      setWeather(info);
      notifyParent(info);
      toast.success(`${t('Weather updated for')} ${info.locationName}`);
      setCityInput('');
    } catch (err: any) {
      const msg = err.message || t('Unable to fetch weather. Please try another city.');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop form submit or reload
    loadAutoWeather(true);
  };

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return <CloudRain className="h-4 w-4 text-cyan-500" />;
    if (c.includes('thunder') || c.includes('hail')) return <CloudLightning className="h-4 w-4 text-purple-500" />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="h-4 w-4 text-slate-400" />;
    return <Sun className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-950/40 dark:via-teal-950/25 dark:to-cyan-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-card p-4 space-y-4 shadow-soft">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
            <CloudSun className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                {weather?.locationName || t('Detecting Location...')}
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {weather ? `${t('Updated at')} ${new Date(weather.timestamp).toLocaleTimeString()}` : t('Requesting browser GPS...')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={loading || disabled}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 rounded-lg transition-colors cursor-pointer"
          title="Re-fetch live GPS weather"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span className="hidden sm:inline">{t('Refresh GPS')}</span>
        </button>
      </div>

      {/* Weather Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-emerald-100/40 dark:bg-emerald-900/30 rounded-lg" />
          ))}
        </div>
      ) : weather ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Temp */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800 rounded-lg p-2 flex items-center space-x-2">
            <div className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md">
              <Thermometer className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">{t('Temperature')}</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {weather.temperature}°C
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800 rounded-lg p-2 flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">{t('Humidity')}</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {weather.humidity}%
              </p>
            </div>
          </div>

          {/* Rainfall */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800 rounded-lg p-2 flex items-center space-x-2">
            <div className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-md">
              <CloudRain className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">{t('Rainfall')}</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {weather.rainfall} mm
              </p>
            </div>
          </div>

          {/* Wind */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800 rounded-lg p-2 flex items-center space-x-2">
            <div className="p-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-md">
              <Wind className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">{t('Wind')}</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {weather.windSpeed} km/h
              </p>
            </div>
          </div>

          {/* Pressure / Condition */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/60 dark:border-slate-800 rounded-lg p-2 flex items-center space-x-2 col-span-2 sm:col-span-1">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
              {getWeatherIcon(weather.weatherCondition)}
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">{t('Pressure')}</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate max-w-[80px]">
                {t(weather.weatherCondition)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Manual City Search Form */}
      <form onSubmit={handleCitySearch} className="flex items-center space-x-2 pt-1">
        <div className="relative flex-1">
          <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder={t('Change city...')}
            disabled={loading || disabled}
            className="w-full pl-8 pr-3 py-2 text-xs bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-750 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !cityInput.trim() || disabled}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center space-x-1 cursor-pointer transition-colors shrink-0"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{t('Fetch')}</span>
        </button>
      </form>

      {error && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center space-x-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default WeatherWidget;
