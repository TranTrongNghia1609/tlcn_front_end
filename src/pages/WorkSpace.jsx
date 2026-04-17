// WorkSpace.jsx
import ProblemDetail from '@/components/problems/ProblemDetail';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Trophy, List, Lightbulb, Sparkles } from 'lucide-react';
import RankingContest from '@/components/contests/ContestRanking';
import { isContestRunning } from '@/utils/contestHepler';
import ProblemSolutions from '@/components/solution/ProblemSolutions';
import { useSocket } from '@/context/SocketContext';
import { aiConversationService } from '@/services/aiConversationService';
import AiHintDialog from '@/components/features/ai/AiHintDialog';
import { toast } from 'sonner';
const WorkSpaceContent = ({ isContest, code, contestProblems }) => {
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const clearSubmissionPreviewId = submissionsStore((state) => state.clearSubmissionPreviewId);
  const { currentProblem } = useProblem();
  const [activeTab, setActiveTab] = useState("statement");
  const [selectedHintKey, setSelectedHintKey] = useState(null);
  const [persistedHintHistory, setPersistedHintHistory] = useState([]);
  const [isRequestingMoreHint, setIsRequestingMoreHint] = useState(false);
  const [hasEditorCode, setHasEditorCode] = useState(false);
  const editorSnapshotRef = useRef({ code: '', language: 'cpp' });
  const { id, solutionId, classCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const contest = contestStore((state) => state.contest);
  const { hintHistory, isHintDialogOpen, setHintDialogOpen } = useSocket();
  const hasToken = Boolean(localStorage.getItem('access_token'));
  let contestParticipantId = null;
  let contestId = null;
  const classroomId = location.state?.classroomId;
  const fromClassroom = location.state?.fromClassroom;
  const isClassroomContest = !!classCode && isContest;

  const storageScope = isClassroomContest
    ? 'classroom-contest'
    : isContest
      ? 'contest'
      : classCode
        ? 'classroom'
        : 'problemset';

  const storageScopeId = isClassroomContest
    ? `${String(classCode || '')}:${String(code || '')}`
    : isContest
      ? String(code || contest?._id || '')
      : classCode
        ? String(classCode)
        : 'public';

  if (isContest) {
    contestId = contest?._id || null;
    contestParticipantId = contest?.userParticipation?.id || null;
  }

  useEffect(() => {
    clearSubmissionPreviewId();
  }, [id, classCode, code, isContest, clearSubmissionPreviewId]);

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

  useEffect(() => {
    let isMounted = true;

    const hydrateHintHistory = async () => {
      try {
        const response = await aiConversationService.getConversationByProblem(id);
        const conversation = response?.data;
        const messages = conversation?.messages || [];
        const conversationProblemId = conversation?.problem?._id || currentProblem?._id || null;
        const conversationProblemShortId = conversation?.problem?.shortId || currentProblem?.shortId || id;

        const historyFromDb = messages
          .filter((msg) => msg.role === 'assistant' && msg.content)
          .map((msg, index) => ({
            submissionId: msg.submission || null,
            problemId: conversationProblemId,
            problemShortId: conversationProblemShortId,
            hint: msg.content,
            source: msg.source || null,
            model: msg.model || null,
            errorType: msg.errorType || null,
            generatedAt: msg.createdAt || null,
            receivedAt: msg.createdAt || null,
            hintKey: `${String(msg.submission || '')}-${String(msg.createdAt || '')}-${String(msg.content || '').slice(0, 48)}-${index}`,
          }))
          .reverse();

        if (isMounted) {
          setPersistedHintHistory(historyFromDb);
        }
      } catch (error) {
        console.error('Failed to load AI conversation history:', error);
        if (isMounted) {
          setPersistedHintHistory([]);
        }
      }
    };

    if (id && hasToken) {
      hydrateHintHistory();
    }

    return () => {
      isMounted = false;
    };
  }, [id, hasToken, currentProblem?._id, currentProblem?.shortId]);

  const mergedHintHistory = useMemo(() => {
    const uniqueMap = new Map();
    const allHints = [...hintHistory, ...persistedHintHistory];

    allHints.forEach((hintItem) => {
      const submissionId = String(hintItem?.submissionId || '');
      const createdAt = String(hintItem?.generatedAt || hintItem?.receivedAt || '');
      const content = String(hintItem?.hint || '');
      const dedupeKey = `${submissionId}-${createdAt}-${content.slice(0, 48)}`;

      if (!uniqueMap.has(dedupeKey)) {
        uniqueMap.set(dedupeKey, {
          ...hintItem,
          hintKey: hintItem?.hintKey || dedupeKey,
        });
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => {
      const timeA = new Date(a?.receivedAt || a?.generatedAt || 0).getTime();
      const timeB = new Date(b?.receivedAt || b?.generatedAt || 0).getTime();
      return timeB - timeA;
    });
  }, [hintHistory, persistedHintHistory]);

  const problemHintHistory = useMemo(() => {
    const currentProblemId = String(currentProblem?._id || '');
    const currentProblemShortId = String(currentProblem?.shortId || id || '');

    return mergedHintHistory.filter((hintItem) => {
      const hintProblemId = String(hintItem?.problemId || '');
      const hintProblemShortId = String(hintItem?.problemShortId || '');

      const matchedByObjectId = currentProblemId && hintProblemId === currentProblemId;
      const matchedByShortId = currentProblemShortId && hintProblemShortId === currentProblemShortId;
      const legacyMatchedByRouteId = hintProblemId === String(id);

      return matchedByObjectId || matchedByShortId || legacyMatchedByRouteId;
    });
  }, [mergedHintHistory, currentProblem?._id, currentProblem?.shortId, id]);

  const selectedHint = useMemo(() => {
    if (problemHintHistory.length === 0) {
      return null;
    }

    return (
      problemHintHistory.find(
        (hintItem) => hintItem.hintKey === selectedHintKey
      ) || problemHintHistory[0]
    );
  }, [problemHintHistory, selectedHintKey]);

  useEffect(() => {
    if (problemHintHistory.length === 0) {
      setSelectedHintKey(null);
      return;
    }

    if (
      !selectedHintKey ||
      !problemHintHistory.some(
        (hintItem) => hintItem.hintKey === selectedHintKey
      )
    ) {
      setSelectedHintKey(problemHintHistory[0].hintKey);
    }
  }, [problemHintHistory, selectedHintKey]);

  const handleEditorSnapshotChange = useCallback((snapshot) => {
    const normalizedCode = String(snapshot?.code || '');
    const normalizedLanguage = String(snapshot?.language || 'cpp');
    editorSnapshotRef.current = {
      code: normalizedCode,
      language: normalizedLanguage,
    };
    setHasEditorCode(Boolean(normalizedCode.trim()));
  }, []);

  const handleRequestMoreHint = async () => {
    if (!hasToken) {
      toast.error('Ban can dang nhap de su dung AI Hint.');
      return;
    }

    const sourceCode = String(editorSnapshotRef.current?.code || '').trim();
    const language = String(editorSnapshotRef.current?.language || 'cpp');

    if (!sourceCode) {
      toast.error('Hay viet hoac cap nhat code truoc khi xin them goi y.');
      return;
    }

    try {
      setIsRequestingMoreHint(true);
      await aiConversationService.requestHint(currentProblem?._id || id, {
        sourceCode,
        language,
        submissionId: currentSubmission?._id || null,
      });
      toast.success('Da gui yeu cau AI. He thong se tra goi y moi som.');
    } catch (error) {
      console.error('Failed to request follow-up AI hint:', error);
      toast.error('Khong the gui yeu cau goi y luc nay. Vui long thu lai.');
    } finally {
      setIsRequestingMoreHint(false);
    }
  };

  const openHintDialog = () => {
    if (problemHintHistory.length > 0) {
      setHintDialogOpen(true);
      if (hasToken) {
        aiConversationService.markViewed(currentProblem?._id || id).catch((error) => {
          console.error('Failed to mark AI conversation viewed:', error);
        });
      }
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
              storageScope={storageScope}
              storageScopeId={storageScopeId}
              onEditorSnapshotChange={handleEditorSnapshotChange}
              onSubmitSuccess={() => handleTabChange('submission')}
            />
          </Card>
        </div>
      </Split>

      <AiHintDialog
        isOpen={isHintDialogOpen}
        onOpenChange={setHintDialogOpen}
        problemHintHistory={problemHintHistory}
        selectedHint={selectedHint}
        setSelectedHintKey={setSelectedHintKey}
        formatHintTime={formatHintTime}
        onRequestMoreHint={handleRequestMoreHint}
        isRequestingMoreHint={isRequestingMoreHint}
        canRequestMoreHint={hasEditorCode && !isRequestingMoreHint}
      />
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