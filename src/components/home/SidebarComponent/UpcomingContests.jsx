import React, { useState, useEffect } from 'react';
import { CalendarIcon, CodeBracketIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const UpcomingContests = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data cho demo
  const mockUpcomingContests = [
    {
      _id: '1',
      title: 'Weekly Algorithm Challenge #127',
      startTime: '2024-09-15T10:00:00Z',
      duration: 180, // minutes
      problemsCount: 4,
      participants: 1234
    },
    {
      _id: '2',
      title: 'Data Structures Mastery Contest',
      startTime: '2024-09-18T14:00:00Z',
      duration: 240, // minutes
      problemsCount: 6,
      participants: 856
    },
    {
      _id: '3',
      title: 'Dynamic Programming Challenge',
      startTime: '2024-09-22T16:00:00Z',
      duration: 150, // minutes
      problemsCount: 5,
      participants: 567
    }
  ];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setUpcomingContests(mockUpcomingContests);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = start.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Started';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h`;
    return 'Starting soon';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-gray-900">Upcoming Contests</h3>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : upcomingContests.length > 0 ? (
        <div className="space-y-3">
          {upcomingContests.slice(0, 3).map(contest => (
            <div key={contest._id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group">
              <div className="mb-3">
                <h4 className="font-medium text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">
                  {contest.title}
                </h4>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="flex items-center space-x-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>{formatDuration(contest.duration)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <CodeBracketIcon className="w-3 h-3" />
                    <span>{contest.problemsCount} problems</span>
                  </span>
                  <span>{contest.participants} registered</span>
                </div>
                
                <div className="text-xs font-medium text-orange-600">
                  {getTimeUntilStart(contest.startTime)}
                </div>
              </div>

              {/* Progress bar for time until start */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(20, Math.random() * 80)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No upcoming contests</p>
          <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Create Contest
          </button>
        </div>
      )}

      {/* View All Button */}
      {upcomingContests.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Contests
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingContests;