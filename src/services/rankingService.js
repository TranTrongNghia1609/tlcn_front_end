import API from '../utils/api';
import { RANKING_ENDPOINTS } from '../config/endpoints';

/**
 * rankingService.js
 * Service giao tiếp với Ranking API endpoints.
 */
export const rankingService = {
  /**
   * Lấy bảng xếp hạng toàn hệ thống
   * @param {Object} params - { page, limit, search, rankFilter }
   */
  getLeaderboard: async (params = {}) => {
    try {
      const response = await API.get(RANKING_ENDPOINTS.GET_LEADERBOARD, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch leaderboard' };
    }
  },

  /**
   * Lấy thông tin Elo của một user
   * @param {string} userId
   */
  getUserRating: async (userId) => {
    try {
      const response = await API.get(RANKING_ENDPOINTS.GET_USER_RATING(userId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user rating' };
    }
  },

  /**
   * Lấy lịch sử thay đổi Elo của user
   * @param {string} userId
   * @param {Object} params - { page, limit }
   */
  getUserRatingHistory: async (userId, params = {}) => {
    try {
      const response = await API.get(
        RANKING_ENDPOINTS.GET_USER_RATING_HISTORY(userId),
        { params }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch rating history' };
    }
  },

  /**
   * Kích hoạt tính Elo cho contest (Admin/Teacher only)
   * @param {string} contestId
   */
  calculateContestRating: async (contestId) => {
    try {
      const response = await API.post(
        RANKING_ENDPOINTS.CALCULATE_CONTEST_RATING(contestId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to calculate contest rating' };
    }
  },
};
