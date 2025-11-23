import { USER_ENDPOINTS } from '../config/endpoints';
import API from '../utils/api';
export const userService ={
  uploadAvatar: async(file) => {
    try{
      const form = new FormData();
      form.append('avatar', file, file.name);

      const response = await API.post(USER_ENDPOINTS.UPLOAD_AVATAR, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    }catch (error) {
      console.error('❌ Update avatar error:', error);
      throw error.response?.data || { message: 'Failed to update avatar' };
  }
  },
   getProfile: async () => {
    try {
      
      const response = await API.get(USER_ENDPOINTS.GET_PROFILE);
      return response.data;
      
    } catch (error) {
      console.error('Get profile error:', error);
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },
  getProfileByUsername: async (username) => {
    try {      
      const response = await API.get(USER_ENDPOINTS.GET_PROFILE(username)); 
      return response.data;
      
    } catch (error) {
      console.error('Get profile by username error:', error);
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {      
      const response = await API.put(USER_ENDPOINTS.UPDATE_PROFILE, profileData);
      return response.data;
      
    } catch (error) {
      console.error(' Update profile error:', error);
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Get user statistics (optional)
  getUserStats: async () => {
    try {
      
      const response = await API.get(USER_ENDPOINTS.GET_USER_STATS);
      return response.data;
      
    } catch (error) {
      console.error('Get stats error:', error);
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  },
  checkUserName: async(username) => {
    try{
      const response = await API.get(USER_ENDPOINTS.CHECK_USERNAME, {
        params: {username: username}
      });
      return response.data;
    }
    catch (error){
      console.error(' Get username check error:', error);
      throw error.response?.data || { message: 'Failed to check' };
    }
  }
}