import React from 'react';
import { Crown } from 'lucide-react';
import { getRankTierInfo } from './RankBadge';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * TopThreeCard — Hiển thị top 3 người dùng dưới dạng card nổi bật.
 *
 * Props:
 *   users — mảng tối đa 3 user từ rankings
 *   currentUserId — highlight nếu user đang login là top 3
 *   onUserClick — callback khi click username
 */
const TopThreeCard = ({ users = [], currentUserId, onUserClick }) => {
  if (!users || users.length === 0) return null;

  // Sắp xếp hiển thị: 2nd - 1st - 3rd (podium style)
  const podiumOrder = [
    users[1] || null, // 2nd — trái
    users[0] || null, // 1st — giữa (cao nhất)
    users[2] || null, // 3rd — phải
  ];
  const podiumHeights = ['80%', '100%', '70%'];

  return (
    <div className="lb-podium">
      {podiumOrder.map((user, idx) => {
        if (!user) return <div key={idx} className="lb-podium__slot lb-podium__slot--empty" />;

        const isMe = currentUserId && user.userId?.toString() === currentUserId?.toString();
        const tier = getRankTierInfo(user.elo);
        const medalIndex = idx === 0 ? 1 : idx === 1 ? 0 : 2; // map podium pos → rank index

        return (
          <div
            key={user.userId}
            className={`lb-podium__slot ${isMe ? 'lb-podium__slot--me' : ''}`}
            style={{ '--slot-height': podiumHeights[idx] }}
          >
            {/* Crown cho rank 1 */}
            {medalIndex === 0 && (
              <Crown
                size={22}
                className="lb-podium__crown"
                style={{ color: tier.color }}
              />
            )}

            {/* Avatar */}
            <div
              className="lb-podium__avatar-wrap"
              style={{ borderColor: tier.color }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="lb-podium__avatar"
                />
              ) : (
                <div
                  className="lb-podium__avatar lb-podium__avatar--fallback"
                  style={{ background: tier.bg, color: tier.color }}
                >
                  {(user.userName || '?')[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Medal emoji */}
            <span className="lb-podium__medal">{MEDALS[medalIndex]}</span>

            {/* Username */}
            <button
              className={`lb-podium__username ${isMe ? 'lb-podium__username--me' : ''}`}
              onClick={() => onUserClick?.(user.userName)}
            >
              {user.userName}
            </button>

            {/* Elo */}
            <span
              className="lb-podium__elo"
              style={{ color: tier.color }}
            >
              {user.elo} Elo
            </span>

            {/* Podium base */}
            <div
              className={`lb-podium__base lb-podium__base--${medalIndex + 1}`}
              style={{ borderColor: `${tier.color}55` }}
            >
              #{user.rank}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopThreeCard;