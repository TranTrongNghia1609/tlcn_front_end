import api from '../utils/api';

const broadcastService = {
  /**
   * Lấy danh sách broadcasts
   */
  getBroadcasts: async (params = {}) => {
    try {
      const response = await api.get('/broadcasts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      throw error;
    }
  },

  /**
   * Đánh dấu broadcast đã xem
   */
  markAsSeen: async (broadcastId) => {
    try {
      const response = await api.post(`/broadcasts/${broadcastId}/seen`);
      return response.data;
    } catch (error) {
      console.error('Error marking broadcast as seen:', error);
      throw error;
    }
  },

  /**
   * Dismiss broadcast
   */
  dismissBroadcast: async (broadcastId) => {
    try {
      const response = await api.post(`/broadcasts/${broadcastId}/dismiss`);
      return response.data;
    } catch (error) {
      console.error('Error dismissing broadcast:', error);
      throw error;
    }
  },

  /**
   * Đếm số broadcasts chưa xem
   */
  getUnseenCount: async () => {
    try {
      const response = await api.get('/broadcasts/unseen-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unseen count:', error);
      throw error;
    }
  }
};

export default broadcastService;