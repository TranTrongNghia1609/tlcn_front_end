import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { goToTeacherSite, goToAdminSite } from '@/utils/siteNavigation'; // ✅ Import functions

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    
    const name = user?.userName || user?.fullName || user?.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&size=40&rounded=true`;
  };

  const getDisplayName = () => {
    return user?.userName || user?.fullName || user?.email?.split('@')[0] || 'User';
  };

  //  Get role badge
  const getRoleBadge = () => {
    if (user?.role === 'admin') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
          Admin
        </span>
      );
    }
    if (user?.role === 'teacher') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Teacher
        </span>
      );
    }
    return null;
  };

  //  Handle site switch
  const handleSiteSwitch = (switchFn, path) => {
    setIsOpen(false);
    switchFn(path, false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <img
          src={getAvatarUrl()}
          alt={getDisplayName()}
          className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
        />
        <span className="hidden sm:block text-gray-700 font-medium text-sm">
          {getDisplayName()}
        </span>
        
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={getAvatarUrl()}
                alt={getDisplayName()}
                className="w-12 h-12 rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {getDisplayName()}
                  </p>
                  {getRoleBadge()}
                </div>
                <p className="text-sm text-gray-500 truncate">{user?.fullName}</p> 
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 ml-1">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to={`/profile/${user?.userName}`}
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Profile</span>
            </Link>

            <Link
              to={`/profile/${user?.userName}`}
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>My Submissions</span>
            </Link>

            <Link
              to="/classrooms"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>My ClassRooms</span>
            </Link>

            

            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <>
                {/* Teacher Site */}
                <button
                  onClick={() => handleSiteSwitch(goToTeacherSite, '/dashboard')}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-all duration-200"
                >
                  <svg 
                    className="w-5 h-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                  <div className="flex-1">
                    <span className="">
                      Teacher Dashboard
                    </span>
                  </div>
                  
                </button>

                {/* Admin Site - Admin Only */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleSiteSwitch(goToAdminSite, '/dashboard')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 cursor-pointer flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <svg 
                      className="w-5 h-5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                      />
                    </svg>
                    <div className="flex-1">
                      <span className="">
                        Admin Panel
                      </span>
                    </div>
                  
                  </button>
                )}
              </>
            )}

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 cursor-pointer flex items-center space-x-3 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;