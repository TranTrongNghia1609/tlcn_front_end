import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../../context/UserContext';

const UserStats = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        {/* Avatar ở giữa */}
        <div className="flex justify-center mb-1">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=80&background=2563eb&color=fff`}
            alt={user.userName}
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
          />
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-1">
          {user.userName}
        </h3>
        
        <div className="mb-4">
          <div className="">
            Rating: <span className='text-bg font-bold text-blue-700 uppercase tracking-wide'>{user.rating || 1200}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">{user.postsCount || 0}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">{user.solvedProblems || 0}</div>
            <div className="text-xs text-gray-500">Solved</div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default UserStats;