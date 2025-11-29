import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  Calendar,
  ChevronRight,
  Search,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import classroomService from '@/services/classroomService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/dateHelpers';
import JoinClassroomModal from '@/components/student/JoinClassroomModal';

const StudentClassroomsPage = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const response = await classroomService.getClassrooms({ role: 'student' });
      setClassrooms(response.data.classrooms || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      toast.error('Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSuccess = () => {
    fetchClassrooms();
    setShowJoinModal(false);
  };

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.classCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lớp học của tôi</h1>
              <p className="text-gray-600 text-base">
                Quản lý các lớp học bạn đang tham gia
              </p>
            </div>

            <Button
              onClick={() => setShowJoinModal(true)}
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="lg"
            >
              <Plus size={20} className="mr-2" />
              Tham gia lớp học
            </Button>
          </div>

          {/* Stats - Subtle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-blue-200 bg-blue-50/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 p-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <GraduationCap size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Tổng lớp học</p>
                  <p className="text-2xl font-bold text-gray-900">{classrooms.length}</p>
                </div>
              </div>
            </Card>

            <Card className="border border-blue-200 bg-blue-50/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 p-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Bài tập</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classrooms.reduce((sum, c) => sum + (c.stats?.totalProblems || 0), 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border border-green-200 bg-green-50/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 p-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classrooms.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm lớp học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Classroom List */}
        {filteredClassrooms.length === 0 ? (
          <Card className="p-12 text-center">
            <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'Không tìm thấy lớp học' : 'Chưa tham gia lớp học nào'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Thử tìm kiếm với từ khóa khác'
                : 'Bắt đầu tham gia lớp học để học tập và rèn luyện kỹ năng lập trình'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowJoinModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={18} className="mr-2" />
                Tham gia lớp học đầu tiên
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
              <Card
                key={classroom._id}
                className="group hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                onClick={() => navigate(`/classrooms/${classroom.classCode}`)}
              >
                {/* Content */}
                <div className="p-3">
                  {/* Header with Class Code Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                      {classroom.className}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-mono flex-shrink-0">
                      {classroom.classCode}
                    </Badge>
                  </div>

                  {classroom.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {classroom.description}
                    </p>
                  )}

                  {/* Teacher Info */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                    <img
                      src={classroom.owner?.avatar || '/default-avatar.png'}
                      alt={classroom.owner?.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {classroom.owner?.fullName || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">Giảng viên</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <BookOpen size={14} />
                        Bài tập
                      </span>
                      <span className="font-semibold">{classroom.stats?.totalProblems || 0}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users size={14} />
                        Học viên
                      </span>
                      <span className="font-semibold">{classroom.stats?.totalStudents || 0}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        Tham gia
                      </span>
                      <span className="text-gray-500">
                        {formatDate(classroom.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={classroom.status === 'active' ? 'default' : 'secondary'}
                      className={
                        classroom.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {classroom.status === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}
                    </Badge>

                    <ChevronRight
                      size={20}
                      className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Join Classroom Modal */}
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