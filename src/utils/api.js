// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// ✅ Request interceptor - không import authService
API.interceptors.request.use(
  (config) => {
    // ✅ Lấy token trực tiếp từ localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - handle refresh token
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (token expired) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Access token expired, attempting to refresh...');
        
        // ✅ Gọi refresh trực tiếp bằng axios (không qua authService)
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true ,
            timeout: 10000
          }
        );
        
        const { accessToken } = refreshResponse.data;
        
        if (accessToken) {
          // Update token
          localStorage.setItem('access_token', accessToken);
          
          // Update header cho request ban đầu
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          console.log('✅ Token refreshed successfully');
          
          // Retry request ban đầu
          return API(originalRequest);
        }else {
          throw new Error('No access token in refresh response');
        }
        
      } catch (refreshError) {
        console.error('❌ Refresh token failed:', refreshError);
        
       // Clear tokens và redirect
        localStorage.removeItem('access_token');
        
        // Có thể dispatch logout event hoặc redirect
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;