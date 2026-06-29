import React, { useEffect, useMemo, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import PreferenceNav from './preferences/PreferenceNav';
import PreTestPanel from './PreTestPanel';
import { mapLanguage } from '@/lib/utils.js';
import { useProblem } from '@/context/ProblemContext';
import { useAuth } from '@/context/AuthContext';
import useDebounce from '@/hooks/useDebounce';
import { submitCode } from '@/services/submissionService';
import { submissionsStore } from '@/zustand/store';
import { AlertCircle } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const PlayGround = ({
  contestId = null,
  classroomId = null,
  storageScope = 'problemset',
  storageScopeId = 'public',
  onSubmitSuccess,
  onEditorSnapshotChange = null,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: problemId, classCode } = useParams();
  const mapValue = useMemo(() => mapLanguage(), []);
  const { user } = useAuth();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(mapValue[language].code);
  const { currentProblem } = useProblem();
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const submissionPreviewId = submissionsStore((state) => state.submissionPreviewId);
  const clearSubmissionPreviewId = submissionsStore((state) => state.clearSubmissionPreviewId);
  const addSubmission = submissionsStore((state) => state.addSubmission);
  const debouncedCode = useDebounce(code, 600);
  const skipRestoreOnceRef = useRef(false);
  const [isPreTestOpen, setIsPreTestOpen] = useState(false);
  const [preTestTab, setPreTestTab] = useState('Testcase');
  const [isPreTesting, setIsPreTesting] = useState(false);

  const languageKeys = useMemo(() => Object.keys(mapValue || {}), [mapValue]);
  const resolvedProblemId = String(currentProblem?._id || problemId || 'unknown-problem');
  const resolvedUserId = String(user?._id || user?.id || 'guest');
  const resolvedScope = String(storageScope || 'problemset');
  const resolvedScopeId = String(storageScopeId || 'public');
  const draftKeyBase = useMemo(
    () => `workspace:draft:${resolvedUserId}:${resolvedScope}:${resolvedScopeId}:${resolvedProblemId}`,
    [resolvedUserId, resolvedScope, resolvedScopeId, resolvedProblemId]
  );

  const getDraftKey = (lang) => `${draftKeyBase}:${lang}`;
  const normalizedPreviewId = String(submissionPreviewId || '');
  const normalizedSubmissionId = String(currentSubmission?._id || '');
  const isViewingSelectedSubmission = Boolean(
    normalizedPreviewId && normalizedSubmissionId && normalizedPreviewId === normalizedSubmissionId
  );

  const clearDraftForContext = () => {
    try {
      languageKeys.forEach((lang) => {
        localStorage.removeItem(getDraftKey(lang));
      });
      localStorage.removeItem(`${draftKeyBase}:meta`);
    } catch (error) {
      console.error('Failed to clear editor draft:', error);
    }
  };


  const changeLanguage = (lang) => {
    if (lang !== language && isViewingSelectedSubmission) {
      clearSubmissionPreviewId();
    }
    setLanguage(lang);
  }

  const handleSumit = async () => {
    const problemId = currentProblem._id;
    const response = await submitCode(problemId, code, language, contestId, classroomId);
    const submissionResult = response.data;
    clearSubmissionPreviewId();
    clearDraftForContext();
    submissionResult.isNew = true;
    addSubmission(submissionResult);
    let baseUrl;
    if (classCode) {
      // Classroom problem
      baseUrl = `/classrooms/${classCode}/problems/${problemId}`;
    } else {
      // Regular problemset
      baseUrl = `/problemset/problem/${problemId}`;
    }

    // Navigate to submission tab
    navigate(`${baseUrl}/submission`, {
      replace: true,
      state: location.state // Preserve state
    });

    // Or use callback if provided
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  }

  useEffect(() => {
    if (!isViewingSelectedSubmission) {
      return;
    }

    const submissionLanguage = String(currentSubmission?.language || '').toLowerCase();
    if (submissionLanguage && mapValue[submissionLanguage] && submissionLanguage !== language) {
      setLanguage(submissionLanguage);
    }
  }, [isViewingSelectedSubmission, currentSubmission?._id, currentSubmission?.language, language, mapValue]);

  useEffect(() => {
    if (skipRestoreOnceRef.current) {
      skipRestoreOnceRef.current = false;
      return;
    }

    if (isViewingSelectedSubmission) {
      const submissionSource = String(currentSubmission?.source || '');
      setCode(submissionSource || mapValue[language]?.code || '');
      return;
    }

    const fallbackCode = currentSubmission?.source || currentProblem?.lastSubmission?.source || mapValue[language]?.code || '';
    let draftCode = null;

    try {
      draftCode = localStorage.getItem(getDraftKey(language));
    } catch (error) {
      console.error('Failed to read editor draft:', error);
    }

    setCode(draftCode !== null ? draftCode : fallbackCode);
  }, [
    language,
    currentProblem?._id,
    currentProblem?.lastSubmission?.source,
    currentSubmission?._id,
    currentSubmission?.source,
    isViewingSelectedSubmission,
    mapValue,
    draftKeyBase,
  ]);

  useEffect(() => {
    if (isViewingSelectedSubmission) {
      return;
    }

    try {
      localStorage.setItem(getDraftKey(language), String(debouncedCode || ''));
      localStorage.setItem(
        `${draftKeyBase}:meta`,
        JSON.stringify({
          updatedAt: Date.now(),
          language,
          scope: resolvedScope,
          scopeId: resolvedScopeId,
          problemId: resolvedProblemId,
        })
      );
    } catch (error) {
      console.error('Failed to save editor draft:', error);
    }
  }, [debouncedCode, language, draftKeyBase, resolvedScope, resolvedScopeId, resolvedProblemId, isViewingSelectedSubmission]);

  useEffect(() => {
    if (typeof onEditorSnapshotChange === 'function') {
      onEditorSnapshotChange({ code, language });
    }
  }, [code, language, onEditorSnapshotChange]);

  const handleEditorChange = (value) => {
    if (isViewingSelectedSubmission) {
      skipRestoreOnceRef.current = true;
      clearSubmissionPreviewId();
    }
    setCode(value);
  };

  return (
    <div>
      <div >
        <PreferenceNav
          changLanguage={changeLanguage}
          onSubmit={handleSumit}
          onRunCode={() => { if (window.__triggerPreTestRun) window.__triggerPreTestRun(); }}
          isRunning={isPreTesting}
          language={language}
        />
      </div>
      <div className='w-full overflow-auto'>
        <CodeMirror
          value={code}
          extensions={mapValue[language].extensions()}
          theme={vscodeLight}
          style={{ fontSize: 16 }}
          onChange={handleEditorChange}
        />
      </div>

      {/* Pre-Test Collapsible Section under CodeMirror */}
      <PreTestPanel
        problemId={currentProblem?._id || problemId}
        sourceCode={code}
        language={language}
        isOpen={isPreTestOpen}
        setIsOpen={setIsPreTestOpen}
        activeTab={preTestTab}
        setActiveTab={setPreTestTab}
        onRunStart={() => setIsPreTesting(true)}
        onRunFinish={() => setIsPreTesting(false)}
      />

      {/* Error Message Panel */}
      {isViewingSelectedSubmission && currentSubmission?.errorMessage && (
        <div className='border-t border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800'>
          <div className='flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/40 border-b border-red-200 dark:border-red-800'>
            <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0' />
            <span className='text-sm font-semibold text-red-700 dark:text-red-300'>
              Error Output
            </span>
            <span className='ml-auto text-xs text-red-500 dark:text-red-400'>
              {currentSubmission.status}
            </span>
          </div>
          <pre className='px-4 py-3 text-sm font-mono text-red-800 dark:text-red-300 whitespace-pre-wrap break-words overflow-auto max-h-48'>
            {currentSubmission.errorMessage}
          </pre>
        </div>
      )}
    </div>
  )
}

export default PlayGround