import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Leaderboard = ({ leaderboard, loading }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <span className="font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Chưa có dữ liệu xếp hạng</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {leaderboard.map((student, index) => {
        const rank = index + 1;
        return (
          <Card
            key={student._id}
            className={`p-6 ${
              rank <= 3 ? 'border-2 border-yellow-400 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${getRankBadge(rank)}`}>
                {getRankIcon(rank)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{student.fullName}</h3>
                  {rank <= 3 && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Top {rank}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span>
                    Điểm: <strong className="text-purple-600">{student.totalScore}</strong>
                  </span>
                  <span>
                    Hoàn thành: <strong>{student.completedProblems}</strong>/{student.totalProblems}
                  </span>
                  <span>
                    Tỷ lệ AC: <strong>{student.acceptanceRate}%</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {student.totalScore}
                </div>
                <div className="text-xs text-gray-500">điểm</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Leaderboard;