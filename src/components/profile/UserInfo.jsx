import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserInfo = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-6">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={user?.userName || ''}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={user?.fullName || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">You can update your full name</p>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Account Status</h3>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${user?.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`font-medium ${user?.active ? 'text-green-600' : 'text-red-600'}`}>
            {user?.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Avatar URL Debug */}
      {user?.avatar && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-3">Current Avatar URL</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 break-all">{user.avatar}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(user.avatar);
                alert('URL copied to clipboard!');
              }}
              className="mt-2 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Copy URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;