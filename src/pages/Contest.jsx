import { getContestByCode } from '@/services/contestService';
import { contestStore } from '@/zustand/contestStore';
import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import WorkSpace from './WorkSpace';
import { useSocket } from '@/context/SocketContext';
import NotFound from './NotFound';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function Contest() {
  const { code, id, classCode } = useParams();
  const location = useLocation();
  const contestProblems = contestStore((state) => state.contestProblems);
  const setContestProblems = contestStore((state) => state.setContestProblems);
  const setContest = contestStore((state) => state.setContest);
  const contest = contestStore((state) => state.contest);
  const { isConnected, on, emit, off } = useSocket();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const classroomId = location.state?.classroomId;
  const isClassroomContest = !!classCode;
  useEffect(() => {
    const fetchContestData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await getContestByCode(code);
        const contestData = {
          ...response.data,
          isClassroomContest,
          classroomId: classroomId || response.data.classRoom?._id,
          classCode: classCode
        };
        const problems = response.data.problems;
        setContestProblems(problems || []);
        setContest(contestData);
        
      }
      catch (error){
        console.error('Error fetching contest data:', error);
        setIsError(true);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchContestData();
  }, [code,classCode, classroomId]);
  if (isLoading){
    return <LoadingSpinner/>;
  }
  if (isError){
    return <NotFound/>;
  }

  if (isConnected){
    const contestId = contest._id;
    emit('join-contest', {contestId: contestId});
  }

  return (
    <WorkSpace
      isContest={true}
      contestProblems={contestProblems}
    />
  )
}

export default Contest