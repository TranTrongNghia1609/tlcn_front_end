import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Lock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Eye,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import classroomService from '@/services/classroomService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDateTime, formatDuration, getExamStatus } from '@/utils/dateHelpers';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// ✅ Add classroomId prop
const StudentExamList = ({ classCode, classroomId }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (classCode) {
      fetchExams();
    }
  }, [classCode, filter]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = {
        status: filter !== 'all' ? filter : undefined,
        page: 1,
        size: 50
      };

      const response = await classroomService.getExams(classCode, params);
      console.log('📝 Exams response:', response.data);
      setExams(response.data.exams || []);
    } catch (error) {
      console.error('❌ Error fetching exams:', error);
      toast.error('Không thể tải danh sách kỳ thi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewExam = (exam) => {
    const status = getExamStatus(exam.startTime, exam.endTime);
    
    if (status === 'upcoming') {
      toast.info('Kỳ thi chưa bắt đầu');
      return;
    }

    // ✅ Navigate with classroom context
    console.log('🎯 Navigating to exam:', {
      classCode,
      classroomId,
      examCode: exam.code,
      examClassRoomId: exam.classRoom?._id
    });

    navigate(`/classrooms/${classCode}/contests/${exam.code}`, {
      state: {
        classroomId: classroomId || exam.classRoom?._id, // ✅ Use prop or exam data
        classCode: classCode,
        fromClassroom: true
      }
    });
  };

  // ...rest of the component remains the same...
  const getStatusBadge = (exam) => {
    const status = getExamStatus(exam.startTime, exam.endTime);
    
    switch (status) {
      case 'upcoming':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Clock size={14} />
            Sắp diễn ra
          </div>
        );
      case 'ongoing':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium animate-pulse">
            <PlayCircle size={14} />
            Đang diễn ra
          </div>
        );
      case 'ended':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            <CheckCircle2 size={14} />
            Đã kết thúc
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButton = (exam) => {
    const status = getExamStatus(exam.startTime, exam.endTime);
    
    if (status === 'upcoming') {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="text-gray-500 cursor-not-allowed"
        >
          <Clock size={16} className="mr-2" />
          Chưa bắt đầu
        </Button>
      );
    }

    if (status === 'ongoing') {
      return (
        <Button
          onClick={() => handleViewExam(exam)}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <PlayCircle size={16} className="mr-2" />
          Tham gia
        </Button>
      );
    }

    return (
      <Button
        onClick={() => handleViewExam(exam)}
        variant="outline"
        size="sm"
      >
        <Eye size={16} className="mr-2" />
        Xem kết quả
      </Button>
    );
  };

  const filteredExams = exams;

  const filterButtons = [
    { key: 'all', label: 'Tất cả', count: exams.length },
    { key: 'upcoming', label: 'Sắp diễn ra', count: exams.filter(e => getExamStatus(e.startTime, e.endTime) === 'upcoming').length },
    { key: 'ongoing', label: 'Đang diễn ra', count: exams.filter(e => getExamStatus(e.startTime, e.endTime) === 'ongoing').length },
    { key: 'ended', label: 'Đã kết thúc', count: exams.filter(e => getExamStatus(e.startTime, e.endTime) === 'ended').length }
  ];

  if (loading) {
    return (
      <Card className="p-8">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={28} />
            Kỳ thi
          </h2>
          <p className="text-gray-600 mt-1">Danh sách các kỳ thi trong lớp học</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {filterButtons.map((btn) => (
          <Button
            key={btn.key}
            variant={filter === btn.key ? 'default' : 'outline'}
            onClick={() => setFilter(btn.key)}
            className={cn(
              'transition-all',
              filter === btn.key
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600'
            )}
          >
            {btn.label}
            <span className={cn(
              'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
              filter === btn.key
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
            )}>
              {btn.count}
            </span>
          </Button>
        ))}
      </div>

      {/* Exams List */}
      {filteredExams.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có kỳ thi nào
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Giáo viên chưa tạo kỳ thi nào cho lớp học này'
              : `Không có kỳ thi ${filterButtons.find(b => b.key === filter)?.label.toLowerCase()}`
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredExams.map((exam) => {
            const status = getExamStatus(exam.startTime, exam.endTime);
            const isOngoing = status === 'ongoing';

            return (
              <Card
                key={exam._id}
                className={cn(
                  'p-6 hover:shadow-lg transition-all duration-200',
                  isOngoing && 'border-2 border-green-500 shadow-md shadow-green-100'
                )}
              >
                <div className="flex items-start justify-between">
                  {/* Left: Exam Info */}
                  <div className="flex-1">
                    {/* Title & Status */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        isOngoing ? 'bg-green-100' : 'bg-blue-100'
                      )}>
                        <Trophy 
                          size={24} 
                          className={isOngoing ? 'text-green-600' : 'text-blue-600'} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {exam.title}
                          </h3>
                          {getStatusBadge(exam)}
                        </div>
                        
                        {exam.isPrivate && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                            <Lock size={14} />
                            <span>Kỳ thi riêng tư</span>
                          </div>
                        )}

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {exam.description}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-14">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Bắt đầu: {formatDateTime(exam.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Kết thúc: {formatDateTime(exam.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>{exam.problems?.length || 0} bài tập</span>
                      </div>
                    </div>

                    {/* Registered Info */}
                    {exam.isRegistered && (
                      <div className="flex items-center gap-2 mt-3 ml-14 text-sm text-green-600">
                        <CheckCircle2 size={16} />
                        <span className="font-medium">Đã đăng ký</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Action Button */}
                  <div className="ml-4">
                    {getActionButton(exam)}
                  </div>
                </div>

                {/* Warning for ongoing exam */}
                {isOngoing && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <AlertCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      <strong>Kỳ thi đang diễn ra!</strong> Còn{' '}
                      {formatDuration(new Date(exam.endTime) - new Date())} để hoàn thành.
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExamList;