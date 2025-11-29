import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Home
} from 'lucide-react';
import { useStudentClassroom } from '@/context/StudentClassroomContext';
import ClassroomStats from '@/components/student/ClassroomStats';
import ProblemList from '@/components/student/ProblemList';
import MaterialList from '@/components/student/MaterialList';
import SubmissionHistory from '@/components/student/SubmissionHistory';
import Leaderboard from '@/components/student/Leaderboard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LeaveClassroomModal from '@/components/student/LeaveClassroomModal';
import { formatDate } from '@/utils/dateHelpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useStudentClassroomData } from '@/hooks/useStudentClassroomData';

const StudentClassroomDetailPage = () => {
  const { classCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { leaveClassroom } = useStudentClassroom();

  // Use centralized hook for all data
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
  const handleTabChange = (tab) => {
    console.log('📑 Switching to tab:', tab);
    setActiveTab(tab);
      console.log(classroom);

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
      console.error(' Error leaving classroom:', error);
      toast.error('Không thể rời lớp học. Vui lòng thử lại!');
      setIsLeaving(false);
      setShowLeaveModal(false);
    }
  };

  // Handle navigate to problem with classCode
  const handleNavigateToProblem = (problemId) => {
    console.log('🎯 Navigating to problem:', {
      classCode,
      classroomId: classroom?._id,
      problemId
    });
    
    navigate(`/classrooms/${classCode}/problems/${problemId}`, {
      state: {
        classCode,
        classroomId: classroom?._id, // ✅ Truyền classroomId
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
    },
    {
      id: 'problems',
      label: 'Bài tập',
      icon: BookOpen,
    },
    {
      id: 'materials',
      label: 'Tài liệu',
      icon: FileText,
    },
    
    {
      id: 'leaderboard',
      label: 'Bảng điểm',
      icon: Trophy,
    },
  ];

  if (loading && !classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
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
            {/* Class Icon */}
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-200">
              <GraduationCap size={40} className="text-white" />
            </div>

            {/* Class Details */}
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

              {/* Meta Info */}
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
            {/* Teacher Info Card */}
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

            {/* Navigation Menu */}
            <Card className="p-3">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all text-sm',
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
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

            {/* Leave Button */}
            <Button
              variant="outline"
              onClick={handleLeaveClassroomClick}
              disabled={isLeaving}
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut size={16} className="mr-2" />
              Rời lớp
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
                  {/* Recent Problems Preview */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" />
                        Bài tập gần đây
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('problems')}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {safeProblems.length === 0 ? (
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
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {safeMaterials.length === 0 ? (
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