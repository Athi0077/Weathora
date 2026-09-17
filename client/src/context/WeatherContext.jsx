import React, { createContext, useContext, useState, useEffect } from 'react';
import weatherService from '../services/weatherService';
import { useAuth } from './AuthContext';

const WeatherContext = createContext();

export const useWeather = () => {
  return useContext(WeatherContext);
};

export const WeatherProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // On initial load, check if user has a saved location
  useEffect(() => {
    if (user && user.location && user.location.latitude) {
      setLocation(user.location);
    } else if (user) {
      // Done loading if no location to fetch for
      setLoading(false);
    }
  }, [user]);
  
  // Fetch weather whenever location changes
  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      refreshWeather();
    }
  }, [location]);

  const refreshWeather = async () => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getWeather(location.latitude, location.longitude);
      setWeatherData(data);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to load weather data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = async (newLocation) => {
    try {
      // Optimistically update location for UI
      setLocation(newLocation);
      setLoading(true);
      setError(null);
      
      // Save to backend
      const updatedLoc = await weatherService.updateUserLocation(newLocation);
      
      // Fetch new weather
      const data = await weatherService.getWeather(updatedLoc.latitude, updatedLoc.longitude);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to update location or fetch weather');
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get name
          const revLocation = await weatherService.reverseGeocode(latitude, longitude);
          
          if (revLocation) {
            await selectLocation(revLocation);
          } else {
            // Fallback if reverse geocode fails but we have coords
            await selectLocation({
              name: 'Current Location',
              latitude,
              longitude
            });
          }
        } catch (err) {
          setError('Failed to process current location');
          setLoading(false);
        }
      },
      (err) => {
        setError('Location access was denied. Search for your city instead.');
        setLoading(false);
      }
    );
  };

  const value = {
    location,
    weatherData,
    loading,
    error,
    refreshWeather,
    selectLocation,
    useCurrentLocation
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

