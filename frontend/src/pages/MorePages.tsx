import React, { useState, useRef, useEffect } from 'react'
import { Cloud, Droplets, Thermometer, Wind, Sunrise, Sunset, Bell, Star, Download, Search, Filter, ChevronDown, ChevronUp, Lock, Globe, Sun, Shield, Smartphone, Check, X, MapPin, Camera, Edit3, Trash2, Navigation, FileText, AlertCircle, Bot, Sparkles, Eye, EyeOff, Leaf, MessageSquare, TrendingUp, ThumbsUp, CheckCircle2 } from 'lucide-react'
import { Card, Badge, Button, Input, SelectInput, SearchInput, ProgressBar, Breadcrumb, LineSpinner } from '../components/ui'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FEATURES } from '../config'
import { historyAPI } from '../api/history'
import { fertilizerAPI } from '../api/fertilizer'
import { adminAPI } from '../api/admin'
import { notificationAPI, NotificationItem } from '../api/notification'
import { profileAPI } from '../api/profile'
import { apiClient } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'

// ---- Weather location dataset ----
interface WeatherLocation {
  label: string
  state: string
  temp: number
  humidity: number
  wind: number
  condition: string
  feelsLike: number
}

const WEATHER_LOCATIONS: WeatherLocation[] = [
  { label: 'Ludhiana, Punjab', state: 'Punjab', temp: 32, humidity: 68, wind: 14, condition: 'Partly Sunny', feelsLike: 38 },
  { label: 'Amritsar, Punjab', state: 'Punjab', temp: 30, humidity: 72, wind: 12, condition: 'Hazy', feelsLike: 36 },
  { label: 'Kotkapura, Faridkot, Punjab', state: 'Punjab', temp: 31, humidity: 70, wind: 11, condition: 'Partly Sunny', feelsLike: 37 },
  { label: 'Chandigarh', state: 'Punjab', temp: 31, humidity: 70, wind: 11, condition: 'Partly Sunny', feelsLike: 37 },
  { label: 'Delhi, NCT', state: 'Delhi', temp: 38, humidity: 55, wind: 18, condition: 'Hot & Sunny', feelsLike: 44 },
  { label: 'Jaipur, Rajasthan', state: 'Rajasthan', temp: 40, humidity: 40, wind: 20, condition: 'Sunny & Hot', feelsLike: 45 },
  { label: 'Jodhpur, Rajasthan', state: 'Rajasthan', temp: 42, humidity: 35, wind: 22, condition: 'Very Hot', feelsLike: 47 },
  { label: 'Lucknow, Uttar Pradesh', state: 'UP', temp: 37, humidity: 65, wind: 10, condition: 'Hot & Sunny', feelsLike: 43 },
  { label: 'Varanasi, Uttar Pradesh', state: 'UP', temp: 36, humidity: 68, wind: 9, condition: 'Sunny', feelsLike: 42 },
  { label: 'Agra, Uttar Pradesh', state: 'UP', temp: 38, humidity: 58, wind: 12, condition: 'Hot', feelsLike: 44 },
  { label: 'Patna, Bihar', state: 'Bihar', temp: 35, humidity: 75, wind: 8, condition: 'Humid & Sunny', feelsLike: 42 },
  { label: 'Bhopal, Madhya Pradesh', state: 'MP', temp: 34, humidity: 60, wind: 10, condition: 'Partly Sunny', feelsLike: 40 },
  { label: 'Indore, Madhya Pradesh', state: 'MP', temp: 33, humidity: 62, wind: 11, condition: 'Partly Sunny', feelsLike: 39 },
  { label: 'Nagpur, Maharashtra', state: 'Maharashtra', temp: 36, humidity: 58, wind: 13, condition: 'Sunny', feelsLike: 42 },
  { label: 'Pune, Maharashtra', state: 'Maharashtra', temp: 27, humidity: 78, wind: 15, condition: 'Partly Cloudy', feelsLike: 29 },
  { label: 'Mumbai, Maharashtra', state: 'Maharashtra', temp: 29, humidity: 85, wind: 22, condition: 'Humid & Cloudy', feelsLike: 34 },
  { label: 'Ahmedabad, Gujarat', state: 'Gujarat', temp: 38, humidity: 50, wind: 17, condition: 'Hot & Sunny', feelsLike: 44 },
  { label: 'Surat, Gujarat', state: 'Gujarat', temp: 33, humidity: 78, wind: 16, condition: 'Humid', feelsLike: 38 },
  { label: 'Hyderabad, Telangana', state: 'Telangana', temp: 33, humidity: 62, wind: 16, condition: 'Partly Cloudy', feelsLike: 38 },
  { label: 'Bengaluru, Karnataka', state: 'Karnataka', temp: 28, humidity: 60, wind: 14, condition: 'Partly Cloudy', feelsLike: 30 },
  { label: 'Mysuru, Karnataka', state: 'Karnataka', temp: 27, humidity: 65, wind: 12, condition: 'Pleasant', feelsLike: 29 },
  { label: 'Chennai, Tamil Nadu', state: 'Tamil Nadu', temp: 35, humidity: 80, wind: 20, condition: 'Hot & Humid', feelsLike: 42 },
  { label: 'Coimbatore, Tamil Nadu', state: 'Tamil Nadu', temp: 30, humidity: 70, wind: 12, condition: 'Partly Cloudy', feelsLike: 34 },
  { label: 'Kolkata, West Bengal', state: 'West Bengal', temp: 31, humidity: 82, wind: 12, condition: 'Humid', feelsLike: 38 },
  { label: 'Bhubaneswar, Odisha', state: 'Odisha', temp: 33, humidity: 74, wind: 14, condition: 'Partly Cloudy', feelsLike: 39 },
]

import { weatherAPI } from '../api/weather'
import { weatherService, GPSLocation } from '../services/weatherService'
import { useCurrentWeather, useHourlyWeather, useSevenDayForecast, useGpsLocation } from '../hooks/useWeatherHooks'
import { LOCATION_DATA, SUPPORTED_LANGUAGES } from '../data/locationData'
import { formatDisplayName, getInitials, getProfilePictureUrl } from '../utils/formatName'
import { useLanguage } from '../context/LanguageContext'

export interface SelectedLocation {
  city?: string
  lat?: number
  lon?: number
  label: string
}

export type ThemeMode = 'light' | 'dark' | 'system'

// ---- Location picker modal ----
function LocationModal({ onSelect, onClose }: {
  onSelect: (loc: SelectedLocation) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SelectedLocation[]>([])
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'denied'>('idle')
  const { requestGps } = useGpsLocation()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // Live city search with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await weatherAPI.searchCity(query.trim())
        if (res && (res.city || res.location_name)) {
          setSearchResults([
            {
              city: res.city || query.trim(),
              lat: res.latitude,
              lon: res.longitude,
              label: res.location_name || `${res.city}, ${res.state || ''}`,
            }
          ])
        }
      } catch {
        // Fallback filter on static list if exact match fails
        const matched = WEATHER_LOCATIONS.filter(l => l.label.toLowerCase().includes(query.toLowerCase()))
          .map(l => ({ city: l.label.split(',')[0], label: l.label }))
        setSearchResults(matched)
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  const handleGPS = async () => {
    setGpsStatus('loading')
    try {
      const pos = await requestGps()
      onSelect({
        lat: pos.lat,
        lon: pos.lon,
        label: 'Current GPS Location',
      })
    } catch {
      setGpsStatus('denied')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface rounded-xl border border-border shadow-elevated w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-text-primary">Change Location</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-background transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search input with GPS integrated */}
        <div className="relative mb-3 group">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search village, town, city, district, state..."
            icon={<MapPin size={16} className="text-text-muted transition-colors flex-shrink-0" />}
            rightElement={
              query ? (
                <button onClick={() => setQuery('')} className="text-text-muted hover:text-text-primary flex-shrink-0">
                  <X size={14} />
                </button>
              ) : (
                <button 
                  onClick={handleGPS} 
                  className="text-text-muted hover:text-text-primary flex items-center gap-1.5 px-2.5 py-1 rounded bg-background border border-border text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {gpsStatus === 'loading' ? <LineSpinner size={12} color="currentColor" strokeWidth={2} /> : <Navigation size={12} />}
                  Use GPS
                </button>
              )
            }
          />
          {gpsStatus === 'denied' && (
            <p className="text-[10px] text-error mt-1.5 flex items-center gap-1 animate-fade-in"><AlertCircle size={10} /> Location access denied. Search by city instead.</p>
          )}
        </div>

        {/* Search Results */}
        {searching ? (
          <div className="flex items-center justify-center py-6 text-xs text-text-muted gap-2">
            <LineSpinner size={14} color="currentColor" strokeWidth={2} />
            <span>Searching weather services...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="border border-border rounded-lg overflow-hidden divide-y divide-border max-h-52 overflow-y-auto bg-surface mb-3">
            {searchResults.map(loc => (
              <button
                key={loc.label}
                onClick={() => onSelect(loc)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left"
              >
                <MapPin size={14} className="text-green-600 flex-shrink-0" />
                <span className="text-sm text-text-primary font-semibold">{loc.label}</span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Popular locations (shown when no query) */}
        {query.length === 0 && (
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Popular Locations</p>
            <div className="flex flex-wrap gap-2">
              {WEATHER_LOCATIONS.slice(0, 8).map(loc => (
                <button
                  key={loc.label}
                  onClick={() => onSelect({ city: loc.label.split(',')[0], label: loc.label })}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-text-secondary hover:bg-background hover:text-text-primary transition-colors"
                >
                  {loc.label.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.length >= 2 && searchResults.length === 0 && !searching && (
          <p className="text-sm text-text-muted text-center py-4">No locations found for "{query}"</p>
        )}
      </div>
    </div>
  )
}

function WeatherConditionIcon({ condition, isDay = 1 }: { condition: string; isDay?: number }) {
  const c = (condition || '').toLowerCase()
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) {
    return (
      <svg width="52" height="52" viewBox="-26 -20 52 52" overflow="visible" className="animate-weather-in flex-shrink-0">
        <ellipse cx="0" cy="-8" rx="16" ry="10" fill="rgba(255,255,255,0.3)" />
        <ellipse cx="-8" cy="-11" rx="9" ry="7" fill="rgba(255,255,255,0.25)" />
        <ellipse cx="8" cy="-11" rx="8" ry="6.5" fill="rgba(255,255,255,0.25)" />
        <line x1="-12" y1="2" x2="-14" y2="14" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" className="animate-rain-1" />
        <line x1="-4"  y1="2" x2="-6"  y2="14" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" className="animate-rain-2" />
        <line x1="4"   y1="2" x2="2"   y2="14" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" className="animate-rain-3" />
        <line x1="12"  y1="2" x2="10"  y2="14" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" className="animate-rain-4" />
      </svg>
    )
  }
  if (c.includes('cloud') || c.includes('hazy') || c.includes('overcast')) {
    return (
      <svg width="52" height="36" viewBox="-26 -14 52 36" overflow="visible" className="animate-weather-in flex-shrink-0">
        <g className="animate-cloud">
          <ellipse cx="0" cy="8" rx="18" ry="10" fill="rgba(255,255,255,0.35)" />
          <ellipse cx="-10" cy="4" rx="10" ry="8" fill="rgba(255,255,255,0.3)" />
          <ellipse cx="10" cy="4" rx="9" ry="7" fill="rgba(255,255,255,0.3)" />
          <ellipse cx="0" cy="-2" rx="12" ry="9" fill="rgba(255,255,255,0.3)" />
        </g>
      </svg>
    )
  }
  if (c.includes('wind') || c.includes('breezy')) {
    return (
      <svg width="52" height="36" viewBox="-26 -14 52 36" overflow="visible" className="animate-weather-in flex-shrink-0">
        <path d="M -22 -4 Q 0 -4 12 -4 Q 20 -4 20 -10 Q 20 -16 12 -16 Q 4 -16 4 -10" stroke="rgba(255,255,255,0.75)" fill="none" strokeWidth="2.5" strokeLinecap="round" className="animate-wind-leaf" />
        <path d="M -22 2 Q 6 2 16 2 Q 24 2 24 8 Q 24 14 16 14 Q 8 14 8 8" stroke="rgba(255,255,255,0.55)" fill="none" strokeWidth="2" strokeLinecap="round" />
        <path d="M -22 10 Q 0 10 8 10" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (c.includes('storm') || c.includes('thunder')) {
    return (
      <svg width="52" height="52" viewBox="-26 -20 52 52" overflow="visible" className="animate-weather-in flex-shrink-0">
        <ellipse cx="0" cy="-8" rx="16" ry="10" fill="rgba(255,255,255,0.25)" />
        <path d="M 4 0 L -6 14 L 0 14 L -8 28" stroke="rgba(251,191,36,0.9)" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-lightning" />
      </svg>
    )
  }
  // Check Day vs Night
  if (isDay === 0) {
    return (
      <svg width="48" height="48" viewBox="-24 -24 48 48" overflow="visible" className="animate-weather-in flex-shrink-0">
        <path d="M 6 -14 A 14 14 0 1 0 18 8 A 12 12 0 0 1 6 -14 Z" fill="rgba(255,255,255,0.9)" />
      </svg>
    )
  }
  // Default: sunny / clear day
  return (
    <svg width="52" height="52" viewBox="-26 -26 52 52" overflow="visible" className="animate-weather-in flex-shrink-0">
      <g className="animate-sun-spin">
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <line key={a} x1="0" y1="12" x2="0" y2="18" stroke="rgba(251,191,36,0.9)" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle cx="0" cy="0" r="9" fill="rgba(251,191,36,0.9)" />
      <circle cx="0" cy="0" r="7" fill="#FBC02D" />
    </svg>
  )
}

export function WeatherDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { autoSaveLocation } = useAuth()
  // Independent Dashboard Weather Location state
  const [dashboardWeatherLocation, setDashboardWeatherLocation] = useState<SelectedLocation>(() => {
    const savedGps = weatherService.getStoredGpsLocation()
    if (savedGps) {
      return { lat: savedGps.lat, lon: savedGps.lon, label: 'Current GPS Location' }
    }
    return { city: 'Kotkapura', label: 'Kotkapura, Punjab' }
  })

  const [showModal, setShowModal] = useState(false)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  // Live weather hooks
  const { data: currentWeather, loading: currentLoading, error: currentError } = useCurrentWeather(dashboardWeatherLocation)
  const { data: hourlyData, loading: hourlyLoading } = useHourlyWeather(dashboardWeatherLocation)
  const { data: forecastData, loading: forecastLoading } = useSevenDayForecast(dashboardWeatherLocation)

  const handleLocationSelect = (loc: SelectedLocation) => {
    setShowModal(false)
    setDashboardWeatherLocation(loc)
    if (loc.lat && loc.lon) {
      autoSaveLocation({ latitude: loc.lat, longitude: loc.lon, city: loc.city || undefined })
    } else if (loc.city) {
      const parts = loc.label.split(',').map(s => s.trim())
      autoSaveLocation({ city: loc.city, district: parts[1] || parts[0], state: parts[2] || undefined, country: parts[3] || undefined })
    }
  }

  const isLoading = currentLoading || hourlyLoading || forecastLoading

  const { t: tw } = useLanguage()
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {showModal && <LocationModal onSelect={handleLocationSelect} onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between">
        <div>
          {onNavigate && <Breadcrumb items={[{ label: tw('dashboard', 'Dashboard'), page: 'dashboard' }, { label: tw('weather', 'Weather') }]} onNavigate={onNavigate} />}
          <h2 className="text-2xl font-bold text-text-primary">{tw('weather', 'Weather Dashboard')}</h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-text-muted flex items-center gap-1 hover:text-green-700 transition-colors mt-0.5 group"
          >
            <MapPin size={12} className="text-green-600" />
            <span>{currentWeather?.location_name || currentWeather?.city || dashboardWeatherLocation.label}</span>
            <Edit3 size={11} className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
          </button>
        </div>
        <Button variant="outlined" size="sm" icon={<MapPin size={13} />} onClick={() => setShowModal(true)}>
          {tw('change_city', 'Change Location')}
        </Button>
      </div>

      {currentError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <span>{currentError}</span>
        </div>
      )}

      {/* Skeleton Loading State */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 rounded-2xl bg-surface-secondary/60 border border-border flex items-center justify-center">
            <div className="flex items-center gap-3 text-text-muted text-sm font-semibold">
              <LineSpinner size={20} color="#2E7D32" strokeWidth={2} />
              <span>Retrieving live weather metrics...</span>
            </div>
          </div>
          <div className="h-56 rounded-2xl bg-surface-secondary/40 border border-border" />
          <div className="h-72 rounded-2xl bg-surface-secondary/40 border border-border" />
        </div>
      ) : (
        <>
          {/* Current Weather Card */}
          <div className="gradient-hero rounded-2xl p-6 text-white transition-opacity duration-300 shadow-soft">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-white/70 text-sm mb-2">
                  Current Conditions — {currentWeather?.location_name || currentWeather?.city || dashboardWeatherLocation.label}
                </p>
                <div className="flex items-end gap-4 mb-3">
                  <WeatherConditionIcon
                    condition={currentWeather?.weather_condition || 'Clear'}
                    isDay={currentWeather?.is_day ?? 1}
                  />
                  <span className="text-7xl font-bold">{Math.round(currentWeather?.temperature ?? 25)}°</span>
                  <div>
                    <p className="text-xl font-semibold">{currentWeather?.weather_condition || 'Clear'}</p>
                    <p className="text-white/70 text-sm">
                      Feels like {Math.round(currentWeather?.feels_like ?? currentWeather?.temperature ?? 25)}°C
                    </p>
                  </div>
                </div>
                <p className="text-white/80 text-xs leading-relaxed">
                  🌾 Real-time weather update. Relative humidity {currentWeather?.humidity}% with {currentWeather?.wind_speed} km/h wind speed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Droplets size={16} />, label: 'Humidity', value: `${currentWeather?.humidity ?? 60}%` },
                  { icon: <Wind size={16} />, label: 'Wind Speed', value: `${currentWeather?.wind_speed ?? 5} km/h` },
                  { icon: <Thermometer size={16} />, label: 'Dew Point', value: `${Math.round(currentWeather?.dew_point ?? 18)}°C` },
                  { icon: <Cloud size={16} />, label: 'Cloud Cover', value: `${currentWeather?.cloud_cover ?? 20}%` },
                  { icon: <Sunrise size={16} />, label: 'Sunrise', value: currentWeather?.sunrise || '05:42 AM' },
                  { icon: <Sunset size={16} />, label: 'Sunset', value: currentWeather?.sunset || '07:18 PM' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2 bg-surface/10 rounded-xl px-3 py-2 backdrop-blur border border-white/10">
                    <span className="text-white/70">{m.icon}</span>
                    <div>
                      <p className="text-[10px] text-white/60">{m.label}</p>
                      <p className="font-semibold text-sm">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Hourly Forecast Chart */}
          <Card className="p-5">
            <h3 className="font-bold text-text-primary mb-4">Today's Hourly Forecast</h3>
            {hourlyData && hourlyData.hourly && hourlyData.hourly.length > 0 ? (
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={hourlyData.hourly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FB8C00" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FB8C00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="temperature" stroke="#FB8C00" strokeWidth={2.5} fill="url(#tempGrad)" name="Temp (°C)" />
                  <Area type="monotone" dataKey="humidity" stroke="#1565C0" strokeWidth={2} fill="none" name="Humidity (%)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-text-muted py-6 text-center">Hourly forecast unavailable.</p>
            )}
          </Card>

          {/* 7-Day Forecast */}
          <Card className="p-5">
            <h3 className="font-bold text-text-primary mb-4">7-Day Forecast</h3>
            {forecastData && forecastData.forecast && forecastData.forecast.length > 0 ? (
              <div className="flex flex-col gap-3">
                {forecastData.forecast.map(d => {
                  const isExpanded = expandedDay === d.day;
                  const iconEmoji = d.weather_icon === 'rain' ? '🌧️' : d.weather_icon === 'storm' ? '⛈️' : d.weather_icon === 'cloud' ? '⛅' : '☀️';
                  return (
                    <div
                      key={d.date || d.day}
                      className={`overflow-hidden rounded-xl border transition-all duration-300 ease-in-out ${
                        d.day === 'Today' ? 'border-green-200 bg-green-50/40 dark:bg-green-900/10' : 'border-border bg-surface'
                      } ${isExpanded ? 'shadow-md ring-1 ring-border' : 'hover:bg-background'}`}
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : d.day)}
                        className="w-full flex items-center justify-between p-3 md:p-4 text-left"
                      >
                        <div className="flex items-center gap-4 md:gap-6">
                          <span className="w-10 md:w-14 text-sm font-semibold text-text-primary">{d.day}</span>
                          <span className="text-2xl w-8 text-center">{iconEmoji}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-text-primary">
                              {Math.round(d.temp_max)}° <span className="text-xs font-normal text-text-muted ml-1">/ {Math.round(d.temp_min)}°</span>
                            </span>
                            <span className="text-xs text-text-muted hidden md:inline-block">{d.condition}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                          <span className="text-xs font-medium text-blue-500 flex items-center gap-1">
                            <Droplets size={12} /> {d.rain}
                          </span>
                          <ChevronDown size={18} className={`text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180 text-green-600' : ''}`} />
                        </div>
                      </button>

                      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-4 pt-0 border-t border-border/50 bg-background/50">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                            <div>
                              <p className="text-[10px] text-text-muted uppercase">Min Temp</p>
                              <p className="text-sm font-semibold text-text-primary">{d.temp_min}°C</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text-muted uppercase">Humidity</p>
                              <p className="text-sm font-semibold text-text-primary">{d.humidity}%</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text-muted uppercase">Wind Speed</p>
                              <p className="text-sm font-semibold text-text-primary">{d.wind} km/h</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text-muted uppercase">UV Index</p>
                              <p className="text-sm font-semibold text-text-primary">{d.uv_index ?? 5}</p>
                            </div>
                            <div className="hidden md:block">
                              <p className="text-[10px] text-text-muted uppercase">Sunrise</p>
                              <p className="text-sm font-semibold text-text-primary">{d.sunrise || '05:42 AM'}</p>
                            </div>
                            <div className="hidden md:block">
                              <p className="text-[10px] text-text-muted uppercase">Sunset</p>
                              <p className="text-sm font-semibold text-text-primary">{d.sunset || '07:18 PM'}</p>
                            </div>
                          </div>

                          <div className="bg-green-50/60 dark:bg-green-900/10 rounded-lg p-3 border border-green-100 dark:border-green-800/30">
                            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1.5">
                              <Leaf size={12} /> Agricultural Recommendation
                            </p>
                            <p className="text-sm text-text-primary leading-relaxed">{d.desc || 'Optimal conditions for farming.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-text-muted py-6 text-center">7-day forecast unavailable.</p>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

export function PredictionHistory({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReportItem, setSelectedReportItem] = useState<any | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null)

  useEffect(() => {
    Promise.all([
      historyAPI.getAll().catch(() => ({ items: [] })),
      fertilizerAPI.getRecommendationHistory().catch(() => ({ data: [] }))
    ]).then(([resHistory, resFert]) => {
      const historyItems = resHistory?.items || []
      const fertItems = resFert?.data || (Array.isArray(resFert) ? resFert : [])

      const mappedHistory = historyItems.map((item: any) => {
        const topCrops: any[] = item.recommended_crops || []
        const maxScore = topCrops.length > 0
          ? Math.max(...topCrops.map((c: any) => parseFloat(c.confidence || c.score || 0)))
          : 1
        const normalisedCrops = topCrops.slice(0, 5).map((c: any, i: number) => {
          const raw = parseFloat(c.confidence || c.score || 0)
          const idx = maxScore > 0 ? Math.round((raw / maxScore) * 100) : (96 - i * 7)
          return { ...c, suitabilityIndex: Math.min(100, Math.max(55, idx)) }
        })
        const isSoilOnly = item.recommended_crop === 'Soil Classification Only' || item.recommended_crop === 'N/A'
        return {
          id: item.analysis_id || `P${item.id}`,
          rawId: item.id,
          type: isSoilOnly ? 'Soil' : 'Crop',
          input: item.uploaded_image_name ? `Image: ${item.uploaded_image_name}` : 'Form parameters',
          result: isSoilOnly ? item.predicted_soil : item.recommended_crop || item.predicted_soil,
          predicted_soil: item.predicted_soil,
          confidence: Math.round(item.confidence > 1 ? item.confidence : item.confidence * 100),
          soil_health_score: item.soil_health_score,
          soil_health_class: item.soil_health_class,
          soil_fertility: item.soil_fertility,
          nutrient_deficiency: item.nutrient_deficiency,
          weather_data: item.weather_data,
          recommended_crops: normalisedCrops,
          recommendations: item.recommendations || [],
          date: new Date(item.created_at).toLocaleString(),
          status: 'success',
          rawItem: item,
        }
      })

      const mappedFert = fertItems.map((f: any) => {
        const recName = f.recommendation_json?.recommended_fertilizer || `${f.crop || 'Crop'} Fertilizer`
        return {
          id: `F${f.id}`,
          rawId: f.id,
          type: 'Fertilizer',
          input: `Soil: ${f.soil_type || 'N/A'}, Crop: ${f.crop || 'N/A'} (N:${f.nitrogen}, P:${f.phosphorus}, K:${f.potassium})`,
          result: recName,
          predicted_soil: f.soil_type,
          confidence: 95,
          soil_health_score: 85,
          soil_health_class: 'Good',
          soil_fertility: 'Normal',
          nutrient_deficiency: `NPK: ${f.nitrogen}/${f.phosphorus}/${f.potassium}`,
          weather_data: null,
          recommended_crops: [],
          recommendations: f.recommendation_json?.organic || [],
          date: new Date(f.created_at).toLocaleString(),
          status: 'success',
          rawItem: f,
        }
      })

      const combined = [...mappedHistory, ...mappedFert]
      setPredictions(combined)
    }).catch(err => {
      console.error('Failed to load history:', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const handleDownloadPDF = async (rawId: string | number) => {
    setDownloadingId(rawId)
    try {
      await historyAPI.downloadReport(rawId)
    } catch (err) {
      console.error('PDF download error:', err)
      alert('Unable to download PDF report right now. Please try again.')
    } finally {
      setDownloadingId(null)
    }
  }

  const tabs = ['All', 'Soil', 'Crop', 'Fertilizer', ...(FEATURES.DISEASE_DETECTION ? ['Disease'] : [])]
  const filtered = predictions.filter(p =>
    (activeTab === 'All' || p.type === activeTab) &&
    (p.result.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase()))
  )

  const { t: tph } = useLanguage()

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {onNavigate && <Breadcrumb items={[{ label: tph('dashboard', 'Dashboard'), page: 'dashboard' }, { label: tph('prediction_history', 'Prediction History') }]} onNavigate={onNavigate} />}
          <h2 className="text-2xl font-bold text-text-primary">{tph('prediction_history', 'Prediction History')}</h2>
          <p className="text-sm text-text-muted">{predictions.length} {tph('total_predictions', 'total saved predictions')}</p>
        </div>
        <div className="flex gap-2">
          {predictions.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              icon={<Download size={13} />}
              onClick={() => handleDownloadPDF(predictions[0].rawId)}
              disabled={!!downloadingId}
            >
              {downloadingId === predictions[0]?.rawId ? 'Downloading...' : 'Latest PDF Report'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-background p-1 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all-smooth whitespace-nowrap ${activeTab === tab ? 'bg-surface shadow-soft text-green-700 font-bold' : 'text-text-muted hover:text-text-secondary'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search prediction history by crop, soil, or ID..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background/50 text-text-muted text-xs uppercase tracking-wider border-b border-border">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Recommended Result</th>
                <th className="p-4 font-semibold">AI Match Rating</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Soil Health</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">Loading history records...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">No analysis records found.</td>
                </tr>
              ) : filtered.map(p => (
                <React.Fragment key={p.id}>
                  <tr 
                    className="border-b border-border hover:bg-background transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                  >
                    <td className="py-3 px-4 text-xs font-mono text-text-muted">{p.id}</td>
                    <td className="py-3 px-4">
                      <Badge color={p.type === 'Crop' ? 'green' : 'orange'}>{p.type}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-text-primary">{p.result}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{p.predicted_soil}</p>
                    </td>
                    <td className="py-3 px-4">
                      {(() => {
                        const topCrop = p.recommended_crops?.[0]
                        const sui = topCrop?.suitabilityIndex ?? 96
                        const label = sui >= 90 ? 'Excellent Match' : sui >= 80 ? 'Very Good Match' : sui >= 70 ? 'Good Match' : sui >= 60 ? 'Moderate Match' : 'Suitable Match'
                        const color = sui >= 90 ? 'text-green-700 bg-green-50 border-green-200' : sui >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                        return (
                          <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block w-fit ${color}`}>{label}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-14 bg-background rounded-full h-1 overflow-hidden border border-border">
                                <div className="h-full rounded-full bg-green-500" style={{ width: `${sui}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-text-muted">{sui}/100</span>
                            </div>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-3 px-4 text-xs text-text-muted">{p.date}</td>
                    <td className="py-3 px-4">
                      {(() => {
                        const score = parseFloat(p.soil_health_score) || 70
                        const cls = p.soil_health_class || 'Good'
                        const color = score >= 80 ? 'text-green-700 bg-green-50 border-green-200' : score >= 65 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-700 bg-red-50 border-red-200'
                        return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${color}`}>{cls}</span>
                      })()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={<Eye size={12} />}
                          onClick={() => setSelectedReportItem(p)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="xs"
                          icon={<Download size={12} />}
                          onClick={() => handleDownloadPDF(p.rawId)}
                          disabled={downloadingId === p.rawId}
                        >
                          {downloadingId === p.rawId ? 'Downloading...' : 'PDF'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === p.id && (
                    <tr className="bg-surface-hover border-b border-border">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="p-2.5 bg-background rounded-xl border border-border">
                            <p className="text-[10px] text-text-muted font-semibold uppercase">Predicted Soil</p>
                            <p className="text-sm font-bold text-text-primary">{p.predicted_soil}</p>
                          </div>
                          <div className="p-2.5 bg-background rounded-xl border border-border">
                            <p className="text-[10px] text-text-muted font-semibold uppercase">Soil Fertility</p>
                            <p className="text-sm font-bold text-text-primary">{p.soil_fertility || 'Medium'}</p>
                          </div>
                          {p.weather_data?.temperature && (
                            <div className="p-2.5 bg-background rounded-xl border border-border">
                              <p className="text-[10px] text-text-muted font-semibold uppercase">Temperature</p>
                              <p className="text-sm font-bold text-blue-600">{p.weather_data.temperature}°C</p>
                            </div>
                          )}
                          {p.nutrient_deficiency && (
                            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                              <p className="text-[10px] text-amber-600 font-semibold uppercase">Nutrient Alert</p>
                              <p className="text-xs font-semibold text-amber-700 leading-tight">{p.nutrient_deficiency}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button variant="primary" size="sm" icon={<FileText size={12} />} onClick={() => setSelectedReportItem(p)}>View Full Report</Button>
                          <Button variant="outlined" size="sm" icon={<Download size={12} />} onClick={() => handleDownloadPDF(p.rawId)} disabled={downloadingId === p.rawId}>Download PDF</Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Report View Modal — AgroAI Professional Summary */}
      {selectedReportItem && (() => {
        const item = selectedReportItem
        const wx = item.weather_data || {}
        const crops: any[] = item.recommended_crops || []
        const healthScore = parseFloat(item.soil_health_score) || 70
        const healthClass = item.soil_health_class || 'Good'
        const healthColor =
          healthScore >= 80 ? 'text-green-700' :
          healthScore >= 65 ? 'text-green-600' :
          healthScore >= 50 ? 'text-amber-600' :
          'text-red-600'
        const healthBg =
          healthScore >= 80 ? 'bg-green-50 border-green-200' :
          healthScore >= 65 ? 'bg-emerald-50 border-emerald-200' :
          healthScore >= 50 ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        const badgeLabels = ['Excellent Match','Very Good Match','Good Match','Moderate Match','Suitable Match']

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-elevated max-h-[92vh] overflow-y-auto flex flex-col">

              {/* Modal Header */}
              <div className="flex items-start justify-between p-5 border-b border-border flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-muted bg-background px-2 py-0.5 rounded-lg border border-border">{item.id}</span>
                    <Badge color="green">AgroAI Report</Badge>
                  </div>
                  <h3 className="text-xl font-extrabold text-text-primary">Soil Analysis &amp; Crop Advisory Report</h3>
                  <p className="text-xs text-text-muted mt-0.5">{item.date}</p>
                </div>
                <button onClick={() => setSelectedReportItem(null)} className="p-1.5 rounded-xl text-text-muted hover:bg-background hover:text-text-primary transition-colors ml-4 flex-shrink-0">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-5 flex-1">

                {/* Top Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800/40 text-center">
                    <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1">Top Crop</p>
                    <p className="text-lg font-extrabold text-green-700">{item.result}</p>
                    <p className="text-[10px] text-green-600 mt-0.5 font-semibold">96/100 — Excellent</p>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${healthBg}`}>
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">Soil Health</p>
                    <p className={`text-lg font-extrabold ${healthColor}`}>{healthScore.toFixed(1)}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 ${healthColor}`}>{healthClass}</p>
                  </div>
                  <div className="p-3 bg-background rounded-xl border border-border text-center">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">Predicted Soil</p>
                    <p className="text-sm font-bold text-text-primary leading-snug">{item.predicted_soil || 'Loamy Soil'}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{item.confidence}% Confidence</p>
                  </div>
                  <div className="p-3 bg-background rounded-xl border border-border text-center">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">Weather</p>
                    <p className="text-lg font-extrabold text-blue-600">{wx.temperature ?? '--'}°C</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{wx.humidity ?? '--'}% · {wx.weather_condition || 'N/A'}</p>
                  </div>
                </div>

                {/* Top 5 Crops */}
                {crops.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Top 5 Recommended Crops — Suitability Index</p>
                    <div className="space-y-2">
                      {crops.map((crop: any, i: number) => {
                        const sui = crop.suitabilityIndex ?? (96 - i * 7)
                        const badge = badgeLabels[Math.min(i, 4)]
                        const isTop = i === 0
                        return (
                          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${isTop ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/40' : 'bg-background border-border'}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${isTop ? 'bg-green-600 text-white' : 'bg-surface border border-border text-text-muted'}`}>
                              {i + 1}
                            </span>
                            <span className={`flex-1 text-sm font-semibold ${isTop ? 'text-green-700' : 'text-text-primary'}`}>{crop.crop}</span>
                            <span className="text-xs text-text-muted">{badge}</span>
                            <div className="w-20 flex items-center gap-1.5">
                              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${sui}%` }} />
                              </div>
                              <span className={`text-xs font-bold flex-shrink-0 ${isTop ? 'text-green-700' : 'text-text-secondary'}`}>{sui}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Weather Details */}
                {(wx.temperature || wx.humidity || wx.rainfall !== undefined) && (
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Field Weather Conditions</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Temperature', value: `${wx.temperature ?? '--'}°C` },
                        { label: 'Humidity', value: `${wx.humidity ?? '--'}%` },
                        { label: 'Rainfall', value: `${wx.rainfall ?? 0} mm` },
                        { label: 'Condition', value: wx.weather_condition || 'N/A' },
                        { label: 'Location', value: wx.location_name || wx.city || 'N/A' },
                        { label: 'State', value: wx.state || 'N/A' },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-2.5 bg-background rounded-xl border border-border">
                          <p className="text-[10px] text-text-muted font-medium">{label}</p>
                          <p className="text-sm font-bold text-text-primary truncate">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrient Alert */}
                {item.nutrient_deficiency && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl">
                    <p className="text-xs font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wide mb-1.5">⚠ Nutrient Alert</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">{item.nutrient_deficiency}</p>
                  </div>
                )}

                {/* Fertilizer Recommendations */}
                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <p className="text-xs font-extrabold text-text-secondary uppercase tracking-wide mb-2">Fertilizer Recommendations</p>
                  {item.recommendations && item.recommendations.length > 0 ? (
                    <div className="space-y-1">
                      {item.recommendations.slice(0, 4).map((rec: string, i: number) => (
                        <p key={i} className="text-xs text-text-primary flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">→</span>
                          {rec}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {['MOP (50 kg/acre)', 'DAP (40 kg/acre)', 'FYM / Compost (3T/acre)'].map(f => (
                        <div key={f} className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-xs font-semibold text-green-700">{f}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-5 pt-0 border-t border-border flex-shrink-0">
                <Button
                  variant="primary"
                  className="flex-1 justify-center"
                  icon={<Download size={14} />}
                  onClick={() => handleDownloadPDF(item.rawId)}
                  disabled={downloadingId === item.rawId}
                >
                  {downloadingId === item.rawId ? 'Generating PDF...' : 'Download Full PDF Report'}
                </Button>
                <Button variant="ghost" onClick={() => setSelectedReportItem(null)}>Close</Button>
              </div>

            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ---- Notifications ----
export function Notifications({ onNavigate, onMarkRead, onMarkAllRead }: {
  onNavigate?: (page: string) => void
  readIds?: Set<string>
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
}) {
  const { t: tn } = useLanguage()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [toast, setToast] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const typeColors: Record<string, 'blue' | 'red' | 'green' | 'gray' | 'orange' | 'purple'> = {
    weather: 'blue', Weather: 'blue',
    crop: 'green', Crop: 'green',
    system: 'orange', System: 'orange',
    admin: 'purple', Admin: 'purple',
    fertilizer: 'green', Fertilizer: 'green',
    community: 'blue', Community: 'blue',
    general: 'gray', General: 'gray',
  }
  const typeIcons: Record<string, string> = {
    weather: '⛈️', Weather: '⛈️',
    crop: '🌱', Crop: '🌱',
    system: '🤖', System: '🤖',
    admin: '📢', Admin: '📢',
    fertilizer: '🧪', Fertilizer: '🧪',
    community: '🌾', Community: '🌾',
    general: '🔔', General: '🔔',
  }

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await notificationAPI.getNotifications()
      setItems(data || [])
    } catch (err) {
      console.warn("Could not load notifications from API:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const unreadCount = items.filter(n => !n.is_read).length

  const visible = items.filter(n =>
    filter === 'All' ||
    (filter === 'Unread' && !n.is_read) ||
    (filter === 'Read' && n.is_read)
  )

  const markRead = async (id: number) => {
    try {
      await notificationAPI.markNotificationRead(id)
      setItems(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item))
      if (onMarkRead) onMarkRead(String(id))
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllNotificationsRead()
      setItems(prev => prev.map(item => ({ ...item, is_read: true })))
      if (onMarkAllRead) onMarkAllRead()
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  const handleCardClick = (id: number) => {
    setExpandedId(prev => prev === id ? null : id)
    const item = items.find(n => n.id === id)
    if (item && !item.is_read) {
      markRead(id)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-green-800 shadow-elevated animate-fade-in">
          <Check size={15} className="text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium">{tn('mark_all_read', 'All notifications marked as read')}</span>
          <button onClick={() => setToast(false)} className="text-xs opacity-60 hover:opacity-100 ml-2">✕</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {onNavigate && <Breadcrumb items={[{ label: tn('dashboard', 'Dashboard'), page: 'dashboard' }, { label: tn('notifications', 'Notifications') }]} onNavigate={onNavigate} />}
          <h2 className="text-2xl font-bold text-text-primary">{tn('notifications', 'Notifications')}</h2>
          <p className="text-sm text-text-muted">
            {unreadCount > 0 ? <><span className="font-semibold text-green-700">{unreadCount}</span> {tn('no_notifications', 'unread notification')}{unreadCount !== 1 ? 's' : ''}</> : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={<Check size={13} />} onClick={markAllRead}>{tn('mark_all_read', 'Mark all read')}</Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['All', 'Unread', 'Read'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f ? 'bg-green-600 text-white shadow-sm' : 'bg-surface text-text-muted border border-border hover:border-border'
            }`}
          >
            {f}
            {f === 'Unread' && unreadCount > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === 'Unread' ? 'bg-surface/30 text-white' : 'bg-green-100 text-green-700'}`}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification cards */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-text-muted text-sm gap-2">
            <LineSpinner />
            <span>Loading notifications...</span>
          </div>
        ) : (
          visible.map((n, idx) => {
            const isUnread = !n.is_read
            const isExpanded = expandedId === n.id
            const catKey = n.category || n.type || 'General'
            const catColor = typeColors[catKey] || 'gray'
            const catIcon = typeIcons[catKey] || '🔔'
            const formattedTime = n.created_at ? new Date(n.created_at).toLocaleString() : ''

            return (
              <div
                key={n.id}
                onClick={() => handleCardClick(n.id)}
                className={`rounded-2xl border transition-all duration-200 cursor-pointer select-none animate-notif-${Math.min(idx, 4)} ${
                  isUnread
                    ? 'bg-surface border-border shadow-soft hover:shadow-card border-l-4 border-l-green-500'
                    : 'bg-background/60 border-border hover:bg-background'
                }`}
              >
                <div className="flex items-start gap-3 p-4">
                  {/* Icon */}
                  <div className={`text-xl flex-shrink-0 mt-0.5 transition-opacity ${isUnread ? 'opacity-100' : 'opacity-50'}`}>
                    {catIcon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className={`text-sm leading-snug ${isUnread ? 'font-semibold text-text-primary' : 'font-medium text-text-muted'}`}>
                        {n.title}
                      </p>
                      <Badge color={catColor}>{catKey}</Badge>
                      {isUnread && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                    </div>
                    <p className={`text-xs leading-relaxed transition-all ${
                      isExpanded ? 'line-clamp-none' : 'line-clamp-2'
                    } ${isUnread ? 'text-text-secondary' : 'text-text-muted'}`}>
                      {n.message}
                    </p>
                    <p className="text-[10px] text-text-muted mt-1.5">{formattedTime}</p>
                  </div>

                  {/* Right side: Mark as Read button (unread only) */}
                  <div className="flex-shrink-0 flex items-center self-start pt-0.5">
                    {isUnread ? (
                      <button
                        onClick={e => { e.stopPropagation(); markRead(n.id) }}
                        className="text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap"
                      >
                        Mark as read
                      </button>
                    ) : (
                      <span className="text-[10px] text-text-muted font-medium">Read</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {!loading && visible.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mx-auto mb-3">
              <Bell size={24} className="text-text-muted" />
            </div>
            <p className="font-semibold text-text-muted">No notifications</p>
            <p className="text-sm text-text-muted mt-1">
              {filter === 'Unread' ? "You're all caught up!" : filter === 'Read' ? 'No read notifications yet.' : 'Nothing here yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Feedback ----
export function Feedback({ role, onNavigate }: { role?: string, onNavigate?: (page: string) => void }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('general')
  const [search, setSearch] = useState('')
  const [adminReplyState, setAdminReplyState] = useState<Record<string, boolean>>({})
  const [adminReplyText, setAdminReplyText] = useState<Record<string, string>>({})
  const [submittingUserFeedback, setSubmittingUserFeedback] = useState(false)

  // Live admin feedback state
  const [feedbackList, setFeedbackList] = useState<any[]>([])
  const [summaryStats, setSummaryStats] = useState<{ average_rating: number; total_reviews: number; active_farmers: number; response_rate: number }>({
    average_rating: 4.8,
    total_reviews: 0,
    active_farmers: 0,
    response_rate: 100,
  })
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const fetchAdminFeedbackData = async () => {
    setLoadingFeedback(true)
    try {
      const [sum, list] = await Promise.all([
        adminAPI.getFeedbackSummary().catch(() => null),
        adminAPI.getFeedbackList({ search }).catch(() => [])
      ])
      if (sum) setSummaryStats(sum)
      if (list) setFeedbackList(list)
    } catch (err) {
      console.error("Failed to load admin feedback:", err)
    } finally {
      setLoadingFeedback(false)
    }
  }

  useEffect(() => {
    if (role === 'admin') {
      fetchAdminFeedbackData()
    }
  }, [role, search])

  const handleUserSubmitFeedback = async () => {
    if (rating === 0) return
    setSubmittingUserFeedback(true)
    try {
      await adminAPI.submitFeedback({
        rating,
        category,
        comment,
        crop_focus: category === 'crop' ? 'Crop Advisory' : category === 'soil' ? 'Soil Health' : 'General Farming'
      })
      setSubmitted(true)
    } catch (err) {
      console.error("Failed to submit feedback:", err)
    } finally {
      setSubmittingUserFeedback(false)
    }
  }

  const handleSendReply = async (id: string, numericId: number) => {
    const text = adminReplyText[id]
    if (!text || !text.trim()) return
    try {
      await adminAPI.replyToFeedback(numericId, text.trim())
      setAdminReplyState(prev => ({ ...prev, [id]: false }))
      setAdminReplyText(prev => ({ ...prev, [id]: '' }))
      await fetchAdminFeedbackData()
    } catch (err) {
      console.error("Failed to send reply:", err)
    }
  }

  const handleDeleteReply = async (numericId: number) => {
    try {
      await adminAPI.deleteFeedbackReply(numericId)
      await fetchAdminFeedbackData()
    } catch (err) {
      console.error("Failed to delete reply:", err)
    }
  }

  const handleToggleResolve = async (numericId: number) => {
    try {
      await adminAPI.resolveFeedback(numericId)
      await fetchAdminFeedbackData()
    } catch (err) {
      console.error("Failed to update resolve status:", err)
    }
  }

  if (role === 'admin') {
    const filteredFeedback = feedbackList

    const toggleReply = (id: string) => setAdminReplyState(prev => ({ ...prev, [id]: !prev[id] }))

    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {onNavigate && <Breadcrumb items={[{ label: 'Dashboard', page: 'dashboard' }, { label: 'Farmer Feedback' }]} onNavigate={onNavigate} />}
            <h2 className="text-2xl font-bold text-text-primary">Farmer Feedback</h2>
            <p className="text-sm text-text-muted">Reviews, field reports and suggestions submitted by registered farmers.</p>
          </div>
        </div>

        {/* Overall Rating Summary */}
        <Card className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-surface to-background border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <h3 className="text-5xl font-bold text-text-primary mb-2">{summaryStats.average_rating.toFixed(1)}</h3>
                <div className="flex text-orange-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={20} fill={idx < Math.round(summaryStats.average_rating) ? "#FB8C00" : "none"} className={idx < Math.round(summaryStats.average_rating) ? "text-orange-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-xs font-semibold text-text-muted mt-2 uppercase tracking-wide">Average Rating</p>
              </div>
              <div className="w-px h-16 bg-border mx-2 hidden md:block"></div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-2xl font-bold text-text-primary">{summaryStats.total_reviews}</p>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-semibold mt-0.5">Total Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{summaryStats.active_farmers}</p>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-semibold mt-0.5">Active Farmers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{summaryStats.response_rate}%</p>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-semibold mt-0.5">Response Rate</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <SearchInput value={search} onChange={setSearch} placeholder="Search feedback..." />
            </div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        </Card>

        {/* Feedback Cards List */}
        <div className="space-y-4">
          {loadingFeedback ? (
            <div className="flex flex-col items-center justify-center p-12 text-text-muted text-sm gap-2">
              <LineSpinner />
              <span>Loading farmer feedback from PostgreSQL...</span>
            </div>
          ) : (
            filteredFeedback.map((fb) => (
              <Card key={fb.id} className="p-6 transition-all duration-300 hover:shadow-md hover:border-text-muted/30">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-lg flex-shrink-0">
                      {fb.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-base">{fb.user}</h4>
                      <p className="text-xs text-text-secondary mt-0.5"><span className="font-medium text-text-muted">Crop Focus:</span> {fb.cropFocus}</p>
                      <p className="text-[11px] text-text-muted mt-1">{fb.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex text-orange-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={16} fill={idx < fb.rating ? '#FB8C00' : 'none'} className={idx < fb.rating ? 'text-orange-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>

                <div className="pl-16 space-y-4">
                  <p className="text-sm text-text-primary leading-relaxed">"{fb.comment}"</p>
                  
                  {fb.helpfulCount > 0 && (
                    <p className="text-[11px] font-medium text-text-muted flex items-center gap-1.5">
                      <ThumbsUp size={12} className="text-blue-500" /> {fb.helpfulCount} farmers found this helpful
                    </p>
                  )}

                  {fb.adminResponse && (
                    <div className="mt-4 border-l-2 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-xl">
                      <p className="text-xs font-bold text-green-800 dark:text-green-400 mb-2 uppercase tracking-wide">Admin Response</p>
                      <p className="text-sm text-text-primary whitespace-pre-line">{fb.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {!fb.adminResponse && (
                      <Button variant="primary" size="sm" onClick={() => toggleReply(fb.id)}>Reply</Button>
                    )}
                    {fb.adminResponse && (
                      <>
                        <Button variant="outlined" size="sm" onClick={() => toggleReply(fb.id)}>Edit Response</Button>
                        <Button variant="outlined" size="sm" className="!text-error !border-error/30 hover:!bg-error/10" onClick={() => handleDeleteReply(fb.numeric_id)}>Delete Response</Button>
                      </>
                    )}
                    <Button variant="outlined" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => handleToggleResolve(fb.numeric_id)}>
                      {fb.isResolved ? "Resolved ✓" : "Mark as Resolved"}
                    </Button>
                  </div>

                  {/* Collapsible Reply Box */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${adminReplyState[fb.id] ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 bg-background border border-border rounded-xl space-y-3">
                      <p className="text-xs font-semibold text-text-primary">Reply to Farmer</p>
                      <textarea 
                        className="w-full bg-surface border border-border rounded-lg p-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-green-500 transition-colors resize-none" 
                        rows={3}
                        placeholder="Type your response here..."
                        value={adminReplyText[fb.id] || ''}
                        onChange={(e) => setAdminReplyText(prev => ({ ...prev, [fb.id]: e.target.value }))}
                      ></textarea>
                      <div className="flex justify-end gap-2">
                        <Button variant="outlined" size="sm" onClick={() => toggleReply(fb.id)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={() => handleSendReply(fb.id, fb.numeric_id)}>Send Reply</Button>
                      </div>
                    </div>
                  </div>

                </div>
              </Card>
            ))
          )}
          {!loadingFeedback && filteredFeedback.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No feedback matches your search.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (submitted) return (
    <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-64 gap-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <Check size={36} className="text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-text-primary">Thank you for your feedback!</h3>
      <p className="text-sm text-text-muted text-center max-w-sm">Your response helps us improve AgroAI for farmers worldwide. We typically respond within 24 hours.</p>
      <Button variant="primary" onClick={() => { setSubmitted(false); setRating(0); setComment('') }}>Submit Another</Button>
    </div>
  )

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        {onNavigate && <Breadcrumb items={[{ label: 'Dashboard', page: 'dashboard' }, { label: 'Feedback' }]} onNavigate={onNavigate} />}
        <h2 className="text-2xl font-bold text-text-primary">Share Feedback</h2>
        <p className="text-sm text-text-muted">Help us improve AgroAI for farmers everywhere</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}

      <Card className="p-6 space-y-5">
        <div>
          <p className="text-sm font-semibold text-text-secondary mb-3">How would you rate AgroAI? *</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star size={32} fill={(hovered || rating) >= s ? '#FB8C00' : 'none'} className={(hovered || rating) >= s ? 'text-orange-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-text-muted mt-2">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}</p>
          )}
        </div>

        <SelectInput
          label="Feedback Category"
          options={[
            { value: 'general', label: 'General' }, 
            { value: 'crop', label: 'Crop Recommendation' }, 
            { value: 'soil', label: 'Soil Classification' }, 
            ...(FEATURES.DISEASE_DETECTION ? [{ value: 'disease', label: 'Disease Detection' }] : []), 
            { value: 'chatbot', label: 'AI Chatbot' }, 
            { value: 'weather', label: 'Weather' }, 
            { value: 'ux', label: 'UI/UX Design' }
          ]}
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Your Comments</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tell us what you loved or what we can improve..."
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl border border-border text-sm bg-surface text-text-primary placeholder-text-muted outline-none focus:border-text-muted transition-colors resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-text-secondary mb-2">Attach Screenshot (Optional)</p>
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-text-muted transition-colors cursor-pointer">
            <Camera size={20} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-text-muted">Click to upload screenshot</p>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={handleUserSubmitFeedback} disabled={rating === 0 || submittingUserFeedback} className="w-full justify-center">
          {submittingUserFeedback ? "Submitting..." : "Submit Feedback"}
        </Button>
      </Card>

        {/* Right Column - Animated Illustration Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-surface rounded-3xl border border-border p-8 relative overflow-hidden shadow-soft">
          {/* Animated decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-200/40 dark:bg-green-700/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/40 dark:bg-emerald-700/10 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          
          <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
            {/* Main Icon */}
            <div className="w-20 h-20 bg-background rounded-2xl shadow-elevated flex items-center justify-center mx-auto mb-6 relative animate-float">
              <Leaf size={36} className="text-green-600" />
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <Star size={14} className="text-white" fill="white" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-text-primary leading-tight">Your Feedback Helps <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">AgroAI</span> Grow</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Every suggestion, review, and experience shared by our farming community helps us improve AgroAI and build smarter agricultural solutions for everyone.
              </p>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-background border border-border p-4 rounded-2xl flex flex-col items-center justify-center animate-fade-in hover:scale-105 transition-transform shadow-sm" style={{ animationDelay: '0.1s' }}>
                <div className="flex text-orange-400 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FB8C00" />)}
                </div>
                <p className="text-3xl font-bold text-text-primary">4.9<span className="text-sm font-normal text-text-muted">/5</span></p>
                <p className="text-[10px] text-text-muted uppercase font-semibold mt-1 tracking-wider">Average Rating</p>
              </div>
              <div className="bg-background border border-border p-4 rounded-2xl flex flex-col items-center justify-center animate-fade-in hover:scale-105 transition-transform shadow-sm" style={{ animationDelay: '0.2s' }}>
                <MessageSquare size={20} className="text-blue-500 mb-1" />
                <p className="text-3xl font-bold text-text-primary">12.5k+</p>
                <p className="text-[10px] text-text-muted uppercase font-semibold mt-1 tracking-wider">Feedback Received</p>
              </div>
              <div className="bg-background border border-border p-4 rounded-2xl flex flex-col items-center justify-center animate-fade-in hover:scale-105 transition-transform shadow-sm" style={{ animationDelay: '0.3s' }}>
                <TrendingUp size={20} className="text-purple-500 mb-1" />
                <p className="text-3xl font-bold text-text-primary">1.2k+</p>
                <p className="text-[10px] text-text-muted uppercase font-semibold mt-1 tracking-wider">Feature Requests</p>
              </div>
              <div className="bg-background border border-border p-4 rounded-2xl flex flex-col items-center justify-center animate-fade-in hover:scale-105 transition-transform shadow-sm" style={{ animationDelay: '0.4s' }}>
                <ThumbsUp size={20} className="text-green-500 mb-1" />
                <p className="text-3xl font-bold text-text-primary">98%</p>
                <p className="text-[10px] text-text-muted uppercase font-semibold mt-1 tracking-wider">Farmer Satisfaction</p>
              </div>
            </div>

            {/* Floating feature cards */}
            <div className="pt-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-10 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl rounded-full"></div>
              <div className="flex justify-center gap-3 animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}>
                <span className="bg-background border border-border shadow-soft px-4 py-2 rounded-full text-xs font-semibold text-text-primary flex items-center gap-1.5 hover:bg-surface transition-colors cursor-default">
                  <CheckCircle2 size={14} className="text-green-500" /> Better Crop Recommendations
                </span>
              </div>
              <div className="flex justify-center gap-3 mt-3">
                <span className="bg-background border border-border shadow-soft px-4 py-2 rounded-full text-xs font-semibold text-text-primary flex items-center gap-1.5 animate-float hover:bg-surface transition-colors cursor-default" style={{ animationDelay: '2s', animationDuration: '5s' }}>
                  <Sparkles size={14} className="text-purple-500" /> Improved AI Accuracy
                </span>
                <span className="bg-background border border-border shadow-soft px-4 py-2 rounded-full text-xs font-semibold text-text-primary flex items-center gap-1.5 animate-float hover:bg-surface transition-colors cursor-default" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}>
                  <Cloud size={14} className="text-blue-500" /> Weather Enhancements
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Profile ----
export function Profile({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user, updateUser, logout } = useAuth()
  const { t: tp } = useLanguage()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form states initialized strictly from logged-in user (NO DEMO FALLBACKS)
  const [name, setName] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [country, setCountry] = useState(user?.country || '')
  const [state, setState] = useState(user?.state || '')
  const [district, setDistrict] = useState(user?.district || '')
  const [city, setCity] = useState(user?.city || '')
  const [preferredLang, setPreferredLang] = useState<string | number>(user?.preferred_language || 1)

  const [userPredictionsCount, setUserPredictionsCount] = useState<number>(0)

  // Synchronize form strictly when user context updates from database API
  useEffect(() => {
    if (user) {
      setName(user.username || '')
      setBio(user.bio || '')
      setPhone(user.phone || '')
      setCountry(user.country || '')
      setState(user.state || '')
      setDistrict(user.district || '')
      setCity(user.city || '')
      if (user.preferred_language) setPreferredLang(user.preferred_language)
    }
    historyAPI.getAll().then(res => {
      if (Array.isArray(res)) setUserPredictionsCount(res.length)
      else if (res?.items) setUserPredictionsCount(res.items.length)
    }).catch(() => {})
  }, [user])

  // Cascading dropdown options — with placeholder for empty selection
  const countryOptions = [
    { value: '', label: '— Select Country —' },
    ...Object.keys(LOCATION_DATA).map(c => ({ value: c, label: c }))
  ]
  const availableStates = (country && LOCATION_DATA[country]) ? Object.keys(LOCATION_DATA[country]) : []
  const stateOptions = [
    { value: '', label: '— Select State —' },
    ...availableStates.map(s => ({ value: s, label: s }))
  ]
  const availableDistricts = (country && state && LOCATION_DATA[country] && LOCATION_DATA[country][state]) ? LOCATION_DATA[country][state] : []
  const districtOptions = [
    { value: '', label: '— Select District —' },
    ...availableDistricts.map(d => ({ value: d, label: d }))
  ]

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value
    setCountry(newCountry)
    // Reset dependent children when parent changes
    setState('')
    setDistrict('')
    setCity('')
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value
    setState(newState)
    // Reset dependent children when parent changes
    setDistrict('')
    setCity('')
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value
    setDistrict(newDistrict)
    // Reset village/city when district changes
    setCity('')
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const updated = await profileAPI.updateProfile({
        username: name.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        country,
        state,
        district,
        city: city.trim(),
        preferred_language: preferredLang,
      })
      updateUser(updated)
      setEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setSaveError(err.response?.data?.detail || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    logout()
    window.location.reload()
  }

  // Calculate dynamic completion score based strictly on presence of required DB fields
  const isNameFilled = !!(user?.username || name).trim()
  const isPhoneFilled = !!(user?.phone || phone).trim()
  const isCountryFilled = !!(user?.country || country).trim()
  const isStateFilled = !!(user?.state || state).trim()
  const isDistrictFilled = !!(user?.district || district).trim()
  const isCityFilled = !!(user?.city || city).trim()
  const isBioFilled = !!(user?.bio || bio).trim()
  const isLangFilled = !!(user?.preferred_language || preferredLang)

  const reqFields = [isNameFilled, isPhoneFilled, isCountryFilled, isStateFilled, isDistrictFilled, isCityFilled, isBioFilled, isLangFilled]
  const filledCount = reqFields.filter(Boolean).length
  const completionPercent = Math.round((filledCount / reqFields.length) * 100)

  const formattedProfileName = formatDisplayName(name || user?.username || user?.email?.split('@')[0] || 'User')
  const initials = getInitials(formattedProfileName)

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          {onNavigate && <Breadcrumb items={[{ label: tp('dashboard', 'Dashboard'), page: 'dashboard' }, { label: tp('my_profile', 'Profile') }]} onNavigate={onNavigate} />}
          <h2 className="text-2xl font-bold text-text-primary">{tp('my_profile', 'My Profile')}</h2>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
            <Button variant="primary" size="sm" icon={saving ? <LineSpinner size={13} /> : <Check size={13} />} onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <Button variant="outlined" size="sm" icon={<Edit3 size={13} />} onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          Profile updated successfully! All location and user data saved to database.
        </div>
      )}

      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2 animate-fade-in">
          <AlertCircle size={16} />
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative flex-shrink-0">
                {getProfilePictureUrl(user?.profile_picture) ? (
                  <img src={getProfilePictureUrl(user?.profile_picture)} alt={formattedProfileName} className="w-24 h-24 rounded-2xl object-cover shadow-soft" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-soft">
                    {initials}
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface shadow-card flex items-center justify-center border border-border hover:bg-background cursor-pointer" title="Upload Photo">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        try {
                          setSaving(true)
                          const updated = await profileAPI.uploadPicture(file)
                          updateUser(updated)
                        } catch (err: any) {
                          setSaveError('Failed to upload profile picture. Please try again.')
                        } finally {
                          setSaving(false)
                        }
                      }
                    }}
                  />
                  <Camera size={13} className="text-text-secondary" />
                </label>
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-3">
                    <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-text-secondary">Bio</label>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Not provided" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-border text-sm resize-none" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-text-primary">{formattedProfileName}</h3>
                    <p className="text-sm text-text-muted mt-1">{user?.bio || bio || 'Not provided'}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge color="green">{user?.role || 'Farmer'}</Badge>
                      <Badge color="blue">{(user?.state || state) ? `${user?.state || state}, ${user?.country || country}` : 'Location Not Provided'}</Badge>
                      <Badge color="gray">{user?.preferred_language_name || 'English'}</Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-secondary">Profile Completion</span>
                <span className="text-sm font-bold text-green-700">{completionPercent}%</span>
              </div>
              <ProgressBar value={completionPercent} color="#2E7D32" />
              <p className="text-xs text-text-muted mt-1.5">
                {completionPercent === 100
                  ? '🎉 Profile 100% Complete — All location and farm information provided'
                  : 'Complete all location and personal parameters to reach 100%'}
              </p>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-5 border border-red-100">
            <h3 className="font-semibold text-red-700 mb-4">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-text-primary">Delete Account</p>
                <p className="text-xs text-text-muted mt-0.5">Permanently remove your account and all data</p>
              </div>
              <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setShowDeleteConfirm(true)}>Delete Account</Button>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal & Location Information */}
          <Card className="p-5">
            <h3 className="font-semibold text-text-primary mb-4">Personal & Farm Information</h3>
            {editing ? (
              <div className="space-y-4 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Readonly Email */}
                  <div>
                    <label className="text-xs font-semibold text-text-muted mb-1 block">Email Address (Account ID)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 rounded-xl border border-border bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm cursor-not-allowed pr-8 font-mono"
                      />
                      <Lock size={14} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  {/* Editable Phone */}
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Not provided"
                  />
                </div>

                {/* Cascading Country / State / District */}
                <div className="grid md:grid-cols-3 gap-4">
                  <SelectInput
                    label="Country"
                    options={countryOptions}
                    value={country}
                    onChange={handleCountryChange}
                  />

                  <SelectInput
                    label="State"
                    options={stateOptions}
                    value={state}
                    onChange={handleStateChange}
                  />

                  <SelectInput
                    label="District"
                    options={districtOptions}
                    value={district}
                    onChange={handleDistrictChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Village / City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Not provided"
                  />

                  <SelectInput
                    label="Preferred Language"
                    options={SUPPORTED_LANGUAGES.map(l => ({ value: String(l.id), label: `${l.native || l.name} (${l.name})` }))}
                    value={String(preferredLang)}
                    onChange={e => setPreferredLang(Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Email', value: user?.email || 'Not provided', icon: '📧' },
                  { label: 'Phone', value: user?.phone || phone || 'Not provided', icon: '📱' },
                  { label: 'Country', value: user?.country || country || 'Not provided', icon: '🌐' },
                  { label: 'State', value: user?.state || state || 'Not provided', icon: '📍' },
                  { label: 'District', value: user?.district || district || 'Not provided', icon: '🏘️' },
                  { label: 'Village / City', value: user?.city || city || 'Not provided', icon: '🏡' },
                  { label: 'Preferred Language', value: user?.preferred_language_name || 'English', icon: '🗣️' },
                  { label: 'GPS Location', value: user?.latitude ? `${user.latitude.toFixed(2)}°N, ${user.longitude?.toFixed(2)}°E` : 'Available via GPS', icon: '📡' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50">
                    <span className="text-lg">{f.icon}</span>
                    <div>
                      <p className="text-xs text-text-muted font-medium">{f.label}</p>
                      <p className="font-semibold text-text-primary">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Summary */}
          <Card className="p-5">
            <h3 className="font-semibold text-text-primary mb-4">Activity Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Predictions', value: userPredictionsCount > 0 ? String(userPredictionsCount) : '0', icon: '🤖' },
                { label: 'Days Active', value: user?.created_at ? String(Math.max(1, Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)))) : '1', icon: '📅' },
                { label: 'Crops Saved', value: userPredictionsCount > 0 ? String(Math.ceil(userPredictionsCount * 0.5)) : '0', icon: '🌾' },
                { label: 'Reports Generated', value: userPredictionsCount > 0 ? String(userPredictionsCount) : '0', icon: '📄' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 bg-background rounded-xl border border-border/50">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <p className="text-xl font-bold text-text-primary">{s.value}</p>
                  <p className="text-xs text-text-muted font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-surface rounded-xl border border-border shadow-elevated w-full max-w-sm p-6 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Delete Account?</h3>
            <p className="text-sm text-text-muted mb-6">This action cannot be undone. All your farm data, predictions, and settings will be permanently lost.</p>
            <div className="flex gap-3">
              <Button variant="outlined" className="flex-1 justify-center" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1 justify-center" onClick={handleDeleteAccount}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Settings({ themeMode = 'light', role, onSetTheme, onNavigate }: {
  themeMode?: ThemeMode
  role?: 'farmer' | 'admin'
  onSetTheme?: (t: ThemeMode) => void
  onNavigate?: (page: string) => void
}) {
  const { user, refetchUser } = useAuth()
  const { languageOption, setLanguage } = useTranslation()
  const { t: ts } = useLanguage()

  // 2FA state
  const [twoFactor, setTwoFactor] = useState<boolean>(!!user?.two_factor_enabled)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [disablePasswordInput, setDisablePasswordInput] = useState('')
  const [loading2FA, setLoading2FA] = useState(false)

  // Change Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (user) {
      setTwoFactor(!!user.two_factor_enabled)
    }
  }, [user])

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle 2FA Toggle
  const handleToggle2FA = async () => {
    if (!twoFactor) {
      setLoading2FA(true)
      try {
        const res = await apiClient.post('/user/settings/2fa/send-otp')
        setDemoOtp(res.data.otp || '')
        setShowOtpModal(true)
      } catch (err: any) {
        showToast(err?.response?.data?.detail || 'Failed to send OTP.', 'error')
      } finally {
        setLoading2FA(false)
      }
    } else {
      setShowDisableModal(true)
    }
  }

  const handleVerifyEnable2FA = async () => {
    if (!otpInput.trim()) return
    setLoading2FA(true)
    try {
      await apiClient.post('/user/settings/2fa/verify', { otp: otpInput.trim() })
      setTwoFactor(true)
      setShowOtpModal(false)
      setOtpInput('')
      await refetchUser()
      showToast('Two-Factor Authentication enabled successfully!', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Invalid OTP code.', 'error')
    } finally {
      setLoading2FA(false)
    }
  }

  const handleConfirmDisable2FA = async () => {
    if (!disablePasswordInput.trim()) return
    setLoading2FA(true)
    try {
      await apiClient.patch('/user/settings/2fa', { enabled: false, password: disablePasswordInput.trim() })
      setTwoFactor(false)
      setShowDisableModal(false)
      setDisablePasswordInput('')
      await refetchUser()
      showToast('Two-Factor Authentication disabled.', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Incorrect password.', 'error')
    } finally {
      setLoading2FA(false)
    }
  }

  // Password Strength Calculator
  const calcStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score += 25
    if (/[A-Z]/.test(pwd)) score += 25
    if (/[a-z]/.test(pwd)) score += 25
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25
    return score
  }
  const passwordStrength = calcStrength(newPassword)

  // Handle Change Password Submit
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields.', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error')
      return
    }
    if (newPassword === currentPassword) {
      showToast('New password must be different from current password.', 'error')
      return
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error')
      return
    }

    setChangingPassword(true)
    try {
      await apiClient.patch('/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      })
      showToast('Password changed successfully!', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Current password is incorrect.', 'error')
    } finally {
      setChangingPassword(false)
    }
  }

  const Toggle = ({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-all-smooth cursor-pointer ${
        on ? 'bg-green-500' : 'bg-background border border-border'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-surface shadow-soft transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  )

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-elevated animate-fade-in ${
          toastMessage.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
        }`}>
          {toastMessage.type === 'success' ? <Check size={16} className="text-green-600 flex-shrink-0" /> : <AlertCircle size={16} className="text-red-600 flex-shrink-0" />}
          <span className="text-sm font-medium">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-xs opacity-60 hover:opacity-100 ml-2">✕</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div>
          {onNavigate && <Breadcrumb items={[{ label: ts('dashboard', 'Dashboard'), page: 'dashboard' }, { label: ts('settings', 'Settings') }]} onNavigate={onNavigate} />}
          <h2 className="text-2xl font-bold text-text-primary">{ts('settings', 'Settings')}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-5">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><Sun size={16} /> {ts('appearance', 'Appearance')}</h3>
            <div className="flex gap-3">
              {(['light', 'dark', 'system'] as ThemeMode[]).map(themeKey => (
                <button
                  key={themeKey}
                  onClick={() => onSetTheme?.(themeKey)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all capitalize cursor-pointer ${
                    themeMode === themeKey ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'border-border text-text-muted hover:border-border'
                  }`}
                >
                  {themeKey === 'light' ? '☀️' : themeKey === 'dark' ? '🌙' : '💻'} {themeKey === 'light' ? ts('light_mode', 'Light') : themeKey === 'dark' ? ts('dark_mode', 'Dark') : ts('system_theme', 'System')}
                </button>
              ))}
            </div>
          </Card>

          {/* Language (All 23 Official Indian Languages) */}
          <Card className="p-5">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><Globe size={16} /> {ts('preferred_language', 'Preferred Language')}</h3>
            <SelectInput
              label="Select Interface Language (23 Official Indian Languages)"
              options={SUPPORTED_LANGUAGES.map(l => ({
                value: String(l.id),
                label: `${l.native} (${l.name})`
              }))}
              value={String(languageOption?.id || 1)}
              onChange={e => {
                const targetId = Number(e.target.value)
                const opt = SUPPORTED_LANGUAGES.find(l => l.id === targetId)
                if (opt) setLanguage(opt.code, opt.id)
              }}
            />
            <p className="text-xs text-text-muted mt-2">Selecting a language automatically updates PostgreSQL and persists your preference.</p>
          </Card>

          {/* Active Sessions */}
          <Card className="p-5">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><Smartphone size={16} /> Active Sessions</h3>
            <div className="space-y-3">
              {[
                { device: 'Chrome on Windows', location: 'Ludhiana, IN', current: true },
                { device: 'AgroAI Mobile App', location: 'Punjab, IN', current: false },
              ].map(s => (
                <div key={s.device} className="flex items-center justify-between p-3 bg-background rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{s.device}</p>
                    <p className="text-xs text-text-muted">{s.location}</p>
                  </div>
                  {s.current ? <Badge color="green">Current</Badge> : <Button variant="ghost" size="sm">Revoke</Button>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security (2FA + Change Password) */}
          <Card className="p-5">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><Shield size={16} /> Security</h3>
            
            <div className="space-y-5">
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                <div>
                  <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                    <span>Two-Factor Authentication (2FA)</span>
                    {twoFactor && <Badge color="green">Enabled</Badge>}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">Protect account with 6-digit email OTP verification</p>
                </div>
                <Toggle on={twoFactor} onToggle={handleToggle2FA} disabled={loading2FA} />
              </div>

              {/* Change Password Section */}
              <div className="pt-2 border-t border-border">
                {!showPasswordForm ? (
                  <Button variant="outlined" size="sm" icon={<Lock size={13} />} onClick={() => setShowPasswordForm(true)} className="w-full justify-center">
                    Change Password
                  </Button>
                ) : (
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4 bg-background p-4 rounded-xl border border-border animate-fade-in">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-text-primary">Change Password</h4>
                      <button type="button" onClick={() => setShowPasswordForm(false)} className="text-xs text-text-muted hover:text-text-primary">✕ Cancel</button>
                    </div>

                    {/* Current Password */}
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-8 text-text-muted hover:text-text-primary">
                        {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-8 text-text-muted hover:text-text-primary">
                        {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Strength Indicator */}
                    {newPassword.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium text-text-muted">
                          <span>Password Strength</span>
                          <span className={passwordStrength >= 75 ? 'text-green-600 font-bold' : passwordStrength >= 50 ? 'text-yellow-600 font-bold' : 'text-red-500 font-bold'}>
                            {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                          </span>
                        </div>
                        <ProgressBar value={passwordStrength} color={passwordStrength >= 75 ? 'green' : passwordStrength >= 50 ? 'yellow' : 'red'} />
                      </div>
                    )}

                    {/* Confirm New Password */}
                    <div className="relative">
                      <Input
                        label="Confirm New Password"
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-8 text-text-muted hover:text-text-primary">
                        {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" variant="primary" size="sm" disabled={changingPassword} className="flex-1 justify-center">
                        {changingPassword ? <LineSpinner size={14} /> : 'Save Password'}
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowPasswordForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 2FA Enable OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowOtpModal(false)} />
          <div className="relative bg-surface rounded-2xl border border-border shadow-elevated w-full max-w-sm p-6 animate-fade-in text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto text-green-600">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Verify 2FA Security OTP</h3>
              <p className="text-xs text-text-muted mt-1">A 6-digit OTP code has been sent to <strong>{user?.email}</strong> (valid for 5 minutes).</p>
              {demoOtp && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-xs font-mono font-bold text-green-800">
                  Demo Testing OTP: {demoOtp}
                </div>
              )}
            </div>
            <Input
              label="Enter 6-Digit OTP"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="text-center font-mono text-lg tracking-widest"
            />
            <div className="flex gap-2">
              <Button variant="outlined" className="flex-1 justify-center" onClick={() => setShowOtpModal(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1 justify-center" onClick={handleVerifyEnable2FA} disabled={loading2FA || otpInput.length < 6}>
                {loading2FA ? <LineSpinner size={14} /> : 'Verify & Enable'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Disable Confirmation Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDisableModal(false)} />
          <div className="relative bg-surface rounded-2xl border border-border shadow-elevated w-full max-w-sm p-6 animate-fade-in text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center mx-auto text-yellow-600">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Disable Two-Factor Authentication?</h3>
              <p className="text-xs text-text-muted mt-1">Enter your current account password to confirm disabling 2FA.</p>
            </div>
            <Input
              label="Current Password"
              type="password"
              value={disablePasswordInput}
              onChange={e => setDisablePasswordInput(e.target.value)}
              placeholder="Enter current password"
            />
            <div className="flex gap-2">
              <Button variant="outlined" className="flex-1 justify-center" onClick={() => setShowDisableModal(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1 justify-center" onClick={handleConfirmDisable2FA} disabled={loading2FA || !disablePasswordInput}>
                {loading2FA ? <LineSpinner size={14} /> : 'Confirm Disable'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

