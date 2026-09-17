import api from './api';

const aiReportService = {
  getReports: async (page = 1, limit = 20) => {
    const response = await api.get(`/ai-reports?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getReportById: async (id) => {
    const response = await api.get(`/ai-reports/${id}`);
    return response.data.data;
  },
  
  // Dev only
  generateReportNow: async () => {
    const response = await api.post('/dev/generate-report');
    return response.data.data;
  },
  
  // Dev only
  generateAlertsNow: async () => {
    const response = await api.post('/dev/generate-alerts');
    return response.data;
  }
};

export default aiReportService;

