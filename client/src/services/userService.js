import api from './api';

const userService = {
  updatePreferences: async (preferencesData) => {
    const response = await api.put('/users/preferences', preferencesData);
    return response.data;
  }
};

export default userService;

