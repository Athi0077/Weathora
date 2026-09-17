import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import weatherService from '../../services/weatherService';

const DestinationSearch = ({ value, onChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Sync initial value if provided
    if (value && value.name) {
      setQuery(`${value.name}${value.state ? `, ${value.state}` : ''}`);
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Only search if user is actively typing and not just reflecting the selected value
      if (query.trim().length > 2 && (!value || query !== `${value.name}${value.state ? `, ${value.state}` : ''}`)) {
        setIsSearching(true);
        try {
          const locs = await weatherService.searchLocations(query);
          setResults(locs);
          setShowDropdown(true);
        } catch (err) {
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, value]);

  const handleSelect = (loc) => {
    onChange(loc);
    setQuery(`${loc.name}${loc.state ? `, ${loc.state}` : ''}`);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (value) {
      // Clear selection if they start typing something else
      onChange(null);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-dim" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          placeholder="Where are you going?"
          className="w-full bg-surface border border-default rounded-xl pl-12 pr-4 py-3.5 text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-3.5 text-primary-500 animate-spin" size={20} />
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-default rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
          {results.map((loc, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-surface-hover border-b border-default last:border-0 transition-colors"
            >
              <MapPin size={18} className="text-primary-400 flex-shrink-0" />
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
    </div>
  );
};

export default DestinationSearch;

