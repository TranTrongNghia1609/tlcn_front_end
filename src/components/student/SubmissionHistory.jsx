import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '../../utils/dateHelpers';

const SubmissionHistory = ({ submissions, loading }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle size={14} className="mr-1" />
            Accepted
          </Badge>
        );
      case 'Wrong Answer':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            <XCircle size={14} className="mr-1" />
            Wrong Answer
          </Badge>
        );
      case 'Time Limit Exceeded':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            <Clock size={14} className="mr-1" />
            TLE
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Clock size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Chưa có lần nộp bài nào</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <Card key={submission._id} className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold">
                  {submission.problemName}
                </h3>
                {getStatusBadge(submission.status)}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>Ngôn ngữ: <strong>{submission.language}</strong></span>
                <span>Thời gian: <strong>{submission.runtime}ms</strong></span>
                <span>Bộ nhớ: <strong>{submission.memory}MB</strong></span>
                <span>Điểm: <strong>{submission.score}/{submission.maxScore}</strong></span>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Nộp lúc {formatDate(submission.submittedAt)}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/submissions/${submission._id}`)}
            >
              <Eye size={14} className="mr-1" />
              Chi tiết
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SubmissionHistory;