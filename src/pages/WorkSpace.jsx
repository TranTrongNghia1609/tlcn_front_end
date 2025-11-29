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
import { Trophy, List } from 'lucide-react';
import RankingContest from '@/components/contests/ContestRanking';
import { useContestRanking } from '@/hooks/useContestRanking';
import { isContestRunning } from '@/utils/contestHepler';


const WorkSpaceContent = ({ isContest, code, contestProblems }) => {
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const [activeTab, setActiveTab] = useState("statement");
  const { id } = useParams();
  const location = useLocation();
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
    if (currentSubmission && currentSubmission.isNew === true){
      setActiveTab("submission");
      // Mark as not new anymore
      currentSubmission.isNew = false;
    }
    else {
      setActiveTab("statement");
    }
  }, [currentSubmission]);

  // Add handler to switch to statement tab when problem is clicked
  const handleProblemClick = () => {
    setActiveTab("statement");
  };

  const mockData = [
    {
      "id": "6921e631b8625a9081022887",
      "user": {
        "_id": "68ab4a62bfdd306a660ebca0",
        "userName": "nghiadz",
        "fullName": "Thanh Binh",
        "avatar": "https://res.cloudinary.com/da0zhlez4/image/upload/v1757432359/user_avatars/avatar_68ab4a62bfdd306a660ebca0_1757432356545.jpg"
      },
      "contestId": "6921df8c660f3c2f7d1833e8",
      "joinedAt": "2025-11-22 23:34:57",
      "mode": "official",
      "startTime": "2025-11-22 23:37:00",
      "endTime": "2025-11-28 19:05:00",
      "score": 30.76923076923077,
      "lastBestSubmissionScoreAt": "2025-11-23 00:42:53",
      "problemScores": [
        {
          "problemId": "68e3f7867676197a43699cc3",
          "bestScore": 30.76923076923077,
          "bestSubmissionId": "6921e7bfb8625a90810228bc",
          "attempts": 2,
          "lastSubmittedAt": "2025-11-22T16:41:37.389Z",
          "_id": "6921e7a1b8625a90810228b6"
        }
      ],
    },
    // Thêm user giả khác để test Top 2, Top 3
    {
      "id": "2",
      "user": { "userName": "coder_pro", "fullName": "Le Minh" },
      "mode": "practice",
      "score": 25.50,
      "lastBestSubmissionScoreAt": "2025-11-23 00:50:00"
    }
  ];
  const {
    data: rankingData,
    isLoading: isLoadingRank,
    isError,
    isAutoRefresh,
    setIsAutoRefresh,
    isRefetching // Biến này true khi đang chạy ngầm cập nhật
  } = useContestRanking(contestId);

  const leaderboard = useMemo(() => {
    if (isLoadingRank || isError || !rankingData) return [];
    return rankingData.data || [];
  }, [rankingData, isLoadingRank, isError]);
  return (
    <div className='h-[calc(100vh-88px)] min-h-0 overflow-hidden fixed left-0 right-0'>
      <Split className="split h-full min-h-0" minSize={200}>
        <div className="h-full min-h-0 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-gray-50">
            <TabsList>
              {isContest && (
                <>
                  <TabsTrigger value="contest-problems">
                    <List className='text-[#a43eda] stroke-[#a43eda]' />
                    Problems
                  </TabsTrigger>

                  <TabsTrigger value="rankings">
                    <Trophy className='text-[#a43eda] stroke-[#a43eda]' />
                    Rankings
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger value="statement">
                <Description />
                Statement
              </TabsTrigger>
              <TabsTrigger value="submission">
                <History />
                Submission
              </TabsTrigger>
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
            <TabsContent value="rankings">
              <RankingContest
                onProblemClick={handleProblemClick}
                leaderboard={leaderboard}
                problems={contestProblems}
                contestCode={code} />
            </TabsContent>
            <TabsContent value="statement">
              <ProblemDetail />
            </TabsContent>
            <TabsContent value="submission">
              <MySubmission
                contestParticipant={contestParticipantId} 
                classroomId={classroomId}
                />
            </TabsContent>
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