import api from './api';

const notificationService = {
  getNotifications: async (page = 1, limit = 20, isRead) => {
    let url = `/notifications?page=${page}&limit=${limit}`;
    if (isRead !== undefined) {
      url += `&isRead=${isRead}`;
    }
    const response = await api.get(url);
    return response.data;
  },
  
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

export default notificationService;

