import api from './api';

const workService = {
  analyzeWork: async (workData) => {
    const response = await api.post('/work/analyze', workData);
    return response.data.data;
  },
  getWorkPlans: async () => {
    const response = await api.get('/work');
    return response.data.data;
  }
};

export default workService;

