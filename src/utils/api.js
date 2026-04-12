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
// Hàm giải mã JWT và lấy thời gian hết hạn
const getTokenExpirationTime = (token) => {
  if(!token) return null;
  try{
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.exp * 1000;
  } catch(error) {
    console.error('Lỗi khi giải mã token: ', error);
    return null;
  }
};
const shouldRefreshToken = (token) => {
  const expirationTime = getTokenExpirationTime(token);
  if(!expirationTime) return false;
  const currentTime = Date.now();
  const fiveMinutesInMs = 5*60*1000;
  //Trả về true nếu còn ít hơn 5 phút
  return expirationTime - currentTime < fiveMinutesInMs;
}

const refreshTokenIfNeeded = async() => {
  const token = localStorage.getItem('access_token');
  if(token && shouldRefreshToken(token)){
    try{
      const refreshResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        {withCredentials: true, timeout: 10000}
      );

      const accessToken = refreshResponse.data.data.accessToken;
      if(accessToken) {
        localStorage.setItem('access_token', accessToken);
        return accessToken;
      }
    } catch(error){
      console.error('Làm mới token chủ động thất bại:', error);
      if(error.response?.status === 401){
        localStorage.removeItem('access_token');
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
  }
  return token;
};

const startTokenRefreshTimer = () => {
  const checkInterval = 60*1000;
  setInterval(async () => {
    await refreshTokenIfNeeded();
  }, checkInterval);
};

startTokenRefreshTimer();

// Request interceptor với chức năng làm mới chủ động
API.interceptors.request.use(
  async (config) => {
    // Thử làm mới token nếu cần trước khi thực hiện request

    const token = await refreshTokenIfNeeded();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý dự phòng cho token hết hạn
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
        
        // Gọi refresh trực tiếp bằng axios (không qua authService)
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true ,
            timeout: 10000
          }
        );
        
        const accessToken  = refreshResponse.data.data.accessToken;
        
        if (accessToken) {
          // Update token
          localStorage.setItem('access_token', accessToken);
          
          // Update header cho request ban đầu
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    
          // Retry request ban đầu
          return API(originalRequest);
        }else {
          throw new Error('No access token in refresh response');
        }
        
      } catch (refreshError) {
        console.error(' Refresh token failed:', refreshError);
        
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