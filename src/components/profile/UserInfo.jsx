import React from 'react';
import { Button } from '@/components/ui/button';
import { User, MapPinHouse, Mail, Calendar, School, Edit } from 'lucide-react';

const UserInfo = ({ profileData, onEditProfile }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not updated';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className='p-6'>
      <div className='space-y-6'>
        {/* Profile Header */}
        <div className='flex flex-col items-center text-center'>
          {/* Avatar */}
          <div className='mb-4'>
            <img 
              src={profileData.avatar} 
              alt={profileData.userName}
              className='h-32 w-32 object-cover rounded-full border-4 border-blue-100 shadow-lg'
            />
          </div>

          {/* Username */}
          <div className='mb-2'>
            <p className='font-bold text-gray-900 text-2xl'>{profileData.userName}</p>
          </div>

          {/* Full Name */}
          <div className='mb-4'>
            <p className='text-gray-600 text-lg'>{profileData.fullName || 'Not updated'}</p>
          </div>
        </div>

        {/* Info List */}
        <div className='space-y-4 pt-4 border-t'>
          {/* Email */}
          <div className='flex items-start gap-3'>
            <Mail size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div className='flex-1'>
              <p className='text-xs text-gray-500 mb-1'>Email</p>
              <p className='text-gray-900 break-all'>{profileData.email}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className='flex items-start gap-3'>
            <Calendar size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div className='flex-1'>
              <p className='text-xs text-gray-500 mb-1'>Date of Birth</p>
              <p className='text-gray-900'>{formatDate(profileData.dob)}</p>
            </div>
          </div>

          {/* School */}
          <div className='flex items-start gap-3'>
            <School size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div className='flex-1'>
              <p className='text-xs text-gray-500 mb-1'>School</p>
              <p className='text-gray-900'>{profileData.School || 'Not updated'}</p>
            </div>
          </div>

          {/* Location */}
          <div className='flex items-start gap-3'>
            <MapPinHouse size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div className='flex-1'>
              <p className='text-xs text-gray-500 mb-1'>Country</p>
              <p className='text-gray-900'>Vietnam</p>
            </div>
          </div>
        </div>
        
        {/* Edit Button */}
        {profileData.isOwner && (
          <div className='pt-4 border-t'>
            <Button 
              onClick={onEditProfile}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white'
              type="button"
            >
              <Edit size={18} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        )}

        {/* Languages Section */}
        <div className='pt-6 border-t'>
          <h3 className="text-base font-semibold mb-3 text-gray-900">Programming Languages</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.languages?.length > 0 ? (
              profileData.languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {lang}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No languages added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;