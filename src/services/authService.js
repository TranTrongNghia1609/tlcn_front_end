import axios from 'axios';
import API from '../utils/api';
import { AUTH_ENDPOINTS } from '../config/endpoints';
export const authService = {
  login: async (credentials) => {
    try {  
      if (!credentials.userName || !credentials.password) {
        throw new Error('Username và password là bắt buộc');
      }
      
      const response = await API.post(AUTH_ENDPOINTS.LOGIN, {
        userName: credentials.userName.trim(),
        password: credentials.password
      });
      
      
      // Lưu access token
      const  accessToken  = response.data.data.accessToken;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ AuthService Login error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // ✅ Better error handling
      if (error.response?.status === 401) {
        throw { message: 'Username hoặc mật khẩu không đúng' };
      }
      
      if (error.response?.status === 500) {
        throw { message: 'Lỗi server. Vui lòng thử lại sau.' };
      }
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw { message: 'Không thể kết nối đến server' };
      }
      
      if (error.code === 'ECONNABORTED') {
        throw { message: 'Kết nối timeout. Vui lòng thử lại.' };
      }
      
      throw error.response?.data || { 
        message: error.message || 'Đăng nhập thất bại' 
      };
    }
  },
  refreshToken: async () => {
    try {
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      
      const { accessToken } = response.data.data.accessToken;
      
      // Update access token mới
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ AuthService: Refresh token error:', error);
      
      // Clear access token khi refresh thất bại
      localStorage.removeItem('access_token');
      
      throw error.response?.data || { message: 'Refresh token failed' };
    }
  },

  register: async(userData) => {
    try{
      const response = await API.post(AUTH_ENDPOINTS.REGISTER, userData);
      return response.data;
    }catch(error){
      throw error.response?.data || {message: 'Đăng ký thất bại'};
    }
  },
  verifyRegisterOTP: async (otpData) =>{
    try {
      const response = await API.post(AUTH_ENDPOINTS.REGISTER_VERIFY_OTP, otpData);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Xác thực OTP thất bại' };
    }
  },
  // Resend OTP - bạn có thể định nghĩa nhận email string hoặc object
  resendRegisterOTP: async (dataEmailUserName) => {
    try {
      const response = await API.post(AUTH_ENDPOINTS.REGISTER_RESEND_OTP, dataEmailUserName);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gửi lại OTP thất bại' };
    }
  },

  // Logout - không cần tham số
  logout: async () => {
    try {
      
      // Gọi API logout để clear refresh token cookie
      await API.post(AUTH_ENDPOINTS.LOGOUT);
      
      
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Tiếp tục logout dù API có lỗi
    } finally {
      // Clear access token
      localStorage.removeItem('access_token');
    }
  },

  // Get current user - không cần tham số
  getCurrentUser: async () => {
    try {
      
      // const token = localStorage.getItem('access_token');
      // if (!token) {
      //   throw new Error('No access token available');
      // }
      
      const response = await API.get(AUTH_ENDPOINTS.ME);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ AuthService: Get current user error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // ✅ Throw error để AuthContext có thể handle
      throw error.response?.data || { message: 'Failed to get current user' };
    }
  },
  

  // Utility methods - bạn tự định nghĩa tên và logic
  hasToken: () => {
    return !!localStorage.getItem('access_token');
  },

  getToken: () => {
    return localStorage.getItem('access_token');
  },

  removeToken: () => {
    localStorage.removeItem('access_token');
  },

  onBoarding: async (userName) =>{
    try{
      const response = await API.post(AUTH_ENDPOINTS.ONBOARDING, {}, {
        params: {username: userName}
      });
      // Lưu access token
      const  accessToken  = response.data.data.accessToken;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      
      return response.data;
    }
    catch (e){
      throw e;
    }
  }
}