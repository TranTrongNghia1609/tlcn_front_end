// WorkSpace.jsx
import ProblemDetail from '@/components/problems/ProblemDetail';
import React, { useEffect, useMemo, useState } from 'react';
import Split from 'react-split';
import PlayGround from '../components/playground/PlayGround';
import { ProblemProvider, useProblem } from '@/context/ProblemContext';
import { useParams } from 'react-router-dom';
import MySubmission from '@/components/submission/ProblemSubmission'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Description from '@/assets/description';
import History from '@/assets/history';
import { submissionsStore } from '@/zustand/store';

const WorkSpaceContent = () => {
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const [activeTab, setActiveTab] = useState("statement");

  // Update tab when submission state changes
  useEffect(() => {
    console.log('First log: ', currentSubmission);
    if (currentSubmission && currentSubmission.isNew === true){
      setActiveTab("submission");
      // Mark as not new anymore
      currentSubmission.isNew = false;
    }
    else{
      setActiveTab("statement");
    }
  }, [currentSubmission]);
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
      <WorkSpaceContent />
    </ProblemProvider>
  );
};

export default WorkSpace;