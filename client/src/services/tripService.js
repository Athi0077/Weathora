import api from './api';

const tripService = {
  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data.data;
  },
  
  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data.data;
  },
  
  getTrip: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data.data;
  },
  
  updateTrip: async (id, tripData) => {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data.data;
  },
  
  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data.data;
  },
  
  analyzeTrip: async (id) => {
    const response = await api.post(`/trips/${id}/analyze`);
    return response.data.data;
  },

  generateItinerary: async (id) => {
    const response = await api.post(`/trips/${id}/itinerary`);
    return response.data.data;
  },

  regenerateItinerary: async (id) => {
    const response = await api.post(`/trips/${id}/itinerary/regenerate`);
    return response.data.data;
  }
};

export default tripService;

