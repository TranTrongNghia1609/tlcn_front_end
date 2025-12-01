import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserInfo from '../components/profile/UserInfo';
import EditProfile from '../components/profile/EditProfile';
import { Card } from '@/components/ui/card';
import SubmissionCalendar from '@/components/submission/SubmissionCalendar';
import { userService } from '@/services/userService';
import SubmissionPieChart from '@/components/submission/SubmissionPieChart';
import DifficultyChart from '@/components/submission/DifficultyChart';
import SubmissionRecent from '@/components/submission/SubmissionRecent';
import { authService } from '@/services/authService';

const Profile = () => {
  const { userName } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const isGoogle = query.get("isGoogle");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const targetUsername = userName || user?.userName;
        
        if (!targetUsername) {
          setError('No username provided');
          return;
        }

        const response = await userService.getProfileByUsername(targetUsername);
        if (response.success) {
          setProfileData(response.data);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        setError(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    const callRefreshToken = async () => {
      if (isGoogle){
        try {
          await authService.refreshToken();
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }
    callRefreshToken();
    fetchProfile();
  }, [userName, user, location.pathname]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateSuccess = async () => {
    setIsEditing(false);
    // Re-fetch profile data
    try {
      const targetUsername = userName || user?.userName;
      const response = await userService.getProfileByUsername(targetUsername);
      if (response.success) {
        setProfileData(response.data);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {error || 'Profile not found'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='flex md:flex-row flex-col gap-4'>
          {/* Left Side - User Info */}
          <div className='md:w-80 flex-shrink-0'>
            <Card>
              <UserInfo 
                profileData={profileData} 
                onEditProfile={handleEditProfile}
              />
            </Card>

            <div className='mt-4'>
              <SubmissionPieChart 
                userId={profileData._id}
              />
            </div>
          </div>

          {/* Right Side - Charts or Edit Profile */}
          <div className='flex-1'>
            {isEditing ? (
              <EditProfile
                profileData={profileData}
                onCancel={handleCancelEdit}
                onUpdateSuccess={handleUpdateSuccess}
              />
            ) : (
              <>
              <div className='flex-1 md:mt-0 mt-4 space-y-3'>
                <SubmissionRecent
                  userId={profileData._id}
                />
                <SubmissionCalendar userId={profileData._id} year={2024} />
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )};

export default Profile;