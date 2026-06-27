import React, { useState } from "react"
import { ComboBox } from "@/components/common/Combobox"
import { Play, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useProblem } from "@/context/ProblemContext";
import { submitCode } from "@/services/submissionService";
export function PreferenceNav({changLanguage, onSubmit, onRunCode, isRunning, language}) {
  const { currentProblem } = useProblem();
  const languages = [
    {
      value: "py",
      label: "Python",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
    },
    {
      value: "cpp",
      label: "C++",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"
    },
    {
      value: "rb",
      label: "Ruby",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg"
    },
    {
      value: "pl",
      label: "Perl",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg"
    },
  ]
  return (
    <div className="flex justify-between items-center py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <ComboBox
        options={languages}
        placeholder="Select language..."
        defaultValue="cpp"
        value={language}
        onChange={changLanguage}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400">
          <Settings size={18} />
        </Button>
        
        {/* button run code */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRunCode}
          disabled={isRunning}  
          className="cursor-pointer h-8 flex items-center gap-1.5 border-blue-600 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium px-3 transition-all"
        >
          <Play size={15} className={`fill-blue-600 text-blue-600 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </Button>

        {/* button submit code */}
        <Button
          size="sm"
          onClick={onSubmit}
          className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 shadow-sm transition-all cursor-pointer"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default PreferenceNav