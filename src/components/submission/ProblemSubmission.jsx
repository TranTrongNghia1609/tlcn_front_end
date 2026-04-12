import React, { useState, useMemo, useEffect } from 'react';
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
  Target,
  Activity
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ComboBox } from '../common/Combobox';
import { languages } from '@/lib/utils';
import { getSubmissionById, getSubmissionByUserId } from '@/services/submissionService';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useProblem } from '@/context/ProblemContext';
import { submissionsStore } from '@/zustand/store';
import { useSocket } from '@/context/SocketContext';
const ProblemSubmissions = ({contestParticipant=null, classroomId = null}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  // const [submissions, setProblemSubmissions] = useState([]);
  const [problemSubmissionPagination, setProblemSubmissionPagination] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { currentProblem, loading } = useProblem(); 
  const [ pageActive, setPageActive ] = useState(1);
  const setProblemSubmissions = submissionsStore((state) => state.setProblemSubmissions)
  const submissions = submissionsStore((state) => state.submissions);
  const setCurrentSubmission = submissionsStore((state) => state.setCurrentSubmission);
  const updateSubmission = submissionsStore((state) => state.updateSubmission);
  const { on, off } = useSocket();

  
  useEffect(()=>{
    const fetchProblemSubmission = async () => {
      if (isAuthenticated && !loading){
        let shouldExcludeClassroom = false;
        
        if (contestParticipant) {
          // Nếu là contest, không exclude (contest có thể có hoặc không có classroom)
          shouldExcludeClassroom = false;
        } else if (classroomId) {
          // Nếu có classroomId, lấy submissions trong classroom đó
          shouldExcludeClassroom = false;
        } else {
          // Nếu không có classroomId và không phải contest
          // => Đang ở trang problem bình thường => chỉ lấy public submissions
          shouldExcludeClassroom = true;
        }

        const response = await getSubmissionByUserId(
          user.id, 
          currentProblem._id, 
          pageActive, 
          contestParticipant, 
          'all' ,
          classroomId, 
          shouldExcludeClassroom);
        setProblemSubmissions(response.data.content);
        setProblemSubmissionPagination(response.data);

        // await fetchSubmissions(user.id, currentProblem._id, pageActive);
      }
    }
    fetchProblemSubmission();
  }, [pageActive, classroomId]);

  useEffect(()=>{
    console.log('Submission get from component', submissions);
  }, [submissions]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = problemSubmissionPagination.total;
    const accepted = submissions.filter(s => s.status === 'Accepted').length;
    const wrongAnswer = submissions.filter(s => s.status === 'Wrong Answer').length;
    const tle = submissions.filter(s => s.status === 'Time Limit Exceeded').length;
    const runtimeError = submissions.filter(s => s.status === 'Runtime Error').length;
    const compilationError = submissions.filter(s => s.status === 'Compilation Error').length;
    
    const bestScore = Math.max(...submissions.map(s => s.score));
    const totalAttempts = total;
    const successRate = total > 0 ? (accepted / total * 100).toFixed(1) : 0;
    
    // Progress tracking
    const maxTestCases = Math.max(...submissions.map(s => s.passed || 0));
    const progressOverTime = submissions.map((sub, index) => ({
      attempt: index + 1,
      testsPassed: sub.passed || 0,
      percentage: (sub.passed || 0 / (sub.total || 10) * 100).toFixed(1)
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
  }, [submissions]);

  useEffect(()=>{ 
    const handleSubmissionUpdate = (data) => {
      const updatedSubmissionId = data._id;
      const status = data.status;
      updateSubmission(updatedSubmissionId, data);
    }
    on('submission-update', handleSubmissionUpdate);
    return () => {
      off('submission-update', handleSubmissionUpdate);
    };
  }, [on, off]);

  if (loading){
    return <div>Loading...</div>;
  }


  const handleGetSubmission = async (submission) => {
    submission.isNew = true;
    setCurrentSubmission(submission);
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className='text-2xl font-bold'>My Submission</div>
      {/* Overview Stats */}
      <div className="">
        <Card className=" bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="">
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

        <Card className="mt-2 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="">
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
          <CardTitle>Last submisson</CardTitle>
          <ComboBox
            options={languages}
            placeholder="Select language..."
            defaultValue="all"
            className={'text-2xl ml-auto'}
            // onChange={changLanguage}
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm cursor-pointer">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Attempt</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Language</th>
                  <th className="text-left p-2">Runtime (ms)</th>
                  <th className="text-left p-2">Memory</th>
                  <th className="text-left p-2">Test Cases</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => {
                  const prevSubmission = submissions[index + 1];
                  const improvement = prevSubmission ? 
                    submission.passed || 0 - prevSubmission.passed || 0 : 0;
                  
                  return (
                    <tr key={submission._id} className="border-b hover:bg-gray-50"
                      onClick={() => handleGetSubmission(submission)}
                    >
                      <td className="p-2 font-mono text-gray-600">#{submission.shortId}</td>
                      <td className="p-2">{getStatusBadge(submission.status)}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {submission.language}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono">{submission.status === 'Time Limit Exceeded' ? currentProblem.time * 1000 : submission.time}</td>
                      <td className="p-2 font-mono">{submission.memory}</td>
                      <td className="p-2">
                        <span className={`font-semibold ${
                          submission.passed === submission.total 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {submission.status === 'Pending' ? '...' : `${submission.passed || 0} / ${submission.total || 10}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="mt-4 flex justify-center">
              <Pagination className={"cursor-pointer"}>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => pageActive > 1 ? setPageActive(pageActive - 1) : {}}/>
                  </PaginationItem>
                  {
                    Array.from({ length: problemSubmissionPagination.totalPages }, (_, index) => {
                      const page = index + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            onClick={() => setPageActive(page) }
                            isActive={page === problemSubmissionPagination.page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })
                  }
                  <PaginationItem>
                    <PaginationNext onClick={() => pageActive < problemSubmissionPagination.totalPages ? setPageActive(pageActive + 1) : {}} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending':
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
      );
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

export const getStatusBadge = (status) => {
  const variants = {
    'Pending': 'bg-blue-100 text-blue-800 border-blue-200',
    'Accepted': 'bg-green-100 text-green-800 border-green-200',
    'Wrong Answer': 'bg-red-100 text-red-800 border-red-200',
    'Time Limit Exceeded': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Runtime Error': 'bg-orange-100 text-orange-800 border-orange-200',
    'Compilation Error': 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <Badge className={`${variants[status] || 'bg-gray-100 text-gray-800 border-gray-200'} flex items-center gap-1 px-2 py-1`}>
      {getStatusIcon(status)}
      <span className="text-xs">{status}</span>
    </Badge>
  );
};

export default ProblemSubmissions;