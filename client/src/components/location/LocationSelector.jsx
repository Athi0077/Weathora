import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Navigation, AlertCircle } from 'lucide-react';
import weatherService from '../../services/weatherService';
import { useWeather } from '../../context/WeatherContext';

const LocationSelector = ({ onLocationSelected }) => {
  const { selectLocation, useCurrentLocation, loading, error } = useWeather();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        setSearchError(null);
        try {
          const locs = await weatherService.searchLocations(query);
          setResults(locs);
        } catch (err) {
          setSearchError('Failed to search locations');
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (loc) => {
    await selectLocation(loc);
    if (onLocationSelected) {
      onLocationSelected();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-surface rounded-2xl shadow-xl overflow-hidden border border-default">
      <div className="p-6 text-center border-b border-default bg-background">
        <h2 className="text-xl font-bold text-main">Choose your location</h2>
        <p className="text-sm text-sub mt-1">We need your location to show relevant weather data.</p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start space-x-3 text-sm">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={useCurrentLocation}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-surface hover:bg-surface text-white p-3.5 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Navigation size={18} />
          )}
          <span>{loading ? 'Locating...' : 'Use Current Location'}</span>
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-default"></div>
          <span className="flex-shrink-0 mx-4 text-dim text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-default"></div>
        </div>

        <div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-dim" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city..."
              className="w-full bg-background border border-default rounded-xl pl-11 pr-4 py-3 text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-3.5 text-primary-500 animate-spin" size={18} />
            )}
          </div>
          
          {searchError && (
            <p className="text-red-500 text-sm mt-2 ml-1">{searchError}</p>
          )}

          {results.length > 0 && (
            <div className="mt-3 border border-default rounded-xl overflow-hidden shadow-sm bg-surface">
              {results.map((loc, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-surface-hover border-b border-default last:border-0 transition-colors"
                >
                  <MapPin size={18} className="text-dim" />
                  <div>
                    <p className="font-medium text-main">{loc.name}</p>
                    <p className="text-xs text-sub">
                      {loc.state ? `${loc.state}, ` : ''}{loc.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {query.length > 2 && !isSearching && results.length === 0 && !searchError && (
            <p className="text-sub text-sm mt-4 text-center">No locations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;

