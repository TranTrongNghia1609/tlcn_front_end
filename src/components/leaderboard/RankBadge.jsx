import React from 'react';

/**
 * RankTierInfo — Helper để lấy label/màu sắc cho từng tier Elo.
 * Không hiển thị badge icon theo yêu cầu, chỉ dùng màu + text.
 */
export const RANK_TIERS = {
  Diamond: {
    label: 'Diamond',
    color: '#60a5fa',       // blue-400
    bg: 'rgba(96,165,250,0.12)',
    border: 'rgba(96,165,250,0.35)',
    textClass: 'rank-tier--diamond',
  },
  Platinum: {
    label: 'Platinum',
    color: '#a78bfa',       // violet-400
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.35)',
    textClass: 'rank-tier--platinum',
  },
  Gold: {
    label: 'Gold',
    color: '#fbbf24',       // amber-400
    bg: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.35)',
    textClass: 'rank-tier--gold',
  },
  Silver: {
    label: 'Silver',
    color: '#9ca3af',       // gray-400
    bg: 'rgba(156,163,175,0.12)',
    border: 'rgba(156,163,175,0.3)',
    textClass: 'rank-tier--silver',
  },
  Bronze: {
    label: 'Bronze',
    color: '#c97d3e',       // custom bronze
    bg: 'rgba(201,125,62,0.12)',
    border: 'rgba(201,125,62,0.3)',
    textClass: 'rank-tier--bronze',
  },
};

export const getRankTierInfo = (elo) => {
  if (elo >= 2300) return RANK_TIERS.Diamond;
  if (elo >= 2000) return RANK_TIERS.Platinum;
  if (elo >= 1700) return RANK_TIERS.Gold;
  if (elo >= 1400) return RANK_TIERS.Silver;
  return RANK_TIERS.Bronze;
};

/**
 * RankBadge — Hiển thị tier label nhỏ gọn bên cạnh Elo.
 * Không dùng icon theo yêu cầu.
 */
const RankBadge = ({ elo, className = '' }) => {
  const tier = getRankTierInfo(elo);

  return (
    <span
      className={`rank-badge ${className}`}
      style={{
        color: tier.color,
        background: tier.bg,
        border: `1px solid ${tier.border}`,
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {tier.label}
    </span>
  );
};

export default RankBadge;
