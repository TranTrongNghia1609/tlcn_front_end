import React from 'react';
import { Trophy, Users, Zap } from 'lucide-react';

/**
 * LeaderBoardHeader — Hero section của trang leaderboard.
 * Hiển thị tổng số user đang xếp hạng.
 */
const LeaderBoardHeader = ({ totalUsers = 0, loading = false }) => {
  return (
    <div className="lb-header">
      {/* Background decoration */}
      <div className="lb-header__bg-orb lb-header__bg-orb--1" />
      <div className="lb-header__bg-orb lb-header__bg-orb--2" />

      <div className="lb-header__content">
        {/* Icon + Title */}
        <div className="lb-header__icon-wrap">
          <Trophy size={32} strokeWidth={1.8} />
        </div>

        <h1 className="lb-header__title">Leaderboard</h1>

        {/* Stats strip */}
        <div className="lb-header__stats">
          <div className="lb-header__stat">
            <Users size={16} />
            <span>
              {loading ? '—' : totalUsers.toLocaleString()}{' '}
              <strong>Ranked Users</strong>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeaderBoardHeader;