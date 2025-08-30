import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import ImageUpload from '../common/ImageUpload';

const AvatarUpload = () => {
  const { user, updateAvatar, uploading } = useUser();

  const handleAvatarUpload = async (uploadResult) => {
    try {
      console.log('🖼️ New avatar uploaded:', uploadResult.url);
      setUploading(true);
      
      await updateAvatar(uploadResult.url);
      alert('Avatar updated successfully!');
      
    } catch (error) {
      console.error('Failed to save avatar:', error);
      alert(`Failed to update avatar: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadError = (error) => {
    alert(`Upload failed: ${error}`);
  };

  return (
    <div className="flex items-start space-x-6">
      <div className="relative">
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.userName || 'User')}&size=120&background=2563eb&color=fff`}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2">Profile Picture</h3>
        <p className="text-gray-600 mb-4">
          Upload a new avatar. Recommended size is 200x200px.
        </p>
        
        <ImageUpload
          onUploadSuccess={handleAvatarUpload}
          onUploadError={handleUploadError}
          folder="online_judge/avatars"
          maxSize={2 * 1024 * 1024} // 2MB
          className="max-w-sm"
        >
          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg"
            disabled={uploading}
          >
            {uploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              'Upload New Avatar'
            )}
          </button>
        </ImageUpload>
      </div>
    </div>
  );
};

export default AvatarUpload;