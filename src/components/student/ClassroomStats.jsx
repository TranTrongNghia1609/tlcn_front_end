import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, BookOpen } from 'lucide-react';

const ClassroomStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      icon: BookOpen,
      label: 'Tổng bài tập',
      value: stats.totalProblems || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: CheckCircle,
      label: 'Đã hoàn thành',
      value: stats.completedProblems || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Clock,
      label: 'Đang làm',
      value: stats.inProgressProblems || 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: XCircle,
      label: 'Chưa làm',
      value: stats.notStartedProblems || 0,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`p-6 ${stat.bgColor} border-0`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon size={28} className={stat.color} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ClassroomStats;