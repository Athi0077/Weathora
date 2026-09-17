import api from './api';

const activityService = {
  analyzeActivity: async (activityData) => {
    const response = await api.post('/activity/analyze', activityData);
    return response.data.data;
  },
  getActivities: async () => {
    const response = await api.get('/activity');
    return response.data.data;
  }
};

export default activityService;

