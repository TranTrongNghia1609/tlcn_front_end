import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, BookOpen, TrendingUp, Award } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ClassroomStats = ({ classCode, stats, problems = [], materials = [], loading = false }) => {
  // ✅ Calculate stats from props
  const safeProblems = Array.isArray(problems) ? problems : [];
  const safeMaterials = Array.isArray(materials) ? materials : [];

  const completedProblems = safeProblems.filter(p => p.progress?.status === 'completed').length;
  const attemptedProblems = safeProblems.filter(p => p.progress?.status === 'attempted').length;
  const notAttemptedProblems = safeProblems.filter(
    p => !p.progress || p.progress?.status === 'not_attempted'
  ).length;

  const calculatedStats = {
    totalProblems: safeProblems.length,
    completedProblems,
    attemptedProblems,
    notAttemptedProblems,
    completionRate: safeProblems.length > 0 
      ? Math.round((completedProblems / safeProblems.length) * 100)
      : 0,
    totalMaterials: safeMaterials.length,
    ...stats, // Merge with stats from API if available
  };

  console.log('📊 ClassroomStats - Calculated:', calculatedStats);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const statCards = [
    {
      icon: BookOpen,
      label: 'Tổng bài tập',
      value: calculatedStats.totalProblems,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subtext: 'Trong lớp học',
    },
    {
      icon: CheckCircle,
      label: 'Đã hoàn thành',
      value: calculatedStats.completedProblems,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subtext: `${calculatedStats.completedPercentage || Math.round((calculatedStats.completedProblems / calculatedStats.totalProblems) * 100) || 0}% hoàn thành`,
    },
    {
      icon: Clock,
      label: 'Đang làm',
      value: calculatedStats.attemptedProblems,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subtext: `${calculatedStats.attemptedPercentage || Math.round((calculatedStats.attemptedProblems / calculatedStats.totalProblems) * 100) || 0}%`,
    },
    {
      icon: XCircle,
      label: 'Chưa làm',
      value: calculatedStats.notAttemptedProblems,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      subtext: `${calculatedStats.notAttemptedPercentage || Math.round((calculatedStats.notAttemptedProblems / calculatedStats.totalProblems) * 100) || 0}%`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`p-6 ${stat.bgColor} border-0 hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.subtext && (
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.subtext}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon size={28} className={stat.color} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Progress Bar */}
      {calculatedStats.totalProblems > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Tiến độ học tập
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-purple-600">
                {calculatedStats.completionRate}%
              </span>
              {calculatedStats.averageScore > 0 && (
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                  <Award size={16} className="text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700">
                    {calculatedStats.averageScore} điểm TB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
            <div className="flex h-full">
              {/* Completed */}
              <div
                className="bg-green-500 transition-all duration-500"
                style={{
                  width: `${(calculatedStats.completedProblems / calculatedStats.totalProblems) * 100}%`,
                }}
                title={`Hoàn thành: ${calculatedStats.completedProblems}`}
              />
              
              {/* Attempted */}
              <div
                className="bg-yellow-500 transition-all duration-500"
                style={{
                  width: `${(calculatedStats.attemptedProblems / calculatedStats.totalProblems) * 100}%`,
                }}
                title={`Đang làm: ${calculatedStats.attemptedProblems}`}
              />
              
              {/* Not Attempted */}
              <div
                className="bg-gray-300 transition-all duration-500"
                style={{
                  width: `${(calculatedStats.notAttemptedProblems / calculatedStats.totalProblems) * 100}%`,
                }}
                title={`Chưa làm: ${calculatedStats.notAttemptedProblems}`}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">
                Hoàn thành ({calculatedStats.completedProblems})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-600">
                Đang làm ({calculatedStats.attemptedProblems})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-gray-600">
                Chưa làm ({calculatedStats.notAttemptedProblems})
              </span>
            </div>
          </div>

          {/* Additional Info */}
          {(calculatedStats.totalScore > 0 || calculatedStats.lastSubmission) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                {calculatedStats.totalScore > 0 && (
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-purple-600" />
                    <span>Tổng điểm: <strong className="text-gray-900">{calculatedStats.totalScore}</strong></span>
                  </div>
                )}
                
                {calculatedStats.lastSubmission && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    <span>
                      Lần nộp cuối: {' '}
                      <strong className="text-gray-900">
                        {new Date(calculatedStats.lastSubmission).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Recent Completions */}
      {calculatedStats.recentCompletions && calculatedStats.recentCompletions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Bài hoàn thành gần đây
          </h3>
          <div className="space-y-2">
            {calculatedStats.recentCompletions.map((completion, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {completion.problemShortId}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                    <Award size={14} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      {completion.score} điểm
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(completion.completedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  ); 
};

export default ClassroomStats;