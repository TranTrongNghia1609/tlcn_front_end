import API from '../utils/api';
import { AUTH_ENDPOINTS } from '../config/endpoints';
export const authService = {
  login: async (credentials) => {
    try {
      console.log('🚀 Sending login request:', {
        url: AUTH_ENDPOINTS.LOGIN,
        credentials: credentials,
        baseURL: import.meta.env.VITE_API_BASE_URL
      });

      const response = await API.post(AUTH_ENDPOINTS.LOGIN, credentials);
      
      console.log('✅ Login response:', response.data);

      // Kiểm tra cả accessToken và token
      if (response.data.accessToken) {
        localStorage.setItem('auth_token', response.data.accessToken);
      } else if (response.data.accessToken) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;

    } catch (error) {
      console.error('❌ Login error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      throw error.response?.data || { message: 'Đăng nhập thất bại - Kiểm tra server' };
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
  resendRegisterOTP: async (email) => {
    try {
      const response = await API.post(AUTH_ENDPOINTS.REGISTER_RESEND_OTP, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gửi lại OTP thất bại' };
    }
  },

  // Logout - không cần tham số
  logout: async () => {
    try {
      await API.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  // Get current user - không cần tham số
  getCurrentUser: async () => {
    try {
      const response = await API.get(AUTH_ENDPOINTS.ME);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy thông tin người dùng' };
    }
  },
  

  // Utility methods - bạn tự định nghĩa tên và logic
  hasToken: () => {
    return !!localStorage.getItem('auth_token');
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  removeToken: () => {
    localStorage.removeItem('auth_token');
  }
}