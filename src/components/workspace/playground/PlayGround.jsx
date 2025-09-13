import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import {vscodeLight} from '@uiw/codemirror-theme-vscode';
import PreferenceNav from './preferences/PreferenceNav';
import ProblemSubmissions from '@/components/submission/ProblemSubmission';
import { mapLanguage } from '@/lib/utils.js';
import Split from 'react-split';




const PlayGround = () => {
  const mapValue = mapLanguage();
  console.log(mapValue);
  const [language, setLanguage] = useState(mapValue['py']);
  const changeLanguage = (lang) =>{
    setLanguage(mapValue[lang]);
  }
  return (
    <div>
      <div >
        <PreferenceNav changLanguage={changeLanguage}/>
      </div>
      <div className='mt-1 text-2xl'>
        <Split className="h-[calc(100vh-150px)]" direction='vertical' minSize={60} sizes={[60, 40]}>
          <div className='w-full overflow-auto'>
            <CodeMirror
              value={language.code}
              extensions={language.extensions()}
              theme={vscodeLight}
              style={{fontSize:16}}
            />
          </div>
          {/* <ProblemSubmissions/> */}
          <div className='w-full overflow-auto'>
            <ProblemSubmissions/>
          </div>
        </Split>
      </div>
    </div>
  )
}

export default PlayGround