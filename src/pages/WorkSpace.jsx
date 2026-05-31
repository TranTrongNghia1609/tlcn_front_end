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
import { useAuth } from '@/context/AuthContext';
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
  const [isEligibilityUnlocked, setIsEligibilityUnlocked] = useState(false);
  const [isProblemSolved, setIsProblemSolved] = useState(false);
  const [isRequestingMoreHint, setIsRequestingMoreHint] = useState(false);
  const [isHintPending, setIsHintPending] = useState(false);
  const [hintPendingSince, setHintPendingSince] = useState(null);
  const [hasEditorCode, setHasEditorCode] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatCooldownRemaining, setChatCooldownRemaining] = useState(0);
  // All raw conversation messages for full overview
  const [conversationMessages, setConversationMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const chatCooldownRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const editorSnapshotRef = useRef({ code: '', language: 'cpp' });
  const { id, solutionId, classCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const contest = contestStore((state) => state.contest);
  const {
    hintHistory,
    latestHint,
    aiHintAvailableMap,
    isHintDialogOpen,
    setHintDialogOpen,
  } = useSocket();
  const hasToken = Boolean(localStorage.getItem('access_token'));
  const isAiHintEnabled = user?.aiHintEnabled !== false;
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

  const currentProblemKeys = useMemo(() => {
    const keys = [
      String(currentProblem?._id || '').trim(),
      String(currentProblem?.shortId || '').trim(),
      String(id || '').trim(),
    ].filter(Boolean);

    return Array.from(new Set(keys));
  }, [currentProblem?._id, currentProblem?.shortId, id]);

  if (isContest) {
    contestId = contest?._id || null;
    contestParticipantId = contest?.userParticipation?.id || null;
  }

  useEffect(() => {
    clearSubmissionPreviewId();
  }, [id, classCode, code, isContest, clearSubmissionPreviewId]);

  useEffect(() => {
    setIsHintPending(false);
    setHintPendingSince(null);
    setCooldownRemaining(0);
    setChatCooldownRemaining(0);
    setChatMessages([]);
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
    if (chatCooldownRef.current) {
      clearInterval(chatCooldownRef.current);
      chatCooldownRef.current = null;
    }
  }, [id, classCode, code, isContest]);

  useEffect(() => {
    if (!isAiHintEnabled) {
      setIsHintPending(false);
      setHintPendingSince(null);
      setIsEligibilityUnlocked(false);
    }
  }, [isAiHintEnabled]);

  useEffect(() => {
    let isMounted = true;

    const hydrateEligibility = async () => {
      if (!id || !hasToken || !isAiHintEnabled) {
        if (isMounted) {
          setIsEligibilityUnlocked(false);
        }
        return;
      }

      try {
        const response = await aiConversationService.getEligibility(id);
        if (isMounted) {
          const eligibility = response?.data;
          setIsEligibilityUnlocked(Boolean(eligibility?.isEligible));
          setIsProblemSolved(Boolean(eligibility?.hasSolved));
        }
      } catch (error) {
        console.error('Failed to load AI hint eligibility:', error);
        if (isMounted) {
          setIsEligibilityUnlocked(false);
        }
      }
    };

    hydrateEligibility();

    return () => {
      isMounted = false;
    };
  }, [id, hasToken, isAiHintEnabled]);

  // Re-check eligibility when a new submission arrives (could become Accepted)
  useEffect(() => {
    if (!currentSubmission || !id || !hasToken || !isAiHintEnabled) return;

    const recheck = async () => {
      try {
        const resp = await aiConversationService.getEligibility(id);
        const eligibility = resp?.data;
        setIsEligibilityUnlocked(Boolean(eligibility?.isEligible));
        setIsProblemSolved(Boolean(eligibility?.hasSolved));
      } catch { /* silent */ }
    };
    recheck();
  }, [currentSubmission, id, hasToken, isAiHintEnabled]);

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

  // Hydrate ALL conversation messages (hint history + chat) from DB in one call
  useEffect(() => {
    let isMounted = true;

    const hydrateConversation = async () => {
      try {
        const response = await aiConversationService.getConversationByProblem(id);
        const conversation = response?.data;
        const messages = conversation?.messages || [];
        const conversationProblemId = conversation?.problem?._id || currentProblem?._id || null;
        const conversationProblemShortId = conversation?.problem?.shortId || currentProblem?.shortId || id;

        if (!isMounted) return;

        // Conversation ID for display
        setConversationId(conversation?._id || null);

        // Full messages for the new unified dialog view
        setConversationMessages(messages);

        // Chat messages (for legacy canChat check)
        const chatMsgs = messages.filter(
          (msg) =>
            (msg.role === 'user' && msg.source === 'chat_message') ||
            (msg.role === 'assistant' && (msg.source === 'chat_message' || msg.type === 'chat'))
        );
        setChatMessages(chatMsgs);

        // Hint history (for legacy problemHintHistory / canOpenHintDialog check)
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
        setPersistedHintHistory(historyFromDb);
      } catch (error) {
        console.error('Failed to load AI conversation:', error);
        if (isMounted) {
          setConversationMessages([]);
          setChatMessages([]);
          setPersistedHintHistory([]);
        }
      }
    };

    if (id && hasToken && isAiHintEnabled) {
      hydrateConversation();
    } else {
      setConversationMessages([]);
      setChatMessages([]);
      if (!isAiHintEnabled) setPersistedHintHistory([]);
    }

    return () => { isMounted = false; };
  }, [id, hasToken, currentProblem?._id, currentProblem?.shortId, isAiHintEnabled]);

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

  const isUnlockedBySocket = useMemo(
    () => currentProblemKeys.some((key) => Boolean(aiHintAvailableMap?.[key])),
    [currentProblemKeys, aiHintAvailableMap]
  );

  const isAiHintUnlocked = isAiHintEnabled && !isProblemSolved && (problemHintHistory.length > 0 || isUnlockedBySocket || isEligibilityUnlocked);

  // Cho phép mở dialog khi: đã unlock HOẶC đã solved nhưng có hint history để xem lại
  const canOpenHintDialog = isAiHintUnlocked || (isProblemSolved && problemHintHistory.length > 0);

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

  useEffect(() => {
    if (!latestHint || !isHintPending) {
      return;
    }

    const hintProblemId = String(latestHint?.problemId || '').trim();
    const hintProblemShortId = String(latestHint?.problemShortId || '').trim();
    const isCurrentProblemHint = currentProblemKeys.some(
      (key) => key === hintProblemId || key === hintProblemShortId
    );

    if (!isCurrentProblemHint) {
      return;
    }

    const latestHintTime = new Date(latestHint?.receivedAt || latestHint?.generatedAt || 0).getTime();
    const pendingSinceTime = hintPendingSince ? new Date(hintPendingSince).getTime() : 0;
    const isNewHintAfterRequest = Number.isFinite(latestHintTime) && latestHintTime >= pendingSinceTime;

    if (isNewHintAfterRequest || !hintPendingSince) {
      setIsHintPending(false);
      setHintPendingSince(null);
    }

    // Re-fetch persisted hints từ DB để đồng bộ với hint mới từ socket
    // Đảm bảo lịch sử hiển thị đầy đủ thay vì bị ghi đè
    if (id && hasToken && isAiHintEnabled) {
      const refreshPersistedHints = async () => {
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

          setPersistedHintHistory(historyFromDb);
        } catch (error) {
          console.error('Failed to refresh hint history after new hint:', error);
        }
      };

      // Delay một chút để đảm bảo server đã lưu hint vào DB
      const timer = setTimeout(refreshPersistedHints, 1500);
      return () => clearTimeout(timer);
    }
  }, [latestHint, isHintPending, currentProblemKeys, hintPendingSince]);

  // When a new socket hint arrives that corresponds to a chat_message, append it to chatMessages
  useEffect(() => {
    if (!latestHint) return;
    const hintProblemId = String(latestHint?.problemId || '').trim();
    const hintProblemShortId = String(latestHint?.problemShortId || '').trim();
    const isCurrentProblem = currentProblemKeys.some(
      (key) => key === hintProblemId || key === hintProblemShortId
    );
    if (!isCurrentProblem) return;

    // Refresh chat messages from DB after a short delay
    if (id && hasToken && isAiHintEnabled) {
      const timer = setTimeout(async () => {
        try {
          const response = await aiConversationService.getConversationByProblem(id);
          const conversation = response?.data;
          const messages = conversation?.messages || [];
          const conversationProblemId = conversation?.problem?._id || currentProblem?._id || null;
          const conversationProblemShortId = conversation?.problem?.shortId || currentProblem?.shortId || id;

          setConversationMessages(messages);

          const chatMsgs = messages.filter(
            (msg) =>
              (msg.role === 'user' && msg.source === 'chat_message') ||
              (msg.role === 'assistant' && (msg.source === 'chat_message' || msg.type === 'chat'))
          );
          setChatMessages(chatMsgs);
          setIsSendingChat(false);

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
          setPersistedHintHistory(historyFromDb);
        } catch { /* silent */ }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [latestHint]);

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

    if (!isAiHintEnabled) {
      toast.warning('AI Hint dang duoc tat trong cai dat Privacy cua ban.');
      return;
    }

    if (isProblemSolved) {
      toast.info('Ban da hoan thanh bai nay. Khong can goi y them.');
      return;
    }

    if (!isAiHintUnlocked) {
      toast.warning('AI Hint chua mo khoa cho bai nay.');
      return;
    }

    if (cooldownRemaining > 0) {
      toast.warning(`Vui long doi ${cooldownRemaining} giay truoc khi yeu cau tiep.`);
      return;
    }

    if (isHintPending) {
      toast.warning('AI dang xu ly yeu cau truoc. Vui long doi goi y moi.');
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
      setHintPendingSince(new Date().toISOString());
      setIsHintPending(true);
      toast.success('Da gui yeu cau AI. He thong se tra goi y moi som.');

      // Start 30s cooldown
      setCooldownRemaining(30);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current);
            cooldownTimerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to request follow-up AI hint:', error);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message || '';
      if (status === 429) {
        toast.warning(serverMessage || 'Yeu cau qua nhanh. Vui long doi mot chut.');
      } else if (status === 403) {
        toast.info(serverMessage || 'AI Hint khong kha dung cho bai nay.');
        // Re-check eligibility in case problem was just solved
        try {
          const resp = await aiConversationService.getEligibility(id);
          setIsProblemSolved(Boolean(resp?.data?.hasSolved));
          setIsEligibilityUnlocked(Boolean(resp?.data?.isEligible));
        } catch { /* silent */ }
      } else {
        toast.error('Khong the gui yeu cau goi y luc nay. Vui long thu lai.');
      }
    } finally {
      setIsRequestingMoreHint(false);
    }
  };

  const handleSendChatMessage = async (content) => {
    if (!content || isSendingChat || chatCooldownRemaining > 0) return;
    if (!hasToken) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng chat.');
      return;
    }

    const sourceCode = String(editorSnapshotRef.current?.code || '').trim();
    const language = String(editorSnapshotRef.current?.language || 'cpp');

    if (!sourceCode) {
      toast.error('Hãy viết code trong editor trước khi chat với AI.');
      return;
    }

    // Optimistically add user message to BOTH states so dialog shows it immediately
    const optimisticMsg = {
      role: 'user',
      type: 'chat',
      content,
      source: 'chat_message',
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, optimisticMsg]);
    setConversationMessages((prev) => [...prev, optimisticMsg]);
    setIsSendingChat(true);

    try {
      await aiConversationService.sendChatMessage(currentProblem?._id || id, {
        content,
        sourceCode,
        language,
        submissionId: currentSubmission?._id || null,
      });

      // Start 20s cooldown
      setChatCooldownRemaining(20);
      if (chatCooldownRef.current) clearInterval(chatCooldownRef.current);
      chatCooldownRef.current = setInterval(() => {
        setChatCooldownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(chatCooldownRef.current);
            chatCooldownRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      // Remove optimistic message on error from both states
      setChatMessages((prev) => prev.filter((m) => m !== optimisticMsg));
      setConversationMessages((prev) => prev.filter((m) => m !== optimisticMsg));
      setIsSendingChat(false);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message || '';
      if (status === 429) {
        toast.warning(serverMessage || 'Gửi quá nhanh. Vui lòng đợi một chút.');
      } else if (status === 403) {
        toast.info(serverMessage || 'Bạn cần nhận gợi ý AI trước khi có thể chat.');
      } else {
        toast.error('Không thể gửi tin nhắn lúc này. Vui lòng thử lại.');
      }
    }
  };

  const openHintDialog = () => {
    if (!isAiHintEnabled) {
      toast.warning('AI Hint dang duoc tat trong cai dat Privacy cua ban.');
      return;
    }

    if (!canOpenHintDialog) {
      toast.warning('AI Hint chua mo khoa cho bai nay.');
      return;
    }

    setHintDialogOpen(true);
    if (hasToken && problemHintHistory.length > 0) {
      aiConversationService.markViewed(currentProblem?._id || id).catch((error) => {
        console.error('Failed to mark AI conversation viewed:', error);
      });
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
              {isAiHintEnabled && !isContest && (
                <button
                  type="button"
                  onClick={openHintDialog}
                  disabled={!canOpenHintDialog}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    isProblemSolved
                      ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {isProblemSolved ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Đã hoàn thành
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-green-200 px-1 text-xs font-semibold text-green-800">
                        {problemHintHistory.length}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Xin gợi ý
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-200 px-1 text-xs font-semibold text-amber-800">
                        {problemHintHistory.length}
                      </span>
                    </>
                  )}
                </button>
              )}
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
        isHintPending={isHintPending}
        isAiHintEnabled={isAiHintEnabled}
        canRequestMoreHint={isAiHintEnabled && hasEditorCode && isAiHintUnlocked && !isProblemSolved && !isRequestingMoreHint && !isHintPending && cooldownRemaining === 0}
        cooldownRemaining={cooldownRemaining}
        isProblemSolved={isProblemSolved}
        conversationMessages={conversationMessages}
        conversationId={conversationId}
        onSendChatMessage={handleSendChatMessage}
        isSendingChat={isSendingChat}
        chatCooldownRemaining={chatCooldownRemaining}
        canChat={isAiHintEnabled && hasEditorCode && !isProblemSolved && conversationMessages.some((m) => m.role === 'assistant')}
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