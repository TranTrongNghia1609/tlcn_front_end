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
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        const response = await authService.getCurrentUser();
        const userData = response.data?.user || response.user || response;
        console.log('🔍 CheckAuth user data:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
       console.log('🔍 Login response:', response);
    console.log('🔍 User data:', response.data?.user);
      const userData = response.data?.user || response.user || response; 
      console.log('🔍 Setting user data:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
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
      setUser(response.user);
      setIsAuthenticated(true);
      setPendingRegistration(null);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Resend Registration OTP
  const resendRegistrationOTP = async () => {
    try {
      if (!pendingRegistration?.email) {
        throw new Error('Không có email để gửi OTP');
      }
      const response = await authService.resendRegisterOTP(pendingRegistration.email);
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

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setPendingRegistration(null);
      setPendingPasswordReset(null);
    }
  };

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
    
    // Registration flow
    register,
    verifyRegistrationOTP,
    resendRegistrationOTP,
    pendingRegistration,
    
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