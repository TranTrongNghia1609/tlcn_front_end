import React from 'react';
import { TrendingUp, TrendingDown, Minus, User } from 'lucide-react';
import RankBadge, { getRankTierInfo } from './RankBadge';

// ─── Skeleton row khi đang load ───────────────────────────────
const SkeletonRow = () => (
  <tr className="lb-table__row lb-table__row--skeleton">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="lb-table__cell">
        <div className="lb-skeleton" />
      </td>
    ))}
  </tr>
);

// ─── Avatar với fallback chữ cái đầu ─────────────────────────
const UserAvatar = ({ avatar, userName, size = 36 }) => {
  const initial = (userName || '?')[0].toUpperCase();
  return avatar ? (
    <img
      src={avatar}
      alt={userName}
      className="lb-avatar"
      style={{ width: size, height: size }}
      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
    />
  ) : (
    <div className="lb-avatar lb-avatar--fallback" style={{ width: size, height: size }}>
      {initial}
    </div>
  );
};

// ─── Rank number với màu cho top 3 ───────────────────────────
const RankNumber = ({ rank }) => {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  if (medals[rank]) {
    return <span className="lb-rank lb-rank--medal">{medals[rank]}</span>;
  }
  return <span className="lb-rank lb-rank--normal">#{rank}</span>;
};

// ─── Elo change indicator ─────────────────────────────────────
const EloChange = ({ value }) => {
  if (value == null) return <span className="lb-elo-change lb-elo-change--neutral">—</span>;
  if (value > 0) return (
    <span className="lb-elo-change lb-elo-change--up">
      <TrendingUp size={12} /> +{value}
    </span>
  );
  if (value < 0) return (
    <span className="lb-elo-change lb-elo-change--down">
      <TrendingDown size={12} /> {value}
    </span>
  );
  return (
    <span className="lb-elo-change lb-elo-change--neutral">
      <Minus size={12} /> 0
    </span>
  );
};

/**
 * LeaderBoardTable
 *
 * Props:
 *   rankings  — mảng user từ API
 *   loading   — boolean
 *   currentUserId — _id của user đang login (để highlight)
 *   onUserClick — callback khi click username
 */
const LeaderBoardTable = ({ rankings = [], loading = false, currentUserId, onUserClick }) => {
  return (
    <div className="lb-table-wrapper">
      <table className="lb-table">
        <thead>
          <tr className="lb-table__head-row">
            <th className="lb-table__th lb-table__th--rank">Rank</th>
            <th className="lb-table__th lb-table__th--user">User</th>
            <th className="lb-table__th lb-table__th--elo">Elo</th>
            <th className="lb-table__th lb-table__th--tier">Tier</th>
            <th className="lb-table__th lb-table__th--contests">Contests</th>
            <th className="lb-table__th lb-table__th--solved">Solved</th>
            <th className="lb-table__th lb-table__th--maxelo">Peak Elo</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
          ) : rankings.length === 0 ? (
            <tr>
              <td colSpan={7} className="lb-table__empty">
                <User size={40} strokeWidth={1.5} />
                <p>No users found</p>
              </td>
            </tr>
          ) : (
            rankings.map((user) => {
              const isCurrentUser = currentUserId && user.userId?.toString() === currentUserId?.toString();
              const tierInfo = getRankTierInfo(user.elo);

              return (
                <tr
                  key={user.userId || user.rank}
                  className={[
                    'lb-table__row',
                    user.rank === 1 ? 'lb-table__row--gold' : '',
                    user.rank === 2 ? 'lb-table__row--silver' : '',
                    user.rank === 3 ? 'lb-table__row--bronze' : '',
                    isCurrentUser ? 'lb-table__row--me' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {/* Rank */}
                  <td className="lb-table__cell lb-table__cell--rank">
                    <RankNumber rank={user.rank} />
                  </td>

                  {/* User info */}
                  <td className="lb-table__cell lb-table__cell--user">
                    <div className="lb-user-cell">
                      <div className="lb-avatar-wrap">
                        <UserAvatar avatar={user.avatar} userName={user.userName} />
                        {/* Hiệu ứng glow màu tier */}
                        <span
                          className="lb-avatar-glow"
                          style={{ boxShadow: `0 0 10px ${tierInfo.color}55` }}
                        />
                      </div>
                      <div className="lb-user-info">
                        <button
                          className={`lb-username ${isCurrentUser ? 'lb-username--me' : ''}`}
                          onClick={() => onUserClick?.(user.userName)}
                        >
                          {user.userName}
                          {isCurrentUser && (
                            <span className="lb-you-badge">You</span>
                          )}
                        </button>
                        {user.fullName && (
                          <span className="lb-fullname">{user.fullName}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Elo */}
                  <td className="lb-table__cell lb-table__cell--elo">
                    <span
                      className="lb-elo-value"
                      style={{ color: tierInfo.color }}
                    >
                      {user.elo}
                    </span>
                  </td>

                  {/* Tier */}
                  <td className="lb-table__cell lb-table__cell--tier">
                    <RankBadge elo={user.elo} />
                  </td>

                  {/* Contests joined */}
                  <td className="lb-table__cell lb-table__cell--number">
                    {user.contestsJoined ?? 0}
                  </td>

                  {/* Total solved */}
                  <td className="lb-table__cell lb-table__cell--number">
                    {user.totalSolved ?? 0}
                  </td>

                  {/* Peak Elo */}
                  <td className="lb-table__cell lb-table__cell--number">
                    <span className="lb-peak-elo">{user.maxElo ?? user.elo}</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoardTable;