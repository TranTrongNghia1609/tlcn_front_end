'use client'
import ContestHeader from '@/components/contests/ContestHeader'
import ContestActions from '../components/contests/ContestActions';
import ContestContent from '../components/contests/ContestContent'
import ContestSidebar from '../components/contests/ContestSideBar'
import { contestStore } from '@/zustand/contestStore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getContestByCode } from '@/services/contestService'
import NotFound from './NotFound';

const getContestStatus = (startTime, endTime) => {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (now < start) return 'upcoming'
  if (now > end) return 'ended'
  return 'ongoing'
}

export default function ContestDetail() {
  const contest = contestStore((state) => state.contest);
  const setContest = contestStore((state) => state.setContest);
  const setContestProblems = contestStore((state) => state.setContestProblems);
  const contestProblems = contestStore((state) => state.contestProblems);
  const [isError, setIsError] = useState(false);
  const {code} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchContestData = async () => {
      try{
        // Simulate fetching contest data based on the code from params
        const response = await getContestByCode(code);
        setContest(response.data);
        const problems = response.data.problems;
        setContestProblems(problems || []);
        setIsLoading(false);
        setIsError(false);
      }
      catch (error){
        setIsError(true);
        console.log('Set rorr');
      }
      finally {
        setIsLoading(false);
      }
    }
    console.log('Call');
    fetchContestData();
  }, [])
  if (isLoading){
    return (
      <div className='h-full flex items-center justify-center'>
        <span className='text-gray-500'>Loading contest details...</span>
      </div>
    )
  }

  if (isError || !contest){
    return <NotFound />;
  }
  return (
    <div className='h-full bg-[linear-gradient(180deg,#fafeff_0%,#feffff_100%)]'>
      <div className="space-y-6 p-8 mx-auto">
        {/* Header Section */}
        <ContestHeader/>

        {/* Action Buttons */}
        <ContestActions />

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContestContent />
          </div>
          <div className="lg:col-span-1">
            <ContestSidebar 
              contestId={contest._id}
             />
          </div>
        </div>
      </div>
    </div>
  )
}
