// WorkSpace.jsx
import ProblemDetail from '@/components/problems/ProblemDetail';
import React, { useEffect, useMemo, useState } from 'react';
import Split from 'react-split';
import PlayGround from '../components/playground/PlayGround';
import { ProblemProvider, useProblem } from '@/context/ProblemContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MySubmission from '@/components/submission/ProblemSubmission'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Description from '@/assets/description';
import History from '@/assets/history';
import { submissionsStore } from '@/zustand/store';
import { Card } from '@/components/ui/card';
import ProblemContestList from '@/components/contests/ContestProblemList';
import { contestStore } from '@/zustand/contestStore';
import { Trophy, List, Lightbulb } from 'lucide-react';
import RankingContest from '@/components/contests/ContestRanking';
import { useContestRanking } from '@/hooks/useContestRanking';
import { isContestRunning } from '@/utils/contestHepler';
import ProblemSolutions from '@/components/solution/ProblemSolutions';
const WorkSpaceContent = ({ isContest, code, contestProblems }) => {
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const [activeTab, setActiveTab] = useState("statement");
  const { id ,solutionId, classCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const contest = contestStore((state) => state.contest);
  let contestParticipantId = null;
  let contestId = null;
  const classroomId = location.state?.classroomId;
  const fromClassroom = location.state?.fromClassroom;

  console.log('🏫 WorkSpace - classroomId:', classroomId);
  console.log('🏫 WorkSpace - fromClassroom:', fromClassroom);
  console.log('🏫 WorkSpace - location.state:', location.state);
  if (isContest) {
    contestId = contest?._id || null;
    contestParticipantId = contest?.userParticipation?.id || null;
  }
  // Update tab when submission state changes
  useEffect(() => {
    const pathname = location.pathname;
    
    if (pathname.includes('/submission')) {
      setActiveTab("submission");
    } else if (pathname.includes('/solutions')) {
      setActiveTab("solutions");
    } else {
      setActiveTab("statement");
    }

    // Handle new submission
    if (currentSubmission && currentSubmission.isNew === true) {
      setActiveTab("submission");
      currentSubmission.isNew = false;
    }
  }, [location.pathname, currentSubmission]);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Build base URL
    let baseUrl;
    if (isContest && code) {
      // Contest problem - use /contest/:code/problem/:id format
      baseUrl = `/contest/${code}/problem/${id}`;
    } else if (classCode) {
      // Classroom problem
      baseUrl = `/classrooms/${classCode}/problems/${id}`;
    } else {
      // Regular problemset
      baseUrl = `/problemset/problem/${id}`;
    }
    
    // Update URL based on tab
    switch (value) {
      case 'submission':
        navigate(`${baseUrl}/submission`, { 
          replace: true,
          state: location.state // Preserve state
        });
        break;
      case 'solutions':
        // Don't navigate to solutions in contest
        if (!isContest) {
          navigate(`${baseUrl}/solutions`, { 
            replace: true,
            state: location.state
          });
        }
        break;
      case 'statement':
      default:
        navigate(baseUrl, { 
          replace: true,
          state: location.state
        });
        break;
    }
  };

  // Add handler to switch to statement tab when problem is clicked
  const handleProblemClick = () => {
    setActiveTab("statement");
  };
  return (
    <div className='h-[calc(100vh-88px)] min-h-0 overflow-hidden fixed left-0 right-0'>
      <Split className="split h-full min-h-0" minSize={200}>
        <div className="h-full min-h-0 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="bg-gray-50">
            <TabsList>
              {isContest && (
                <TabsTrigger value="contest-problems">
                  <List className='text-[#a43eda] stroke-[#a43eda]' />
                  Problems
                </TabsTrigger>
              )}
              <TabsTrigger value="statement">
                <Description />
                Statement
              </TabsTrigger>
              
              
              <TabsTrigger value="submission">
                <History />
                Submission
              </TabsTrigger>

              {!isContest && (
                <TabsTrigger value="solutions">
                  <Lightbulb className='w-4 h-4 text-yellow-500' />
                  Solutions
                </TabsTrigger>
              )}
              {isContest && (
                <TabsTrigger value="rankings">
                  <Trophy className='text-[#a43eda] stroke-[#a43eda]' />
                    Rankings
                </TabsTrigger>
              )}
            </TabsList>
            {isContest && (
              <TabsContent value="contest-problems">
                <ProblemContestList
                  isStarted={true}
                  problems={contestProblems}
                  onProblemClick={handleProblemClick}
                  currentProblemId={id}
                  announcements={[
                    {
                      time: "2025-11-22T10:30:00",
                      message: "The contest has been extended by 30 minutes due to technical issues."
                    },
                    {
                      time: "2025-11-22T09:00:00",
                      message: "Welcome to the contest! Good luck to all participants."
                    }
                  ]} />
              </TabsContent>)}
            <TabsContent value="statement">
              <ProblemDetail />
            </TabsContent>
            <TabsContent value="submission">
              <MySubmission
                contestParticipant={contestParticipantId} 
                classroomId={classroomId}
                />
            </TabsContent>
            {!isContest && (
              <TabsContent value="solutions">
                <ProblemSolutions problemShortId={id} />
              </TabsContent>
            )}
            
            {isContest && (
              <TabsContent value="rankings">
                <RankingContest 
                onProblemClick={handleProblemClick}
                problems={contestProblems}
                contestId={contestId}
                isDisplayProblemDetail={true}
                isRunning={isContestRunning(contest)}
                contestCode={code} />
              </TabsContent>
            )}
          </Tabs>
        </div>
        <div className="h-full min-h-0 overflow-y-auto bg-gray-50">
          <Card className={'m-2 py-4'}>
            <PlayGround
              contestId={isContest ? contestId : null} 
               classroomId={classroomId}
               onSubmitSuccess={() => handleTabChange('submission')} 
              />
          </Card>
        </div>
      </Split>
    </div>
  );
};

const WorkSpace = ({ isContest = false, contestProblems = null }) => {
  const { id, code } = useParams();
  const location = useLocation();

  return (
    <ProblemProvider problemId={id}>
      <WorkSpaceContent
        isContest={isContest}
        code={code}
        contestProblems={contestProblems}
      />
    </ProblemProvider>
  );
};

export default WorkSpace;