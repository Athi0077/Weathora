const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';

const normalizeCurrentWeather = (data) => {
  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    cloudiness: data.clouds.all,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };
};

const normalizeForecast = (data) => {
  return data.list.map(item => ({
    dt: item.dt,
    dateText: item.dt_txt,
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    condition: item.weather[0].main,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    rainChance: Math.round((item.pop || 0) * 100),
  }));
};

const getCurrentWeather = async (lat, lon) => {
  if (!lat || !lon) throw new Error('Latitude and longitude are required');
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric' }
    });
    return normalizeCurrentWeather(response.data);
  } catch (error) {
    console.error('Weather API Error (Current):', error.response?.data || error.message);
    throw new Error('Failed to fetch current weather data');
  }
};

const getForecast = async (lat, lon) => {
  if (!lat || !lon) throw new Error('Latitude and longitude are required');
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric' }
    });
    return normalizeForecast(response.data);
  } catch (error) {
    throw new Error('Failed to fetch forecast data');
  }
};

const searchLocations = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: OPENWEATHER_API_KEY }
    });
    
    return response.data.map(loc => ({
      name: loc.name,
      state: loc.state || '',
      country: loc.country,
      latitude: loc.lat,
      longitude: loc.lon
    }));
  } catch (error) {
    throw new Error('Failed to search locations');
  }
};

const reverseGeocode = async (lat, lon) => {
  if (!lat || !lon) throw new Error('Latitude and longitude are required');
  try {
    const response = await axios.get(`${GEO_URL}/reverse`, {
      params: { lat, lon, limit: 1, appid: OPENWEATHER_API_KEY }
    });
    
    if (response.data.length === 0) {
      return null;
    }
    
    const loc = response.data[0];
    return {
      name: loc.name,
      state: loc.state || '',
      country: loc.country,
      latitude: loc.lat,
      longitude: loc.lon
    };
  } catch (error) {
    throw new Error('Failed to reverse geocode coordinates');
  }
};

const getCompleteWeatherData = async (lat, lon) => {
  if (!lat || !lon) throw new Error('Latitude and longitude are required');
  try {
    const [current, forecast, locationData] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon),
      reverseGeocode(lat, lon)
    ]);
    
    return {
      location: locationData,
      current,
      forecast
    };
  } catch (error) {
    console.error('Weather API Error (Complete):', error.response?.data || error.message);
    throw new Error('Failed to fetch complete weather data');
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  searchLocations,
  reverseGeocode,
  getCompleteWeatherData,
};
