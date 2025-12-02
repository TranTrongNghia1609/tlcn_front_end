import api from '../utils/api';

const notificationService = {
  // Lấy danh sách thông báo
  getNotifications: async (params = {}) => {
    const { page = 1, limit = 20, isRead, type } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(isRead !== undefined && { isRead: isRead.toString() }),
      ...(type && { type })
    });

    const response = await api.get(`/notifications?${queryParams}`);
    return response.data;
  },

  // Đếm số thông báo chưa đọc
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Đánh dấu 1 thông báo đã đọc
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Xóa 1 thông báo
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Xóa tất cả thông báo đã đọc
  deleteAllRead: async () => {
    const response = await api.delete('/notifications/read');
    return response.data;
  }
};

export default notificationService;