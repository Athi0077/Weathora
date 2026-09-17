import logoImg from '../assets/logo.png';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Cloud, Search, MapPin, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location states
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Debounced search effect
  React.useEffect(() => {
    const searchLocation = async () => {
      if (locationQuery.length < 3) {
        setLocationResults([]);
        return;
      }

      setIsSearchingLocation(true);
      setLocationSearchError('');
      
      try {
        const response = await api.get(`/weather/search?q=${encodeURIComponent(locationQuery)}`);
        // Backend returns { success: true, data: [...] }
        setLocationResults(response.data.data || []);
      } catch (err) {
        setLocationSearchError('Unable to search locations. Please try again.');
      } finally {
        setIsSearchingLocation(false);
      }
    };

    const debounceTimer = setTimeout(searchLocation, 500);
    return () => clearTimeout(debounceTimer);
  }, [locationQuery]);

  const handleCurrentLocation = () => {
    setLocationSearchError('');
    setIsSearchingLocation(true);

    if (!navigator.geolocation) {
      setLocationSearchError('Geolocation is not supported by your browser.');
      setIsSearchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await api.get(`/weather/reverse?lat=${latitude}&lon=${longitude}`);
          if (response.data && response.data.success && response.data.data.name) {
            setSelectedLocation(response.data.data);
            setLocationQuery('');
            setLocationResults([]);
          } else {
            setLocationSearchError('Unable to detect your city name.');
          }
        } catch (err) {
          setLocationSearchError('Unable to detect your location. Please search manually.');
        } finally {
          setIsSearchingLocation(false);
        }
      },
      () => {
        setLocationSearchError('Location access was denied. Please search for your city instead.');
        setIsSearchingLocation(false);
      }
    );
  };

  const selectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationQuery('');
    setLocationResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!selectedLocation) {
      if (locationQuery) {
        setError('Please select a location from the search results.');
      } else {
        setError('Please select your location.');
      }
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password, selectedLocation);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
          <img src={logoImg} alt="Weathora Logo" className="w-12 h-12 object-contain" />
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-main tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-sub">
          Start planning smarter with Weathora.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-default">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-main">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-default rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-main">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-default rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-main">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-default rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-dim hover:text-sub focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-main">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-default rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="pt-2 border-t border-default">
              <label className="block text-sm font-medium text-main mb-2">
                Location
              </label>
              
              {!selectedLocation ? (
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-dim" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search your city or location"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-default rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {isSearchingLocation && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Loader2 className="h-4 w-4 text-dim animate-spin" />
                      </div>
                    )}

                    {locationResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-surface shadow-lg rounded-md border border-default max-h-60 overflow-auto">
                        {locationResults.map((loc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectLocation(loc)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-surface-hover focus:bg-background outline-none flex flex-col border-b border-default last:border-0"
                          >
                            <span className="font-medium text-main">{loc.name}</span>
                            <span className="text-xs text-sub">
                              {loc.state ? `${loc.state}, ` : ''}{loc.country}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {locationQuery.length >= 3 && locationResults.length === 0 && !isSearchingLocation && !locationSearchError && (
                    <p className="text-sm text-sub px-2">No locations found.</p>
                  )}

                  {locationSearchError && (
                    <p className="text-sm text-red-500 px-2">{locationSearchError}</p>
                  )}

                  <div className="relative flex items-center justify-center py-2">
                    <span className="bg-surface px-2 text-xs text-dim">OR</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCurrentLocation}
                    disabled={isSearchingLocation}
                    className="w-full flex justify-center items-center py-2 px-4 border border-default rounded-lg shadow-sm text-sm font-medium text-main bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70"
                  >
                    <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                    Use Current Location
                  </button>
                </div>
              ) : (
                <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-main">{selectedLocation.name}</p>
                      <p className="text-xs text-sub">
                        {selectedLocation.state ? `${selectedLocation.state}, ` : ''}{selectedLocation.country}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedLocation(null)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium ml-4"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-default" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-sub">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


