import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { rankingService } from '@/services/rankingService';
import LeaderBoardHeader from '@/components/leaderboard/LeaderBoardHeader';
import LeaderBoardTable from '@/components/leaderboard/LeaderBoardTable';
import TopThreeCard from '@/components/leaderboard/TopThreeCard';

// ── Rank tier filter options ──────────────────────────────────
const RANK_TIERS = [
  { value: '', label: 'All Tiers' },
  { value: 'Diamond', label: 'Diamond' },
  { value: 'Platinum', label: 'Platinum' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Bronze', label: 'Bronze' },
];

const LIMITS = [10, 20, 50];

// ── Debounce hook ─────────────────────────────────────────────
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// ─────────────────────────────────────────────────────────────
const LeaderBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── State ──
  const [rankings, setRankings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const debouncedSearch = useDebounce(search, 400);

  // Reset page khi filter/search thay đổi
  useEffect(() => { setPage(1); }, [debouncedSearch, rankFilter, limit]);

  // ── Fetch data ──────────────────────────────────────────────
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await rankingService.getLeaderboard({
        page,
        limit,
        search: debouncedSearch,
        rankFilter,
      });

      setRankings(res.data?.rankings || []);
      setPagination(res.data?.pagination || { page, limit, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, rankFilter]);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  // ── Helpers ─────────────────────────────────────────────────
  const handleUserClick = (userName) => navigate(`/profile/${userName}`);
  const handleSearchClear = () => setSearch('');

  // Top 3 chỉ hiển thị khi trang 1, không search, không filter
  const showPodium = page === 1 && !debouncedSearch && !rankFilter && rankings.length >= 3;
  const top3 = showPodium ? rankings.slice(0, 3) : [];
  const tableRankings = showPodium ? rankings.slice(3) : rankings;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="lb-page">
      {/* ── Header ── */}
      <LeaderBoardHeader totalUsers={pagination.total} loading={loading} />

      {/* ── Controls bar ── */}
      <div className="lb-controls">
        {/* Search */}
        <div className="lb-search-wrap">
          <Search size={16} className="lb-search__icon" />
          <input
            id="lb-search-input"
            type="text"
            placeholder="Search username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="lb-search__input"
          />
          {search && (
            <button
              className="lb-search__clear"
              onClick={handleSearchClear}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Rank filter */}
        <div className="lb-filter-wrap">
          <Filter size={14} className="lb-filter__icon" />
          <select
            id="lb-rank-filter"
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="lb-filter__select"
          >
            {RANK_TIERS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Rows per page */}
        <div className="lb-limit-wrap">
          <span className="lb-limit__label">Show</span>
          <select
            id="lb-limit-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="lb-filter__select"
          >
            {LIMITS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Total count */}
        <span className="lb-total-label">
          {!loading && `${pagination.total.toLocaleString()} users`}
        </span>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="lb-error">
          <p>{error}</p>
          <button className="lb-error__retry" onClick={fetchLeaderboard}>
            Retry
          </button>
        </div>
      )}

      {/* ── Podium (top 3) ── */}
      {showPodium && !loading && (
        <TopThreeCard
          users={top3}
          currentUserId={user?._id}
          onUserClick={handleUserClick}
        />
      )}

      {/* ── Main table ── */}
      <div className="lb-table-section">
        <LeaderBoardTable
          rankings={showPodium ? tableRankings : rankings}
          loading={loading}
          currentUserId={user?._id}
          onUserClick={handleUserClick}
        />
      </div>

      {/* ── Pagination ── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="lb-pagination" id="lb-pagination">
          {/* Prev */}
          <button
            id="lb-page-prev"
            className="lb-pagination__btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page numbers */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((p) => {
              // Hiển thị: trang đầu, cuối, và ±2 quanh trang hiện tại
              return (
                p === 1 ||
                p === pagination.totalPages ||
                Math.abs(p - page) <= 2
              );
            })
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) {
                acc.push('...');
              }
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === '...' ? (
                <span key={`ellipsis-${idx}`} className="lb-pagination__ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  id={`lb-page-${item}`}
                  className={`lb-pagination__btn lb-pagination__btn--page ${
                    page === item ? 'lb-pagination__btn--active' : ''
                  }`}
                  onClick={() => setPage(item)}
                  aria-label={`Go to page ${item}`}
                  aria-current={page === item ? 'page' : undefined}
                >
                  {item}
                </button>
              )
            )}

          {/* Next */}
          <button
            id="lb-page-next"
            className="lb-pagination__btn"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* ── Leaderboard CSS (scoped) ── */}
      <style>{leaderboardStyles}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Scoped CSS — không ảnh hưởng toàn trang
// ─────────────────────────────────────────────────────────────
const leaderboardStyles = `
/* ── Page layout ── */
.lb-page {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
  padding-bottom: 64px;
}

/* ── Header ── */
.lb-header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%);
  padding: 56px 24px 40px;
  text-align: center;
  color: white;
}
.lb-header__bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.lb-header__bg-orb--1 {
  width: 400px; height: 400px;
  background: rgba(99,102,241,0.25);
  top: -120px; left: -80px;
}
.lb-header__bg-orb--2 {
  width: 350px; height: 350px;
  background: rgba(251,191,36,0.12);
  bottom: -120px; right: -60px;
}
.lb-header__content { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
.lb-header__icon-wrap {
  display: inline-flex; align-items: center; justify-content: center;
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(251,191,36,0.18);
  color: #fbbf24; margin-bottom: 16px;
}
.lb-header__title {
  font-size: clamp(28px, 5vw, 42px); font-weight: 800;
  letter-spacing: -0.02em; margin: 0 0 10px;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.lb-header__subtitle {
  font-size: 15px; color: #94a3b8; margin: 0 0 28px; line-height: 1.6;
}
.lb-header__stats {
  display: inline-flex; align-items: center; gap: 16px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 10px 20px; font-size: 14px; color: #cbd5e1;
}
.lb-header__stat { display: flex; align-items: center; gap: 7px; }
.lb-header__stat strong { color: #f1f5f9; }
.lb-header__stat-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.15); }

/* ── Controls ── */
.lb-controls {
  display: flex; align-items: center; flex-wrap: wrap;
  gap: 10px; padding: 20px 24px;
  max-width: 1200px; margin: 0 auto;
}
.lb-search-wrap {
  position: relative; display: flex; align-items: center;
  flex: 1; min-width: 200px; max-width: 340px;
}
.lb-search__icon { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
.lb-search__input {
  width: 100%; padding: 9px 36px 9px 36px;
  border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 14px; color: #1e293b; background: white;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.lb-search__input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
.lb-search__clear {
  position: absolute; right: 10px;
  background: none; border: none; cursor: pointer;
  color: #94a3b8; display: flex; padding: 2px;
}
.lb-search__clear:hover { color: #64748b; }
.lb-filter-wrap, .lb-limit-wrap { display: flex; align-items: center; gap: 6px; }
.lb-filter__icon { color: #64748b; }
.lb-filter__select {
  padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 14px; color: #334155; background: white; cursor: pointer; outline: none;
  transition: border-color 0.2s;
}
.lb-filter__select:focus { border-color: #6366f1; }
.lb-limit__label { font-size: 13px; color: #64748b; }
.lb-total-label { margin-left: auto; font-size: 13px; color: #94a3b8; }

/* ── Error ── */
.lb-error {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 32px; text-align: center; color: #ef4444;
}
.lb-error__retry {
  padding: 8px 20px; background: #fee2e2; border: 1px solid #fca5a5;
  border-radius: 8px; color: #dc2626; font-size: 14px; cursor: pointer;
}

/* ── Podium ── */
.lb-podium {
  display: flex; align-items: flex-end; justify-content: center;
  gap: 0; padding: 0 24px 12px; max-width: 600px; margin: 0 auto;
  height: 280px;
}
.lb-podium__slot {
  display: flex; flex-direction: column; align-items: center;
  flex: 1; position: relative; height: var(--slot-height, 80%);
}
.lb-podium__slot--empty { flex: 1; }
.lb-podium__crown {
  position: absolute; top: -30px;
  animation: floatCrown 2.5s ease-in-out infinite;
}
@keyframes floatCrown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.lb-podium__avatar-wrap {
  width: 62px; height: 62px; border-radius: 50%;
  border: 3px solid; overflow: hidden; margin-bottom: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}
.lb-podium__avatar { width: 100%; height: 100%; object-fit: cover; }
.lb-podium__avatar--fallback {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 700;
}
.lb-podium__medal { font-size: 20px; margin-bottom: 4px; }
.lb-podium__username {
  font-size: 13px; font-weight: 600; color: #1e293b;
  background: none; border: none; cursor: pointer; padding: 0;
  max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  text-align: center;
}
.lb-podium__username:hover { color: #6366f1; }
.lb-podium__username--me { color: #6366f1; }
.lb-podium__elo { font-size: 12px; font-weight: 700; margin-top: 2px; }
.lb-podium__base {
  width: 100%; flex: 1; min-height: 40px; margin-top: 8px;
  display: flex; align-items: center; justify-content: center;
  border-top: 2px solid; border-radius: 8px 8px 0 0;
  font-size: 14px; font-weight: 700; color: #64748b;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
}

/* ── Table section ── */
.lb-table-section {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
}
.lb-table-wrapper {
  background: white; border: 1px solid #e2e8f0;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
}
.lb-table {
  width: 100%; border-collapse: collapse;
}
.lb-table__head-row { background: #f8fafc; }
.lb-table__th {
  padding: 12px 16px; text-align: left;
  font-size: 12px; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}
.lb-table__th--rank, .lb-table__th--elo,
.lb-table__th--tier, .lb-table__th--contests,
.lb-table__th--solved, .lb-table__th--maxelo { text-align: center; }

.lb-table__row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}
.lb-table__row:hover { background: #fafafe; }
.lb-table__row:last-child { border-bottom: none; }
.lb-table__row--gold   { background: linear-gradient(to right, rgba(251,191,36,0.07), transparent); }
.lb-table__row--silver { background: linear-gradient(to right, rgba(156,163,175,0.07), transparent); }
.lb-table__row--bronze { background: linear-gradient(to right, rgba(201,125,62,0.07), transparent); }
.lb-table__row--me {
  background: linear-gradient(to right, rgba(99,102,241,0.07), transparent) !important;
  outline: 1px solid rgba(99,102,241,0.2);
}
.lb-table__row--skeleton { pointer-events: none; }

.lb-table__cell {
  padding: 14px 16px; font-size: 14px; color: #334155;
}
.lb-table__cell--rank, .lb-table__cell--elo,
.lb-table__cell--tier, .lb-table__cell--number { text-align: center; }

.lb-table__empty {
  text-align: center; padding: 64px; color: #94a3b8;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}

/* ── Rank number ── */
.lb-rank { font-weight: 700; }
.lb-rank--medal { font-size: 18px; }
.lb-rank--normal { font-size: 13px; color: #64748b; }

/* ── Avatar ── */
.lb-avatar-wrap { position: relative; flex-shrink: 0; }
.lb-avatar {
  width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
  border: 2px solid #e2e8f0;
}
.lb-avatar--fallback {
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: #ede9fe; color: #6366f1;
  font-size: 14px; font-weight: 700; border: 2px solid #e2e8f0;
}
.lb-avatar-glow {
  position: absolute; inset: -2px; border-radius: 50%;
  pointer-events: none;
}

/* ── User cell ── */
.lb-user-cell { display: flex; align-items: center; gap: 10px; }
.lb-user-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.lb-username {
  background: none; border: none; cursor: pointer; padding: 0;
  font-size: 14px; font-weight: 600; color: #1e293b; text-align: left;
  display: flex; align-items: center; gap: 6px;
  transition: color 0.15s;
}
.lb-username:hover { color: #6366f1; }
.lb-username--me { color: #6366f1; }
.lb-you-badge {
  font-size: 10px; font-weight: 700; padding: 1px 6px;
  background: #ede9fe; color: #6366f1; border-radius: 99px;
  letter-spacing: 0.04em;
}
.lb-fullname { font-size: 12px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ── Elo ── */
.lb-elo-value { font-size: 16px; font-weight: 700; }
.lb-peak-elo { font-size: 13px; color: #64748b; font-weight: 600; }

/* ── Elo change indicator ── */
.lb-elo-change {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 12px; font-weight: 600;
}
.lb-elo-change--up    { color: #22c55e; }
.lb-elo-change--down  { color: #ef4444; }
.lb-elo-change--neutral { color: #94a3b8; }

/* ── Skeleton ── */
.lb-skeleton {
  height: 16px; border-radius: 8px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8edf5 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease infinite;
}
@keyframes skeletonShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Pagination ── */
.lb-pagination {
  display: flex; justify-content: center; align-items: center;
  gap: 6px; padding: 28px 24px 0;
}
.lb-pagination__btn {
  min-width: 36px; height: 36px; padding: 0 10px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e2e8f0; border-radius: 8px;
  background: white; cursor: pointer; font-size: 14px; color: #334155;
  transition: all 0.15s;
}
.lb-pagination__btn:hover:not(:disabled) { background: #f8fafc; border-color: #6366f1; color: #6366f1; }
.lb-pagination__btn:disabled { opacity: 0.4; cursor: default; }
.lb-pagination__btn--active {
  background: #6366f1; border-color: #6366f1; color: white; font-weight: 600;
}
.lb-pagination__btn--active:hover { background: #4f46e5; }
.lb-pagination__ellipsis { font-size: 14px; color: #94a3b8; padding: 0 4px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .lb-table__th--maxelo,
  .lb-table__cell:nth-child(7) { display: none; }
  .lb-controls { flex-direction: column; align-items: stretch; }
  .lb-search-wrap { max-width: 100%; }
  .lb-total-label { margin-left: 0; }
}
@media (max-width: 520px) {
  .lb-table__th--contests,
  .lb-table__cell:nth-child(5) { display: none; }
}
`;

export default LeaderBoard;