import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  Trophy, 
  BarChart3, 
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  GraduationCap,
  LogOut,
  Home
} from 'lucide-react';
import { useStudentClassroom } from '@/context/StudentClassroomContext';
import ClassroomStats from '@/components/student/ClassroomStats';
import ProblemList from '@/components/student/ProblemList';
import MaterialList from '@/components/student/MaterialList';
import SubmissionHistory from '@/components/student/SubmissionHistory';
import Leaderboard from '@/components/student/Leaderboard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/dateHelpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const StudentClassroomDetailPage = () => {
  const { classCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const {
    classroom,
    problems,
    materials,
    submissions,
    leaderboard,
    stats,
    loading,
    fetchClassroom,
    fetchStats,
    leaveClassroom,
  } = useStudentClassroom();

  // ✅ Only fetch classroom and stats initially
  useEffect(() => {
    if (classCode) {
      loadInitialData();
    }
  }, [classCode]);

  const loadInitialData = async () => {
    console.log('🔄 Loading initial data for:', classCode);
    try {
      await Promise.all([
        fetchClassroom(classCode),
        fetchStats(classCode),
      ]);
      console.log('✅ Initial data loaded');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      toast.error('Không thể tải thông tin lớp học');
    }
  };

  const handleTabChange = (tab) => {
    console.log('📑 Switching to tab:', tab);
    setActiveTab(tab);
    // ✅ Each component will fetch its own data when rendered
  };

  const handleLeaveClassroom = async () => {
    if (window.confirm('Bạn có chắc muốn rời khỏi lớp học này?')) {
      try {
        await leaveClassroom(classCode);
        navigate('/student/classrooms');
      } catch (error) {
        console.error('Error leaving classroom:', error);
      }
    }
  };

  const safeProblems = Array.isArray(problems) ? problems : [];
  const safeMaterials = Array.isArray(materials) ? materials : [];
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];

  // Sidebar menu items
  const menuItems = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: BarChart3,
      count: null,
    },
    {
      id: 'problems',
      label: 'Bài tập',
      icon: BookOpen,
      count: safeProblems.length || null,
    },
    {
      id: 'materials',
      label: 'Tài liệu',
      icon: FileText,
      count: safeMaterials.length || null,
    },
    {
      id: 'submissions',
      label: 'Lịch sử nộp',
      icon: Clock,
      count: safeSubmissions.length || null,
    },
    {
      id: 'leaderboard',
      label: 'Bảng điểm',
      icon: Trophy,
      count: null,
    },
  ];

  if (loading && !classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
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
          <Button onClick={() => navigate('/student/classrooms')}>
            <Home size={16} className="mr-2" />
            Quay lại danh sách lớp học
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* White Header Section */}
      <div className="bg-white">
        {/* Back Button Bar */}
        <div className="">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/student/classrooms')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft size={18} className="mr-2" />
                Quay lại
              </Button>

              <Button
                variant="outline"
                onClick={handleLeaveClassroom}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Rời lớp
              </Button>
            </div>
          </div>
        </div>

        {/* Classroom Info */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            {/* Class Icon/Thumbnail */}
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
              <GraduationCap size={48} className="text-white" />
            </div>

            {/* Class Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {classroom.className}
                    </h1>
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-mono text-sm font-semibold">
                      {classroom.classCode}
                    </div>
                    {classroom.owner && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 w-fit">
                  <img
                    src={classroom.owner.avatar || '/default-avatar.png'}
                    alt={classroom.owner.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Giảng viên</p>
                    <p className="text-sm font-medium text-gray-900">
                      {classroom.owner.fullName}
                    </p>
                  </div>
                </div>
              )}
                  </div>

                  {classroom.description && (
                    <p className="text-gray-600 text-base max-w-3xl mb-3">
                      {classroom.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{classroom.students?.length || 0} học viên</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Bắt đầu: {formatDate(classroom.createdAt)}</span>
                </div>

                {classroom.endDate && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Kết thúc: {formatDate(classroom.endDate)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  <span>{classroom.semester || 'HK1 2024-2025'}</span>
                </div>
                
              </div>

              {/* Teacher Info */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <Card className="w-72 h-fit sticky top-6 p-4 flex-shrink-0">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {item.count !== null && (
                      <span
                        className={cn(
                          'text-sm font-semibold px-2 py-0.5 rounded-full',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 text-gray-700'
                        )}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </Card>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <ClassroomStats stats={stats} classCode={classCode} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Problems Preview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen size={20} className="text-purple-600" />
                        Bài tập gần đây
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('problems')}
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {safeProblems.length === 0 && (
                      <p className="text-center text-gray-500 py-8">Chưa có bài tập nào</p>
                    )}
                  </Card>

                  {/* Recent Materials Preview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        Tài liệu mới
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('materials')}
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {safeMaterials.length === 0 && (
                      <p className="text-center text-gray-500 py-8">Chưa có tài liệu nào</p>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {/* ✅ Problems Tab - Component fetches its own data */}
            {activeTab === 'problems' && (
              <ProblemList classCode={classCode} />
            )}

            {/* ✅ Materials Tab - Component fetches its own data */}
            {activeTab === 'materials' && (
              <MaterialList classCode={classCode} />
            )}

            {/* ✅ Submissions Tab - Component fetches its own data */}
            {activeTab === 'submissions' && (
              <SubmissionHistory classCode={classCode} />
            )}

            {/* ✅ Leaderboard Tab - Component fetches its own data */}
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