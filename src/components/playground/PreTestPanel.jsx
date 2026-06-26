import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Terminal, CheckCircle2, XCircle, Clock, Cpu, AlertTriangle, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSocket } from '@/context/SocketContext';
import { submitPreTest, getPreTestResult } from '@/services/pretestService';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  Pending: { title: 'Running...', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-300', icon: Loader2, spin: true },
  AC: { title: 'Accepted', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300', icon: CheckCircle2 },
  WA: { title: 'Wrong Answer', color: 'text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 border-red-300', icon: XCircle },
  CE: { title: 'Compile Error', color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300', icon: Terminal },
  RTE: { title: 'Runtime Error', color: 'text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 border-red-300', icon: AlertTriangle },
  TLE: { title: 'Time Limit Exceeded', color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300', icon: Clock },
  MLE: { title: 'Memory Limit Exceeded', color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300', icon: Cpu },
  ERROR: { title: 'System Error', color: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border-slate-300', icon: AlertTriangle }
};

export function PreTestPanel({
  problemId,
  sourceCode,
  language,
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  onRunStart,
  onRunFinish
}) {
  const { on, off } = useSocket();
  const [customInput, setCustomInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const activePreTestIdRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Check 64 KiB stdin limit
  const inputSizeBytes = new Blob([customInput]).size;
  const isInputTooLarge = inputSizeBytes > 64 * 1024;

  const cleanupTimers = () => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    fallbackTimerRef.current = null;
    pollingIntervalRef.current = null;
  };

  const handleResultDelivered = (data) => {
    if (!data || data.preTestId !== activePreTestIdRef.current) return;
    cleanupTimers();
    setIsRunning(false);
    setVerdict(data);
    if (onRunFinish) onRunFinish();
  };

  useEffect(() => {
    const socketCallback = (payload) => {
      handleResultDelivered(payload);
    };

    on('PRE_TEST_RESULT', socketCallback);
    return () => {
      off('PRE_TEST_RESULT', socketCallback);
      cleanupTimers();
    };
  }, [on, off]);

  const triggerRunCode = async () => {
    if (isInputTooLarge) {
      toast.error('Input payload exceeds 64 KiB maximum limit.');
      return;
    }

    if (!sourceCode?.trim()) {
      toast.error('Please enter some source code before running.');
      return;
    }

    setIsOpen(true);
    setActiveTab('Result');
    setIsRunning(true);
    setVerdict({ status: 'Pending' });
    if (onRunStart) onRunStart();

    cleanupTimers();

    try {
      const res = await submitPreTest({
        problemId: problemId || null,
        source: sourceCode,
        language: language,
        input: customInput,
        expectedOutput: expectedOutput
      });

      const returnedId = res?.data?.preTestId || res?.preTestId;
      if (!returnedId) throw new Error('No preTestId returned from server');

      activePreTestIdRef.current = returnedId;

      // 4000ms fallback safety timer
      fallbackTimerRef.current = setTimeout(() => {
        pollingIntervalRef.current = setInterval(async () => {
          try {
            const pollRes = await getPreTestResult(activePreTestIdRef.current);
            const pollData = pollRes?.data || pollRes;
            if (pollData && pollData.status && pollData.status !== 'Pending') {
              handleResultDelivered(pollData);
            }
          } catch (err) {
            // Silently retry or abort on 404
            if (err?.response?.status === 404) {
              cleanupTimers();
              setIsRunning(false);
              setVerdict({ status: 'ERROR', error: 'Execution request expired or not found.' });
              if (onRunFinish) onRunFinish();
            }
          }
        }, 3000);
      }, 5000);

    } catch (err) {
      cleanupTimers();
      setIsRunning(false);
      setVerdict({ status: 'ERROR', error: err?.message || 'Failed to trigger pre-test execution.' });
      if (onRunFinish) onRunFinish();
    }
  };

  // Export trigger Run Code function via window or ref if needed
  useEffect(() => {
    window.__triggerPreTestRun = triggerRunCode;
    return () => {
      delete window.__triggerPreTestRun;
    };
  });

  const currentConfig = STATUS_CONFIG[verdict?.status] || STATUS_CONFIG.ERROR;
  const StatusIcon = currentConfig.icon;

  const formattedTime = typeof verdict?.time === 'number' ? `${(verdict.time * 1000).toFixed(0)} ms` : null;
  const formattedMemory = typeof verdict?.memoryMb === 'number' ? `${verdict.memoryMb.toFixed(1)} MB` : null;

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-all">
      {/* Drawer Header & Tabs Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 select-none">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 px-2 hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            <Terminal className="h-4 w-4 text-purple-600" />
            <span>Testcase & Result</span>
            {isOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronUp className="h-4 w-4 text-slate-400" />}
          </Button>

          {isOpen && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-8 bg-slate-200/60 dark:bg-slate-800 p-0.5">
                <TabsTrigger value="Testcase" className="text-xs px-3 h-7 font-medium">
                  Testcase
                </TabsTrigger>
                <TabsTrigger value="Result" className="text-xs px-3 h-7 font-medium flex items-center gap-1.5">
                  <span>Result</span>
                  {verdict?.status && (
                    <span className={`h-2 w-2 rounded-full ${verdict.status === 'AC' ? 'bg-emerald-500' : verdict.status === 'Pending' ? 'bg-yellow-500 animate-ping' : 'bg-red-500'}`} />
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {!isOpen && (
          <div className="flex items-center gap-2">
            {verdict?.status && verdict.status !== 'Pending' && (
              <Badge variant="outline" className={`text-xs font-semibold px-2 py-0.5 border ${currentConfig.color}`}>
                {currentConfig.title}
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={triggerRunCode} disabled={isRunning} className="h-7 text-xs border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
              <Play className="h-3 w-3 mr-1 fill-purple-600" />
              Run Code
            </Button>
          </div>
        )}
      </div>

      {/* Drawer Content Area */}
      {isOpen && (
        <div className="p-4 max-h-72 overflow-auto">
          {activeTab === 'Testcase' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Custom Stdin Input
                  </label>
                  <span className={`text-[11px] font-mono ${isInputTooLarge ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    {(inputSizeBytes / 1024).toFixed(1)} / 64 KiB
                  </span>
                </div>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter input parameters here..."
                  className="w-full h-36 p-3 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Expected Stdout Output
                </label>
                <textarea
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  placeholder="Enter expected output comparison string..."
                  className="w-full h-36 p-3 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'Result' && (
            <div className="flex flex-col gap-4">
              {!verdict ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Click "Run Code" to test your solution against custom testcases.
                </div>
              ) : verdict.status === 'Pending' ? (
                <div className="flex flex-col gap-3 py-4">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Executing in isolated container...</span>
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              ) : (
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  {/* Verdict Status Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className={`p-1.5 rounded-full border ${currentConfig.color}`}>
                        <StatusIcon className={`h-5 w-5 ${currentConfig.spin ? 'animate-spin' : ''}`} />
                      </span>
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {currentConfig.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {formattedTime && (
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
                          <Clock className="h-3.5 w-3.5 text-purple-500" />
                          <span>Runtime: <strong className="text-slate-700 dark:text-slate-200">{formattedTime}</strong></span>
                        </div>
                      )}
                      {formattedMemory && (
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
                          <Cpu className="h-3.5 w-3.5 text-purple-500" />
                          <span>Memory: <strong className="text-slate-700 dark:text-slate-200">{formattedMemory}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compile Error / Runtime Error / System Error Terminal Box */}
                  {(verdict.status === 'CE' || verdict.status === 'RTE' || verdict.status === 'ERROR') && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        Error Details
                      </span>
                      <pre className="p-4 bg-slate-950 text-rose-300 rounded-lg font-mono text-xs overflow-auto max-h-48 border border-rose-900/50 whitespace-pre-wrap break-all">
                        {verdict.error || 'Unknown execution failure.'}
                      </pre>
                    </div>
                  )}

                  {/* Accepted or Wrong Answer Diff Comparison Box */}
                  {(verdict.status === 'AC' || verdict.status === 'WA') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${verdict.status === 'AC' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          Actual Output
                        </span>
                        <pre className={`p-3 text-xs font-mono rounded-lg border overflow-auto max-h-40 whitespace-pre-wrap ${verdict.status === 'AC' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 font-semibold'}`}>
                          {verdict.actualOutput !== undefined && verdict.actualOutput !== null ? (verdict.actualOutput === '' ? '(empty)' : verdict.actualOutput) : '(no output)'}
                        </pre>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Expected Output
                        </span>
                        <pre className="p-3 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-auto max-h-40 whitespace-pre-wrap">
                          {expectedOutput || '(not specified)'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PreTestPanel;
