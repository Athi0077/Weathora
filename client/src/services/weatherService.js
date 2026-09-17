import api from './api';

const weatherService = {
  getWeather: async (lat, lon) => {
    const response = await api.get(`/weather`, { params: { lat, lon } });
    return response.data.data;
  },
  
  getCurrentWeather: async (lat, lon) => {
    const response = await api.get(`/weather/current`, { params: { lat, lon } });
    return response.data.data;
  },
  
  getForecast: async (lat, lon) => {
    const response = await api.get(`/weather/forecast`, { params: { lat, lon } });
    return response.data.data;
  },
  
  searchLocations: async (query) => {
    const response = await api.get(`/weather/search`, { params: { q: query } });
    return response.data.data;
  },
  
  reverseGeocode: async (lat, lon) => {
    const response = await api.get(`/weather/reverse`, { params: { lat, lon } });
    return response.data.data;
  },
  
  updateUserLocation: async (location) => {
    const response = await api.put(`/users/location`, location);
    return response.data.data;
  }
};

export default weatherService;

