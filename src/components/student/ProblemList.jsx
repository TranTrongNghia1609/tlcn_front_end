import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

import { 
  BookOpen, 
  Search,
  CheckCircle2,
  Circle,
  Clock,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProblemList = ({ classCode, classroomId ,problems = [], loading = false, onRefresh }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const safeProblems = Array.isArray(problems) ? problems : [];

  const filteredProblems = safeProblems.filter(problem => {
    const matchesSearch = problem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  console.log('📚 ProblemList - Filtered problems:', filteredProblems.length);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  const getStatusIcon = (progress) => {
    if (progress?.status === 'completed') {
      return <CheckCircle2 size={24} className="text-green-600" />;
    }
    if (progress?.status === 'attempted') {
      return <Clock size={24} className="text-yellow-600" />;
    }
    return <Circle size={24} className="text-gray-300" />;
  };

  // Handle navigate with classCode
  const handleProblemClick = (problem) => {
    const problemId = problem.shortId || problem._id;
    navigate(`/classrooms/${classCode}/problems/${problemId}`, {
      state: { 
        classCode,
        classroomId, 
        fromClassroom: true 
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen size={28} className="text-purple-600" />
            Bài tập
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredProblems.length} bài tập trong lớp học
          </p>
        </div>
        
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm bài tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
      </Card>

      {/* Problem List */}
      {filteredProblems.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'Không tìm thấy bài tập' : 'Chưa có bài tập nào'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Giảng viên chưa thêm bài tập nào vào lớp học này'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredProblems.map((problem, index) => (
            <Card
              key={problem._id || problem.shortId}
              className="p-5 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleProblemClick(problem)}
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(problem.progress)}
                </div>

                {/* Problem Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                        {index + 1}. {problem.name}
                      </h3>
                      {problem.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {problem.description}
                        </p>
                      )}
                    </div>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {getDifficultyLabel(problem.difficulty)}
                    </Badge>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex gap-1">
                        {problem.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {problem.acceptanceRate && (
                      <span className="text-green-600">
                        ✓ {problem.acceptanceRate}% AC
                      </span>
                    )}

                    {problem.submissions && (
                      <span>
                        {problem.submissions} lượt nộp
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;