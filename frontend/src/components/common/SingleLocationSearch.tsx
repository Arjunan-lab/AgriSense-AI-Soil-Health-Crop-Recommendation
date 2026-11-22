import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Clock, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

import { reverseGeocode } from '../../api/location';

interface LocationItem {
  name: string;
  type: string;
  state: string;
  lat?: number;
  lon?: number;
}

const POPULAR_LOCATIONS: LocationItem[] = [
  { name: 'Ludhiana', type: 'District', state: 'Punjab', lat: 30.901, lon: 75.857 },
  { name: 'Amritsar', type: 'City', state: 'Punjab', lat: 31.634, lon: 74.872 },
  { name: 'Karnal', type: 'City', state: 'Haryana', lat: 29.685, lon: 76.990 },
  { name: 'Nashik', type: 'District', state: 'Maharashtra', lat: 19.997, lon: 73.789 },
  { name: 'Guntur', type: 'District', state: 'Andhra Pradesh', lat: 16.306, lon: 80.436 },
  { name: 'Coimbatore', type: 'District', state: 'Tamil Nadu', lat: 11.016, lon: 76.955 },
  { name: 'Indore', type: 'City', state: 'Madhya Pradesh', lat: 22.719, lon: 75.857 },
  { name: 'Patna', type: 'City', state: 'Bihar', lat: 25.594, lon: 85.137 },
];

interface SingleLocationSearchProps {
  onSelectLocation: (location: LocationItem) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SingleLocationSearch: React.FC<SingleLocationSearchProps> = ({
  onSelectLocation,
  placeholder = 'Search Village, Town, City, District, State...',
  className = '',
  autoFocus = false,
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationItem[]>(() => {
    try {
      const saved = localStorage.getItem('agroai_recent_locations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentLocation = (loc: LocationItem) => {
    const updated = [loc, ...recentSearches.filter((item) => item.name !== loc.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('agroai_recent_locations', JSON.stringify(updated));
  };

  const handleSelect = (loc: LocationItem) => {
    setQuery(`${loc.name}, ${loc.state}`);
    saveRecentLocation(loc);
    onSelectLocation(loc);
    setIsOpen(false);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.error(t('Geolocation is not supported by your browser'));
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await reverseGeocode(latitude, longitude);
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            'Detected Location';
          const state = data?.address?.state || 'India';

          const locItem: LocationItem = {
            name: city,
            type: 'Current Location',
            state: state,
            lat: latitude,
            lon: longitude,
          };

          handleSelect(locItem);
          toast.success(t(`Location updated to ${city}`));
        } catch {
          const fallbackLoc: LocationItem = {
            name: 'Current Location',
            type: 'GPS Coordinates',
            state: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            lat: latitude,
            lon: longitude,
          };
          handleSelect(fallbackLoc);
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        toast.error(t('Permission denied or GPS signal unavailable'));
      },
      { timeout: 10000 }
    );
  };

  const filtered = POPULAR_LOCATIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.state.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* SINGLE CLEAN BORDERED INPUT - NO NESTED BORDERS */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-24 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="absolute right-20 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={handleUseGPS}
          disabled={geoLoading}
          className="absolute right-2.5 px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
        >
          {geoLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Navigation className="h-3.5 w-3.5" />
          )}
          <span>{geoLoading ? 'GPS...' : 'GPS'}</span>
        </button>
      </div>

      {/* AUTOCOMPLETE POPOVER */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {/* Use GPS CTA */}
          <button
            type="button"
            onClick={handleUseGPS}
            disabled={geoLoading}
            className="w-full flex items-center space-x-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 transition-colors text-left"
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              {geoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold">{t('Use Current Location')}</p>
              <p className="text-[10px] text-slate-400">Detect GPS position automatically</p>
            </div>
          </button>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {t('Recent Locations')}
              </p>
              {recentSearches.map((item) => (
                <button
                  key={`recent-${item.name}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {item.name}, {item.state}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search Results / Suggestions */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
              {query ? t('Matching Locations') : t('Suggested Districts & Cities')}
            </p>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={`${item.name}-${item.state}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.state}, India</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.type}
                  </span>
                </button>
              ))
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleSelect({
                    name: query,
                    type: 'Custom Location',
                    state: 'India',
                  })
                }
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-bold text-emerald-600 dark:text-emerald-400"
              >
                Use custom location "{query}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleLocationSearch;
