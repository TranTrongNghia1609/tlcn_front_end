import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  FileText,
  Trophy,
  BarChart3,
  Users,
  Calendar,
  Clock,
  GraduationCap,
  LogOut,
  Home,
  MessageSquare
} from 'lucide-react';
import { useStudentClassroom } from '@/context/StudentClassroomContext';
import ClassroomStats from '@/components/student/ClassroomStats';
import ProblemList from '@/components/student/ProblemList';
import MaterialList from '@/components/student/MaterialList';
import SubmissionHistory from '@/components/student/SubmissionHistory';
import Leaderboard from '@/components/student/Leaderboard';
import StudentExamList from '@/components/student/StudentExamList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LeaveClassroomModal from '@/components/student/LeaveClassroomModal';
import DiscussionList from '@/components/student/DiscussionList';
import { formatDate } from '@/utils/dateHelpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useStudentClassroomData } from '@/hooks/useStudentClassroomData';

// Skeleton Components
const ClassroomHeaderSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start gap-6">
      <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-2/3 max-w-2xl" />
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  </Card>
);

const SidebarSkeleton = () => (
  <div className="w-64 flex-shrink-0 space-y-4">
    {/* Teacher Card Skeleton */}
    <Card className="p-4">
      <div className="text-center">
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
        <Skeleton className="h-3 w-16 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto mb-1" />
        <Skeleton className="h-3 w-40 mx-auto" />
      </div>
    </Card>

    {/* Menu Items Skeleton */}
    <Card className="p-3">
      <div className="space-y-1">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </Card>

    {/* Leave Button Skeleton */}
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

const OverviewCardSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-8 w-24 rounded" />
    </div>
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  </Card>
);

const StudentClassroomDetailPage = () => {
  const { classCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  //  Determine active tab from pathname
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.endsWith('/problems')) return 'problems';
    if (path.endsWith('/exams')) return 'exams';
    if (path.endsWith('/materials')) return 'materials';
    if (path.endsWith('/leaderboard')) return 'leaderboard';
    if (path.endsWith('/discussions')) return 'discussions'; 
    if (path.endsWith('/overview')) return 'overview';
    return 'overview'; // Default
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { leaveClassroom } = useStudentClassroom();

  const {
    classroom,
    problems,
    materials,
    submissions,
    leaderboard,
    stats,
    loading,
    error,
    refresh,
  } = useStudentClassroomData(classCode);

  // Update activeTab when location changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Handle tab change with URL navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Navigate to appropriate route
    if (tab === 'overview') {
      navigate(`/classrooms/${classCode}`);
    } else {
      navigate(`/classrooms/${classCode}/${tab}`);
    }
  };

  const handleLeaveClassroomClick = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveClassroom(classCode);
      toast.success('Đã rời khỏi lớp học thành công');
      navigate('/classrooms');
    } catch (error) {
      console.error('❌ Error leaving classroom:', error);
      toast.error('Không thể rời lớp học. Vui lòng thử lại!');
      setIsLeaving(false);
      setShowLeaveModal(false);
    }
  };

  const handleNavigateToProblem = (problemId) => {
    console.log('🎯 Navigating to problem:', {
      classCode,
      classroomId: classroom?._id,
      problemId
    });
    
    navigate(`/classrooms/${classCode}/problems/${problemId}`, {
      state: {
        classCode,
        classroomId: classroom?._id,
        fromClassroom: true
      }
    });
  };

  const safeProblems = Array.isArray(problems) ? problems : [];
  const safeMaterials = Array.isArray(materials) ? materials : [];

  const menuItems = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: BarChart3,
      path: ''
    },
    {
      id: 'problems',
      label: 'Bài tập',
      icon: BookOpen,
      path: 'problems'
    },
    {
      id: 'exams',
      label: 'Kỳ thi',
      icon: Trophy,
      path: 'exams'
    },
    // {
    //   id: 'discussions', 
    //   label: 'Thảo luận',
    //   icon: MessageSquare,
    //   path: 'discussions'
    // },
    {
      id: 'materials',
      label: 'Tài liệu',
      icon: FileText,
      path: 'materials'
    },
    // {
    //   id: 'leaderboard',
    //   label: 'Bảng điểm',
    //   icon: BarChart3,
    //   path: 'leaderboard'
    // },
  ];

  // Loading State - Show Skeleton
  if (loading && !classroom) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ClassroomHeaderSkeleton />
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 pb-6">
          <div className="flex gap-6">
            <SidebarSkeleton />
            
            {/* Main Content Area Skeleton */}
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-3 w-16 mb-2" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Overview Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OverviewCardSkeleton />
                  <OverviewCardSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-12 text-center max-w-md">
          <GraduationCap size={64} className="mx-auto text-red-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={refresh} className="mr-2">
            Thử lại
          </Button>
          <Button variant="outline" onClick={() => navigate('/classrooms')}>
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-12 text-center max-w-md">
          <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy lớp học
          </h3>
          <p className="text-gray-500 mb-6">
            Lớp học không tồn tại hoặc bạn chưa tham gia lớp học này
          </p>
          <Button onClick={() => navigate('/classrooms')}>
            <Home size={16} className="mr-2" />
            Quay lại danh sách lớp học
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LeaveClassroomModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleConfirmLeave}
        classroomName={classroom.className}
        loading={isLeaving}
      />

      {/* Classroom Info Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-200">
              <GraduationCap size={40} className="text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {classroom.className}
                </h1>
                <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-mono text-sm font-semibold">
                  {classroom.classCode}
                </div>
              </div>

              {classroom.description && (
                <p className="text-gray-600 text-sm max-w-3xl mb-3">
                  {classroom.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span>{classroom.students?.length || 0} học viên</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Bắt đầu: {formatDate(classroom.createdAt)}</span>
                </div>

                {classroom.endDate && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Kết thúc: {formatDate(classroom.endDate)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <GraduationCap size={14} />
                  <span>{classroom.semester || 'HK1 2024-2025'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 space-y-4">
            {classroom.owner && (
              <Card className="p-4">
                <div className="text-center">
                  <img
                    src={classroom.owner.avatar || '/default-avatar.png'}
                    alt={classroom.owner.fullName}
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-blue-200"
                  />
                  <p className="text-xs text-gray-500 mb-1">Giảng viên</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {classroom.owner.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {classroom.owner.email}
                  </p>
                </div>
              </Card>
            )}

            <Card className="p-3">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      disabled={loading}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all text-sm',
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
                        loading && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={18} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </Card>

            <Button
              variant="outline"
              onClick={handleLeaveClassroomClick}
              disabled={isLeaving || loading}
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut size={16} className="mr-2" />
              {isLeaving ? 'Đang rời...' : 'Rời lớp'}
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <ClassroomStats
                  classCode={classCode}
                  stats={stats}
                  problems={safeProblems}
                  materials={safeMaterials}
                  loading={loading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" />
                        Bài tập gần đây
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTabChange('problems')}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {loading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, index) => (
                          <Skeleton key={index} className="h-14 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : safeProblems.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Chưa có bài tập nào</p>
                    ) : (
                      <div className="space-y-2">
                        {safeProblems.slice(0, 3).map((problem) => (
                          <div
                            key={problem._id}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent cursor-pointer transition-all"
                            onClick={() => handleNavigateToProblem(problem.shortId || problem._id)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{problem.name}</span>
                              {problem.progress?.status === 'completed' && (
                                <span className="text-green-600 text-sm">✓ Hoàn thành</span>
                              )}
                              {problem.progress?.status === 'attempted' && (
                                <span className="text-blue-600 text-sm">⏱ Đang làm</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        Tài liệu mới
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTabChange('materials')}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {loading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, index) => (
                          <Skeleton key={index} className="h-14 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : safeMaterials.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Chưa có tài liệu nào</p>
                    ) : (
                      <div className="space-y-2">
                        {safeMaterials.slice(0, 3).map((material) => (
                          <div
                            key={material._id}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-blue-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 truncate">{material.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {/* Problems Tab */}
            {activeTab === 'problems' && (
              <ProblemList
                classCode={classCode}
                classroomId={classroom._id}
                problems={safeProblems}
                loading={loading}
                onRefresh={refresh}
              />
            )}

            {/* Exams Tab */}
            {activeTab === 'exams' && (
              <StudentExamList 
                classCode={classCode}
                classroomId={classroom?._id}
               />
            )}


            {/* {activeTab === 'discussions' && (
              <DiscussionList 
                classCode={classCode}
                loading={loading}
              />
            )} */}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <MaterialList
                classCode={classCode}
                materials={safeMaterials}
                loading={loading}
              />
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <SubmissionHistory classCode={classCode} />
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <Leaderboard classCode={classCode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentClassroomDetailPage;