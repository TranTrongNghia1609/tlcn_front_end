import React, { useState, useEffect } from 'react';
import { TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const TopRating = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data cho demo
  const mockTopUsers = [
    { 
      _id: '1', 
      userName: 'alice_dev', 
      fullName: 'Alice Johnson', 
      avatar: null, 
      rating: 2450,
      solvedProblems: 342
    },
    { 
      _id: '2', 
      userName: 'bob_coder', 
      fullName: 'Bob Smith', 
      avatar: null, 
      rating: 2398,
      solvedProblems: 298
    },
    { 
      _id: '3', 
      userName: 'charlie_algo', 
      fullName: 'Charlie Brown', 
      avatar: null, 
      rating: 2301,
      solvedProblems: 267
    },
    { 
      _id: '4', 
      userName: 'diana_prog', 
      fullName: 'Diana Wilson', 
      avatar: null, 
      rating: 2156,
      solvedProblems: 234
    },
    { 
      _id: '5', 
      userName: 'eve_tech', 
      fullName: 'Eve Davis', 
      avatar: null, 
      rating: 2089,
      solvedProblems: 198
    }
  ];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setTopUsers(mockTopUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 2400) return 'text-red-600';
    if (rating >= 2100) return 'text-orange-600';
    if (rating >= 1900) return 'text-purple-600';
    if (rating >= 1600) return 'text-blue-600';
    if (rating >= 1400) return 'text-green-600';
    return 'text-gray-600';
  };

  const getRatingBadge = (rating) => {
    if (rating >= 2400) return { text: 'Grandmaster', color: 'bg-red-100 text-red-800' };
    if (rating >= 2100) return { text: 'Master', color: 'bg-orange-100 text-orange-800' };
    if (rating >= 1900) return { text: 'Expert', color: 'bg-purple-100 text-purple-800' };
    if (rating >= 1600) return { text: 'Specialist', color: 'bg-blue-100 text-blue-800' };
    if (rating >= 1400) return { text: 'Pupil', color: 'bg-green-100 text-green-800' };
    return { text: 'Newbie', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <UserGroupIcon className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-gray-900">Top Rating</h3>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {topUsers.slice(0, 5).map((user, index) => {
            const badge = getRatingBadge(user.rating);
            return (
              <div key={user._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=40&background=2563eb&color=fff`}
                    alt={user.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {index < 3 && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-400 text-gray-900' :
                      'bg-orange-400 text-orange-900'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.fullName || user.userName}
                    </p>
                    <div className={`text-sm font-bold ${getRatingColor(user.rating)}`}>
                      {user.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.text}
                    </span>
                    <p className="text-xs text-gray-500">
                      {user.solvedProblems} solved
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default TopRating;