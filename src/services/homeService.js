import api from '../utils/api';

export const getTrendingTags = async () => {
  try {
    const response = await api.get('/home/trending-tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending tags:', error);
    throw error;
  }
};

export const getTopUsers = async () => {
  try {
    const response = await api.get('/home/top-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching top users:', error);
    throw error;
  }
};

export const getUpcomingContests = async () => {
  try {
    const response = await api.get('/contests/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming contests:', error);
    throw error;
  }
};