// WorkSpace.jsx
import ProblemDetail from '@/components/problems/ProblemDetail';
import React, { useEffect, useMemo, useState } from 'react';
import Split from 'react-split';
import PlayGround from '../components/playground/PlayGround';
import { ProblemProvider } from '@/context/ProblemContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MySubmission from '@/components/submission/ProblemSubmission'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Description from '@/assets/description';
import History from '@/assets/history';
import { submissionsStore } from '@/zustand/store';
import { Card } from '@/components/ui/card';
import ProblemContestList from '@/components/contests/ContestProblemList';
import { contestStore } from '@/zustand/contestStore';
import { Trophy, List, Lightbulb, Sparkles } from 'lucide-react';
import RankingContest from '@/components/contests/ContestRanking';
import { isContestRunning } from '@/utils/contestHepler';
import ProblemSolutions from '@/components/solution/ProblemSolutions';
import { useSocket } from '@/context/SocketContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
const WorkSpaceContent = ({ isContest, code, contestProblems }) => {
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const [activeTab, setActiveTab] = useState("statement");
  const [selectedHintSubmissionId, setSelectedHintSubmissionId] = useState(null);
  const { id, solutionId, classCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const contest = contestStore((state) => state.contest);
  const { hintHistory, isHintDialogOpen, setHintDialogOpen } = useSocket();
  let contestParticipantId = null;
  let contestId = null;
  const classroomId = location.state?.classroomId;
  const fromClassroom = location.state?.fromClassroom;
  const isClassroomContest = !!classCode && isContest;

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
    } else if (isContest && pathname.includes('/rankings')) {
      setActiveTab("rankings");
    } else if (isContest && pathname.includes('contest-problems')) {
      setActiveTab("contest-problems");
    }
    else {
      setActiveTab("statement");
    }

    // Handle new submission
    if (currentSubmission && currentSubmission.isNew === true) {
      setActiveTab("submission");
      currentSubmission.isNew = false;
    }
  }, [location.pathname, currentSubmission]);

  const problemHintHistory = useMemo(() => {
    return hintHistory.filter((hintItem) => {
      const hintProblemId = String(hintItem?.problemId || '');
      return hintProblemId === String(id);
    });
  }, [hintHistory, id]);

  const selectedHint = useMemo(() => {
    if (problemHintHistory.length === 0) {
      return null;
    }

    return (
      problemHintHistory.find(
        (hintItem) => hintItem.submissionId === selectedHintSubmissionId
      ) || problemHintHistory[0]
    );
  }, [problemHintHistory, selectedHintSubmissionId]);

  useEffect(() => {
    if (problemHintHistory.length === 0) {
      setSelectedHintSubmissionId(null);
      return;
    }

    if (
      !selectedHintSubmissionId ||
      !problemHintHistory.some(
        (hintItem) => hintItem.submissionId === selectedHintSubmissionId
      )
    ) {
      setSelectedHintSubmissionId(problemHintHistory[0].submissionId);
    }
  }, [problemHintHistory, selectedHintSubmissionId]);

  const openHintDialog = () => {
    if (problemHintHistory.length > 0) {
      setHintDialogOpen(true);
    }
  };

  const formatHintTime = (time) => {
    if (!time) return '--';
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleString('vi-VN');
  };

  const handleTabChange = (value) => {
    setActiveTab(value);

    // Build base URL
    let baseUrl;
    if (isClassroomContest && classCode && code) {
      baseUrl = `/classrooms/${classCode}/contests/${code}/problem/${id}`;
    }
    else if (isContest && code) {
      baseUrl = `/contest/${code}/problem/${id}`;
    }
    else if (classCode) {
      baseUrl = `/classrooms/${classCode}/problems/${id}`;
    }
    else {
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
      case 'rankings':
        if (isContest) {
          navigate(`${baseUrl}/rankings`, {
            replace: true,
            state: location.state
          });
        }
        break;
      case 'contest-problems':
        if (isContest) {
          navigate(`${baseUrl}/contest-problems`, {
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
            <div className="flex items-center justify-between gap-3 px-2 pt-2">
              <TabsList>
                {isContest && (
                  <TabsTrigger value="contest-problems">
                    <List className='text-blue-700 stroke-blue-700' />
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
                    <Trophy className='text-blue-600 stroke-blue-600' />
                    Rankings
                  </TabsTrigger>
                )}
              </TabsList>
              <button
                type="button"
                onClick={openHintDialog}
                disabled={problemHintHistory.length === 0}
                className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                AI Hint
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-200 px-1 text-xs font-semibold text-amber-800">
                  {problemHintHistory.length}
                </span>
              </button>
            </div>
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

      <Dialog open={isHintDialogOpen} onOpenChange={setHintDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-hidden p-0 sm:max-w-4xl">
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <Sparkles className="h-5 w-5" />
              AI Recommendation Hint
            </DialogTitle>
            <DialogDescription>
              Goi y chi dinh huong cach giai, khong cung cap loi giai hoan chinh.
            </DialogDescription>
          </DialogHeader>

          <div className="grid min-h-[460px] md:grid-cols-[260px_1fr]">
            <div className="border-b border-r bg-gray-50 p-3 md:border-b-0">
              <div className="mb-2 text-sm font-semibold text-gray-700">Lich su hint</div>
              <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {problemHintHistory.length === 0 ? (
                  <div className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
                    Chua co hint cho bai nay.
                  </div>
                ) : (
                  problemHintHistory.map((hintItem, index) => {
                    const isActive =
                      selectedHint?.submissionId === hintItem.submissionId;

                    return (
                      <button
                        key={`${hintItem.submissionId}-${index}`}
                        type="button"
                        onClick={() => setSelectedHintSubmissionId(hintItem.submissionId)}
                        className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                          isActive
                            ? 'border-amber-300 bg-amber-50'
                            : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50'
                        }`}
                      >
                        <div className="text-xs font-semibold text-gray-700">
                          Submission #{String(hintItem.submissionId || '').slice(-6)}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {formatHintTime(hintItem.receivedAt)}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              {selectedHint?.hint ? (
                <div className="prose max-w-none text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
                  >
                    {selectedHint.hint.replace(/\\n/g, '\n')}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                  Chon mot hint trong danh sach de xem noi dung.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
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