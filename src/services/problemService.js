import axios from 'axios';
import API from '../utils/api';
import { PROBLEM_ENDPOINTS } from '../config/endpoints';
export const problemService = {
  getProblemById: async (id) =>{
    try{
        console.log('Get problem by Id 🆔');
        const data = await API.get(PROBLEM_ENDPOINTS.GET_PROBLEM_SHORT_ID(id));
        console.log('Problem data: ', data);
        const payload = data.data;
        return payload;
    }
    catch(err){
        console.log('Get problem error: ', err);
        throw err;
    }
  }
}

export const getProblems = async (params) => {
  try {
    console.log('Fetch problems with params:', params);
    const response = await API.get(PROBLEM_ENDPOINTS.GET_PROBLEMS, { params });
    console.log('Fetched problems:', response.data);
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