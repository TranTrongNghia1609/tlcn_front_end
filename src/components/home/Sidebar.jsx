import React from 'react';
import UserStats from './SidebarComponent/UserStats';
import TopRating from './SidebarComponent/TopRating';
import UpcomingContests from './SidebarComponent/UpcomingContests';

const Sidebar = () => {
  return (
    <div className="space-y-6">
      {/* User Stats Component */}
      <UserStats />
      
      {/* Top Rating Component */}
      <TopRating />
      
      {/* Upcoming Contests Component */}
      <UpcomingContests />
    </div>
  );
};

export default Sidebar;