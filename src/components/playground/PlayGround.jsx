import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import {vscodeLight} from '@uiw/codemirror-theme-vscode';
import PreferenceNav from './preferences/PreferenceNav';
import { mapLanguage } from '@/lib/utils.js';
import { useProblem } from '@/context/ProblemContext';
import { useSubmission } from '@/context/SubmissionContext';
import { submitCode } from '@/services/submissionService';




const PlayGround = () => {
  const mapValue = mapLanguage();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(mapValue[language].code);
  const { currentProblem } = useProblem();
  const { startSubmission, updateSubmissionResult, submissionState} = useSubmission();
  const changeLanguage = (lang) =>{
    setLanguage(lang);
  }
  
  const handleSumit = async () => {
    console.log('Hello');
    const problemId = currentProblem._id;
    const response = await submitCode(problemId, code, language);
    startSubmission(response.data._id);
  }

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
          value={submissionState?.result?.source || currentProblem?.lastSubmission?.source || code}
          extensions={mapValue[language].extensions()}
          theme={vscodeLight}
          style={{fontSize:16}}
          onChange={(value) => setCode(value)}
        />
      </div>
    </div>
  )
}

export default PlayGround