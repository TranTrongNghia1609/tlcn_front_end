import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserInfo from '../components/profile/UserInfo';
import AvatarUpload from '../components/profile/AvatarUpload';
import { Card } from '@/components/ui/card';
import SubmissionCalendar from '@/components/submission/SubmissionCalendar';
import { mockSubmissionData } from '@/utils/mockSubmissionsData';
import { userService } from '@/services/userService';
import SubmissionPieChart from '@/components/submission/SubmissionPieChart';
import DifficultyChart from '@/components/submission/DifficultyChart';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const targetUsername = username || user?.userName;
        
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

    fetchProfile();
  }, [username, user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
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
        <div className='md:flex-row flex space-x-4 flex-col'>
          <div className=''>
            <Card>
              <UserInfo profileData={profileData} />
            </Card>

          </div>

          <div className='flex-1 md:mt-0 mt-4'>
            <div className='flex md:flex-row flex-col items-stretch justify-center mb-4 space-y-4 md:space-x-4'>
              <div className='md:w-1/2'>
                <SubmissionPieChart 
                  userId={profileData._id}
                />
              </div>
              <div className='md:w-1/2'>
                <DifficultyChart 
                  userId={profileData._id}
                />
              </div>
            </div>
            <SubmissionCalendar userId={profileData._id} year={2024} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;