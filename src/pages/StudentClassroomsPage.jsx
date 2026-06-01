import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ClassroomPagination } from '@/components/ui/pagination';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  Search,
  MoreVertical,
  ArrowRight,
  AlertCircle,
  CheckSquare,
  X,
  School,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import classroomService from '@/services/classroomService';
import { formatDate } from '@/utils/dateHelpers';
import { useDebounce } from '@/hooks/useDebounce';
import JoinClassroomModal from '@/components/student/JoinClassroomModal';

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-rose-500',
  'from-violet-500 to-fuchsia-600',
  'from-sky-500 to-blue-600',
];

// ─── Skeleton Components ──────────────────────────────────────────────────────
const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
    <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
    <div className="flex-1">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-7 w-10" />
    </div>
  </div>
);

const ClassroomCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
    <Skeleton className="h-24 w-full rounded-none" />
    <div className="p-5 flex-grow flex flex-col gap-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-3 w-14 mb-1" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-lg" />
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-5 w-14" />
    </div>
  </div>
);

// ─── Classroom Card ───────────────────────────────────────────────────────────
const ClassroomCard = ({ classroom, globalIndex, onClick }) => {
  const gradient = GRADIENTS[globalIndex % GRADIENTS.length];
  const isActive = classroom.status === 'active';

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Banner */}
      <div className={`h-24 bg-gradient-to-r ${gradient} relative p-4`}>
        <div className="flex justify-between items-start">
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/30">
            {formatDate(classroom.createdAt)}
          </span>
          <button
            className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            onClick={(e) => e.stopPropagation()}
            aria-label="More options"
          >
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Code + Name */}
        <div className="mb-4">
          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 inline-block mb-1.5">
            {classroom.classCode}
          </span>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {classroom.className}
          </h3>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-3 mb-4 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
          {classroom.owner?.avatar ? (
            <img
              src={classroom.owner.avatar}
              alt={classroom.owner.fullName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <GraduationCap size={14} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold leading-none mb-0.5">
              Giảng Viên
            </p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {classroom.owner?.fullName || 'Not updated'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              <Users size={13} />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none mb-0.5">Students</p>
              <p className="text-sm font-semibold text-gray-800">
                {classroom.stats?.totalStudents ?? 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <CheckSquare size={13} />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none mb-0.5">Problems</p>
              <p className="text-sm font-semibold text-gray-800">
                {classroom.stats?.totalProblems ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {classroom.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <AlertCircle size={13} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                {classroom.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
        <span
          className={`text-xs font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isActive ? 'text-green-700 bg-green-100' : 'text-gray-500 bg-gray-100'
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
          />
          {isActive ? 'Active' : 'Ended'}
        </span>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn transition-colors">
          Enter
          <ArrowRight size={13} className="transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const StudentClassroomsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Đọc state từ URL ──
  const pageFromUrl = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const searchFromUrl = searchParams.get('search') || '';

  // ── Local input state (ngay lập tức theo người dùng gõ) ──
  const [searchInput, setSearchInput] = useState(searchFromUrl);

  // ── Server state ──
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: ITEMS_PER_PAGE,
  });

  // ── Overview stats — fetch một lần, không bị ảnh hưởng bởi search ──
  const [overviewStats, setOverviewStats] = useState({
    total: 0,
    totalProblems: 0,
    activeCount: 0,
  });
  const [overviewLoading, setOverviewLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        // Lấy tất cả không filter search để có số liệu tổng quan chính xác
        const res = await classroomService.getClassrooms({
          role: 'student',
          page: 1,
          limit: 9999,
          status: 'all',
        });
        const list = res.data.classrooms || [];
        setOverviewStats({
          total: res.data.pagination?.total ?? list.length,
          totalProblems: list.reduce((s, c) => s + (c.stats?.totalProblems || 0), 0),
          activeCount: list.filter((c) => c.status === 'active').length,
        });
      } catch {
        // silently ignore — stats not critical
      } finally {
        setOverviewLoading(false);
      }
    };
    fetchOverview();
  }, []); // chỉ chạy 1 lần khi mount

  // ── Debounce 500ms: chỉ trigger URL update sau khi ngừng gõ ──
  const debouncedSearch = useDebounce(searchInput, 500);

  // Khi debouncedSearch thay đổi → cập nhật URL (reset page = 1)
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch.trim()) {
          next.set('search', debouncedSearch.trim());
        } else {
          next.delete('search');
        }
        next.set('page', '1');
        return next;
      },
      { replace: true } // không tạo history entry mới khi gõ search
    );
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch API khi URL params thay đổi ──
  useEffect(() => {
    let cancelled = false;

    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const params = {
          role: 'student',
          page: pageFromUrl,
          limit: ITEMS_PER_PAGE,
          status: 'all',
        };
        if (searchFromUrl.trim()) {
          params.search = searchFromUrl.trim();
        }

        const response = await classroomService.getClassrooms(params);
        if (cancelled) return;

        const { classrooms: list = [], pagination: pg = {} } = response.data;
        setClassrooms(list);
        setPagination({
          total: pg.total ?? 0,
          totalPages: pg.totalPages ?? 1,
          limit: pg.limit ?? ITEMS_PER_PAGE,
        });
      } catch (error) {
        if (cancelled) return;
        console.error('Error fetching classrooms:', error);
        toast.error('Failed to load classrooms');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClassrooms();
    return () => { cancelled = true; }; // cleanup nếu params thay đổi trước khi fetch xong
  }, [pageFromUrl, searchFromUrl]);

  // ── Handlers ──
  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('search');
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  };

  const handleJoinSuccess = () => {
    setShowJoinModal(false);
    // Trigger re-fetch bằng cách "touch" searchParams (không thay đổi nội dung)
    setSearchParams((prev) => new URLSearchParams(prev));
  };

  // (stats dùng overviewStats — không tính lại từ classrooms hiện tại)

  // Đang debounce (người dùng vừa gõ nhưng chưa gửi đi)
  const isDebouncing = searchInput !== searchFromUrl && searchInput === debouncedSearch
    ? false
    : searchInput !== debouncedSearch;

  return (
    <div className="min-h-screen bg-gray-100 mt-6">
      <div className="max-w-7xl mx-auto px-6 pb-8 space-y-5">

        {/* ── Page Header Card ── */}
        <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <School size={22} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">My Classrooms</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Manage the classrooms you are participating in
              </p>
            </div>
          </div>
          <Button
            id="btn-join-classroom"
            onClick={() => setShowJoinModal(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm flex-shrink-0"
            disabled={loading}
          >
            <Plus size={18} className="mr-1.5" />
            Join Classroom
          </Button>
        </div>

        {/* ── Stats Row — dùng overviewStats, không thay đổi khi search ── */}
        {overviewLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-100 rounded-xl flex-shrink-0">
                <GraduationCap size={22} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Classrooms</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.total}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                <BookOpen size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Problems</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.totalProblems}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-100 rounded-xl flex-shrink-0">
                <Users size={22} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Classrooms</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.activeCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Search Bar ── */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3 shadow-sm">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <Input
            id="search-classroom"
            placeholder="Search by class name or code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 p-2 h-auto text-sm bg-transparent"
          />

          {/* Debouncing indicator */}
          {isDebouncing && (
            <span className="text-xs text-gray-300 flex-shrink-0 animate-pulse">searching…</span>
          )}

          {/* Result count — chỉ hiện khi đã fetch xong và có search term trên URL */}
          {!isDebouncing && searchFromUrl && !loading && (
            <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
              {pagination.total} result{pagination.total !== 1 ? 's' : ''}
            </span>
          )}

          {/* Clear button */}
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Classroom Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <ClassroomCardSkeleton key={i} />
            ))}
          </div>
        ) : classrooms.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchFromUrl ? 'No classrooms found' : 'You have not joined any classroom yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {searchFromUrl
                ? 'Try searching with a different keyword'
                : 'Join a classroom to start learning and practicing programming skills'}
            </p>
            {!searchFromUrl && (
              <Button
                onClick={() => setShowJoinModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Join Your First Classroom
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom, index) => (
                <ClassroomCard
                  key={classroom._id}
                  classroom={classroom}
                  globalIndex={(pageFromUrl - 1) * ITEMS_PER_PAGE + index}
                  onClick={() => navigate(`/classrooms/${classroom.classCode}`)}
                />
              ))}
            </div>

            <ClassroomPagination
              currentPage={pageFromUrl}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.total}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
      </div>

      {/* ── Join Modal ── */}
      {showJoinModal && (
        <JoinClassroomModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
};

export default StudentClassroomsPage;