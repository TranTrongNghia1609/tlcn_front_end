import React, { createContext, useContext, useState } from 'react';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, setUser } = useAuth(); // Lấy user từ AuthContext
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Update avatar
  const updateAvatar = async (avatarUrl) => {
    try {
      setUploading(true);
      console.log('🔄 UserContext: Updating avatar...');
      
      const response = await userService.uploadAvatar(avatarUrl);
      
      // Update user in AuthContext
      const updatedUser = response.data?.user || response.user;
      if (updatedUser) {
        setUser(updatedUser);
        console.log('✅ UserContext: Avatar updated, user state synced');
      }
      
      return response;
      
    } catch (error) {
      console.error('❌ UserContext: Update avatar failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // ✅ Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      console.log('🔄 UserContext: Updating profile...');
      
      const response = await userService.updateProfile(profileData);
      
      // Update user in AuthContext
      const updatedUser = response.data?.user || response.user;
      if (updatedUser) {
        setUser(updatedUser);
        console.log('✅ UserContext: Profile updated, user state synced');
      }
      
      return response;
      
    } catch (error) {
      console.error('❌ UserContext: Update profile failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh user profile
  const refreshProfile = async () => {
    try {
      setLoading(true);
      console.log('🔄 UserContext: Refreshing profile...');
      
      const response = await userService.getProfile();
      
      const userData = response.data?.user || response.user;
      if (userData) {
        setUser(userData);
        console.log('✅ UserContext: Profile refreshed');
      }
      
      return response;
      
    } catch (error) {
      console.error('❌ UserContext: Refresh profile failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get user statistics
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  const getUserStats = async () => {
    try {
      setStatsLoading(true);
      console.log('📊 UserContext: Getting user stats...');
      
      const response = await userService.getUserStats();
      
      const stats = response.data?.stats || response.stats;
      setUserStats(stats);
      console.log('✅ UserContext: Stats fetched');
      
      return response;
      
    } catch (error) {
      console.error('❌ UserContext: Get stats failed:', error);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  };

  const value = {
    // User data (from AuthContext)
    user,
    
    // Loading states
    loading,
    uploading,
    statsLoading,
    
    // User stats
    userStats,
    
    // User methods
    updateAvatar,
    updateProfile,
    refreshProfile,
    getUserStats,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};