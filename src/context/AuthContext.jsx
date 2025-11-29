import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // OTP states
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [pendingPasswordReset, setPendingPasswordReset] = useState(null);

  useEffect(() => {
    checkAuth();

    // ✅ Listen for logout events từ interceptor
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      setPendingRegistration(null);
      setPendingPasswordReset(null);
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const checkAuth = async () => {

    try {

      const token = authService.getToken();
      //  Kiểm tra có access token không
      if (!token) {
        const response = await authService.getCurrentUser();
        const userData = response.data?.user || response.user || response;
        if (userData){
          setUser(userData);
          setIsAuthenticated(true);
        }
        return;
      }

      // ✅ Thử lấy thông tin user (sẽ auto refresh nếu access token expired)
      const response = await authService.getCurrentUser();
      const userData = response.data?.user || response.user || response;

      setUser(userData);
      setIsAuthenticated(true);

    } catch (error) {
      console.error('❌ CheckAuth error:', error);

      //  Clear access token nếu không thể authenticate
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };


  const login = async (credentials) => {
    try {

      const response = await authService.login(credentials);

    

      // Check if token was saved
      const savedToken = authService.getToken();

      const userData = response.data?.user || response.user || response;

      if (userData && (userData.userName || userData.email)) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.warn('⚠️ No user data in login response, trying to fetch...');
        // Fallback: fetch user data if login successful but no user data
        if (savedToken) {
          await checkAuth();
        }
      }

      return response;
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      throw error;
    }
  };

  // Register Step 1: Send registration data
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setPendingRegistration({ email: userData.email, ...response });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Register Step 2: Verify OTP
  const verifyRegistrationOTP = async (otp) => {
    try {
      const response = await authService.verifyRegisterOTP({
        email: otp.email,
        otp: otp.otp
      });
      setPendingRegistration(null);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Resend Registration OTP
  const resendRegistrationOTP = async (dataEmailUserName) => {
    try {
     
      if (!dataEmailUserName?.email || !dataEmailUserName?.userName) {
        throw new Error('Không có email để gửi OTP');
      }
      const response = await authService.resendRegisterOTP(dataEmailUserName);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Forgot Password Step 1: Send OTP
  const sendForgotPasswordOTP = async (email) => {
    try {
      const response = await authService.sendForgotPasswordOTP(email);
      setPendingPasswordReset({ email, ...response });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Forgot Password Step 2: Verify OTP
  const verifyForgotPasswordOTP = async (otp) => {
    try {
      const response = await authService.verifyForgotPasswordOTP({
        email: pendingPasswordReset.email,
        otp: otp
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (newPassword, resetToken) => {
    try {
      const response = await authService.resetPassword({
        password: newPassword,
        token: resetToken
      });
      setPendingPasswordReset(null);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refreshUserToken = async () => {
    try {

      const response = await authService.refreshToken();

      return response;
    } catch (error) {
      console.error('❌ AuthContext: Manual refresh failed:', error);

      // Logout if refresh fails
      await logout();
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      setPendingRegistration(null);
      setPendingPasswordReset(null);
    }
  };
  const onBoarding = async (userName) => {
    try{
     

      const response = await authService.onBoarding(userName);

      

      // Check if token was saved
      const savedToken = authService.getToken();
   

      const userData = response.data?.user || response.user || response.data;
 

      if (userData && (userData.userName || userData.email)) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.warn('⚠️ No user data in login response, trying to fetch...');
        // Fallback: fetch user data if login successful but no user data
        if (savedToken) {
          await checkAuth();
        }
      }

   
      return response;
    }
    catch (e){
     
      throw e;
    }
  }
  const value = {
    // User state
    user,
    setUser,
    loading,
    isAuthenticated,

    // Auth methods
    login,
    logout,
    checkAuth,
    refreshUserToken,

    // Registration flow
    register,
    verifyRegistrationOTP,
    resendRegistrationOTP,
    pendingRegistration,
    onBoarding,

    // Password reset flow
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetPassword,
    pendingPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};