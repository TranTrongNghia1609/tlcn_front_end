import React, { use, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import PreferenceNav from './preferences/PreferenceNav';
import { mapLanguage } from '@/lib/utils.js';
import { useProblem } from '@/context/ProblemContext';
import { submitCode } from '@/services/submissionService';
import { submissionsStore } from '@/zustand/store';
import { useLocation } from 'react-router-dom';



const PlayGround = ({ contestId = null, classroomId = null }) => {
  const location = useLocation();
  const mapValue = mapLanguage();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(mapValue[language].code);
  const { currentProblem } = useProblem();
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const addSubmission = submissionsStore((state) => state.addSubmission);
   const effectiveClassroomId = classroomId || location.state?.classroomId;
  const fromClassroom = location.state?.fromClassroom;

  console.log('🎮 PlayGround - classroomId (prop):', classroomId);
  console.log('🎮 PlayGround - classroomId (location):', location.state?.classroomId);
  console.log('🎮 PlayGround - effectiveClassroomId:', effectiveClassroomId);
  console.log('🎮 PlayGround - fromClassroom:', fromClassroom);
  const changeLanguage = (lang) => {
    setLanguage(lang);
  }

  const handleSumit = async () => {
    const problemId = currentProblem._id;
    console.log('📤 Submitting with:', { 
      problemId, 
      language, 
      contestId, 
      effectiveClassroomId 
    });
    const response = await submitCode(problemId, code, language, contestId, classroomId );
    const submissionResult = response.data;
    submissionResult.isNew = true;
    addSubmission(submissionResult);
  }
  useEffect(() => {
    setCode(currentSubmission?.source || currentProblem?.lastSubmission?.source || mapValue[language].code);
  }, [language, currentProblem, currentSubmission]);
  return (
    <div>
      <div >
        <PreferenceNav
          changLanguage={changeLanguage}
          onSubmit={handleSumit}
        />
      </div>
      <div className='w-full overflow-auto'>
        <CodeMirror
          value={code}
          extensions={mapValue[language].extensions()}
          theme={vscodeLight}
          style={{ fontSize: 16 }}
          onChange={(value) => setCode(value)}
        />
      </div>
    </div>
  )
}

export default PlayGround