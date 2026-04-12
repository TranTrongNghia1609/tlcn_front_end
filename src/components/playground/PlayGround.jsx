import React, { use, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import PreferenceNav from './preferences/PreferenceNav';
import { mapLanguage } from '@/lib/utils.js';
import { useProblem } from '@/context/ProblemContext';
import { submitCode } from '@/services/submissionService';
import { submissionsStore } from '@/zustand/store';
import { useLocation,  useParams, useNavigate } from 'react-router-dom';

const PlayGround = ({ contestId = null, classroomId = null, onSubmitSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: problemId, classCode } = useParams();
  const mapValue = mapLanguage();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(mapValue[language].code);
  const { currentProblem } = useProblem();
  const currentSubmission = submissionsStore((state) => state.currentSubmission);
  const addSubmission = submissionsStore((state) => state.addSubmission);
  const effectiveClassroomId = classroomId || location.state?.classroomId;
  const fromClassroom = location.state?.fromClassroom;


  const changeLanguage = (lang) => {
    setLanguage(lang);
  }

  const handleSumit = async () => {
    const problemId = currentProblem._id;
    const response = await submitCode(problemId, code, language, contestId, classroomId );
    const submissionResult = response.data;
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