import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock, GraduationCap, LogOut } from 'lucide-react';
import { formatDate } from '@/utils/dateHelpers';
import { useNavigate } from 'react-router-dom';
import { useStudentClassroom } from '@/context/StudentClassroomContext';

const ClassroomHeader = ({ classroom }) => {
  const navigate = useNavigate();
  const { leaveClassroom } = useStudentClassroom();

  const handleLeaveClassroom = async () => {
    if (window.confirm('Bạn có chắc muốn rời khỏi lớp học này?')) {
      try {
        await leaveClassroom(classroom.classCode);
        navigate('/classrooms');
      } catch (error) {
        console.error('Error leaving classroom:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {classroom.classCode}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <GraduationCap size={14} className="mr-1" />
                {classroom.semester || 'HK1 2024-2025'}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-3">{classroom.className}</h1>
            
            {classroom.description && (
              <p className="text-white/90 text-lg mb-4 max-w-3xl">
                {classroom.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
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
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLeaveClassroom}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <LogOut size={16} className="mr-2" />
            Rời lớp
          </Button>
        </div>

        {/* Teacher Info */}
        {classroom.teacher && (
          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <img
              src={classroom.teacher.avatar || '/default-avatar.png'}
              alt={classroom.teacher.fullName}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <div>
              <p className="font-semibold">Giảng viên</p>
              <p className="text-white/90">{classroom.teacher.fullName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomHeader;