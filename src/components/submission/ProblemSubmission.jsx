import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Code,
  TrendingUp,
  Eye,
  ArrowLeft,
  Calendar,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { ComboBox } from '../common/Combobox';
import { languages } from '@/lib/utils';

const ProblemSubmissions = ({ problemId, problemName, onBack }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  // Mock data cho submissions của 1 bài cụ thể
  const problemSubmissions = [
    {
      id: 'SUB001',
      status: 'Accepted',
      language: 'JavaScript',
      runtime: '68ms',
      memory: '42.1MB',
      submittedAt: '2025-01-13 17:45:32',
      score: 100,
      testCases: { passed: 57, total: 57 },
      attempt: 4
    },
    {
      id: 'SUB002',
      status: 'Wrong Answer',
      language: 'JavaScript',
      runtime: '72ms',
      memory: '41.8MB',
      submittedAt: '2025-01-13 17:30:15',
      score: 0,
      testCases: { passed: 45, total: 57 },
      attempt: 3
    },
    {
      id: 'SUB003',
      status: 'Time Limit Exceeded',
      language: 'Python',
      runtime: 'TLE',
      memory: '16.2MB',
      submittedAt: '2025-01-13 16:45:20',
      score: 60,
      testCases: { passed: 34, total: 57 },
      attempt: 2
    },
    {
      id: 'SUB004',
      status: 'Runtime Error',
      language: 'JavaScript',
      runtime: 'N/A',
      memory: 'N/A',
      submittedAt: '2025-01-13 15:20:10',
      score: 0,
      testCases: { passed: 12, total: 57 },
      attempt: 1
    }
  ];

  // Statistics calculation
  const stats = useMemo(() => {
    const total = problemSubmissions.length;
    const accepted = problemSubmissions.filter(s => s.status === 'Accepted').length;
    const wrongAnswer = problemSubmissions.filter(s => s.status === 'Wrong Answer').length;
    const tle = problemSubmissions.filter(s => s.status === 'Time Limit Exceeded').length;
    const runtimeError = problemSubmissions.filter(s => s.status === 'Runtime Error').length;
    const compilationError = problemSubmissions.filter(s => s.status === 'Compilation Error').length;
    
    const bestScore = Math.max(...problemSubmissions.map(s => s.score));
    const totalAttempts = total;
    const successRate = total > 0 ? (accepted / total * 100).toFixed(1) : 0;
    
    // Progress tracking
    const maxTestCases = Math.max(...problemSubmissions.map(s => s.testCases.passed));
    const progressOverTime = problemSubmissions.reverse().map((sub, index) => ({
      attempt: index + 1,
      testsPassed: sub.testCases.passed,
      percentage: (sub.testCases.passed / sub.testCases.total * 100).toFixed(1)
    }));

    return {
      total,
      accepted,
      wrongAnswer,
      tle,
      runtimeError,
      compilationError,
      bestScore,
      totalAttempts,
      successRate,
      maxTestCases,
      progressOverTime
    };
  }, [problemSubmissions]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Wrong Answer':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Time Limit Exceeded':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Runtime Error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'Compilation Error':
        return <Code className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Accepted': 'bg-green-100 text-green-800 border-green-200',
      'Wrong Answer': 'bg-red-100 text-red-800 border-red-200',
      'Time Limit Exceeded': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Runtime Error': 'bg-orange-100 text-orange-800 border-orange-200',
      'Compilation Error': 'bg-purple-100 text-purple-800 border-purple-200'
    };

    return (
      <Badge className={`${variants[status]} flex items-center gap-1 px-2 py-1`}>
        {getStatusIcon(status)}
        <span className="text-xs">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className='text-2xl font-bold'>My Submission</div>
      {/* Overview Stats */}
      <div className="">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-green-800">{stats.successRate}%</p>
                <p className="text-xs text-green-600">{stats.accepted} / {stats.total} submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Attempts</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalAttempts}</p>
                <p className="text-xs text-blue-600">across all languages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My submission */}
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle>Last submisson</CardTitle>
            <ComboBox
              options={languages}
              placeholder="Select language..."
              defaultValue="py"
              className={'text-2xl'}
              // onChange={changLanguage}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Attempt</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Language</th>
                  <th className="text-left p-2">Runtime</th>
                  <th className="text-left p-2">Memory</th>
                  <th className="text-left p-2">Test Cases</th>
                </tr>
              </thead>
              <tbody>
                {problemSubmissions.map((submission, index) => {
                  const prevSubmission = problemSubmissions[index + 1];
                  const improvement = prevSubmission ? 
                    submission.testCases.passed - prevSubmission.testCases.passed : 0;
                  
                  return (
                    <tr key={submission.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-gray-600">#{submission.attempt}</td>
                      <td className="p-2">{getStatusBadge(submission.status)}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {submission.language}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono">{submission.runtime}</td>
                      <td className="p-2 font-mono">{submission.memory}</td>
                      <td className="p-2">
                        <span className={`font-semibold ${
                          submission.testCases.passed === submission.testCases.total 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {submission.testCases.passed}/{submission.testCases.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default ProblemSubmissions;