import axios from 'axios';
import API from '../utils/api';
import { PROBLEM_ENDPOINTS } from '../config/endpoints';
export const problemService = {
  getProblemById: async (id) => {
    try {
      const data = await API.get(PROBLEM_ENDPOINTS.GET_PROBLEM_SHORT_ID(id));
      const payload = data.data;
      return payload;
    } catch (err) {
      console.log('Get problem error: ', err);
      
      // Extract error message from API response
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to fetch problem';
      
      const errorStatus = err.response?.status;
      
      // Throw error with message and status
      const error = new Error(errorMessage);
      error.status = errorStatus;
      error.originalError = err;
      
      throw error;
    }
  }
}

export const getProblems = async (params) => {
  try {
    const response = await API.get(PROBLEM_ENDPOINTS.GET_PROBLEMS, { params });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching problems:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { message: error.message || 'Error fetching problems' };
  }
}