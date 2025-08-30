import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserInfo from '../components/profile/UserInfo';
import AvatarUpload from '../components/profile/AvatarUpload';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Please login to view profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
          <p className="text-blue-100 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Avatar Section - Component */}
          <AvatarUpload />
          
          {/* Profile Information - Component */}
          <UserInfo />
        </div>
      </div>
    </div>
  );
};

export default Profile;