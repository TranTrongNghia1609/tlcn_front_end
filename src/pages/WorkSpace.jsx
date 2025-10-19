// WorkSpace.jsx
import ProblemDetail from '@/components/problems/ProblemDetail';
import React, { useEffect, useMemo, useState } from 'react';
import Split from 'react-split';
import PlayGround from '../components/playground/PlayGround';
import { ProblemProvider, useProblem } from '@/context/ProblemContext';
import { useParams } from 'react-router-dom';
import { SubmissionProvider, useSubmission } from '@/context/SubmissionContext';
import MySubmission from '@/components/submission/ProblemSubmission'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Description from '@/assets/description';
import History from '@/assets/history';

const WorkSpaceContent = () => {
  const { submissionState } = useSubmission();
  const showSubmissionStatus = useMemo(() => {
    return submissionState.isSubmitting || submissionState.status !== null;
  }, [submissionState]);
  
  const [activeTab, setActiveTab] = useState(showSubmissionStatus ? "submission" : "statement");

  // Update tab when submission state changes
  useEffect(() => {
    if (showSubmissionStatus) {
      setActiveTab("submission");
    }
  }, [showSubmissionStatus]);
  return (
    <div className='h-[calc(100vh-88px)] mt-1 min-h-0 overflow-hidden'>
      <Split className="split h-full min-h-0" minSize={200}>
        <div className="h-full min-h-0 overflow-y-auto">
        <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}  // Cho phép user click để chuyển tab
        className="bg-gray-50">
          <TabsList>
            <TabsTrigger value="statement"
            >
              {/* <img src={description} width={24} height={24} /> */}
              <Description />
              Description
            </TabsTrigger>
            <TabsTrigger value="submission"
            >
              <History />
              Submission
            </TabsTrigger>
          </TabsList>
          <TabsContent value="statement"><ProblemDetail /></TabsContent>
          <TabsContent value="submission"><MySubmission/></TabsContent>
        </Tabs>
          {/* {showSubmissionStatus ? (
            <MySubmission />
          ) : (
            <ProblemDetail />
          )} */}
        </div>
        <div className="h-full min-h-0 overflow-y-auto bg-gray-50">
          <PlayGround />
        </div>
      </Split>
    </div>
  );
};

const WorkSpace = () => {
  const { id } = useParams();
  
  return (
    <ProblemProvider problemId={id}>
      <SubmissionProvider>
        <WorkSpaceContent />
      </SubmissionProvider>
    </ProblemProvider>
  );
};

export default WorkSpace;