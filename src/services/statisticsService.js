import api from '../utils/api';
import { STATISTICS_ENDPOINTS } from '@/config/endpoints';

/**
 * Get public statistics for landing page (no auth required)
 */
export const getPublicStatistics = async () => {
  try {
    const response = await api.get(STATISTICS_ENDPOINTS.PUBLIC);
    return response.data;
  } catch (error) {
    console.error('Error fetching public statistics:', error);
    throw error;
  }
};

