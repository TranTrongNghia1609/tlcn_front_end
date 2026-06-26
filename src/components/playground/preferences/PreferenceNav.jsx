import React, { useState } from "react"
import { ComboBox } from "@/components/common/Combobox"
import { Play, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useProblem } from "@/context/ProblemContext";
import { submitCode } from "@/services/submissionService";
export function PreferenceNav({changLanguage, onSubmit, language}) {
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
    // {
    //   value: "js",
    //   label: "Javascript",
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
    // },
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
    // {
    //   value: "cs",
    //   label: "C#",
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg"
    // },
  ]
  return (
    <div className="flex justify-between">
      <ComboBox
        options={languages}
        placeholder="Select language..."
        defaultValue="cpp"
        value={language}
        onChange={changLanguage}
      />
      <div className="mr-1 flex">
        <Button
          variant="ghost">
          <Settings color="#7008e7" strokeWidth={2.5}/>
        </Button>
        
        {/* button submit code */}
        <Button
          variant="ghost"
          onClick={onSubmit}
          >
          <Play color="#7008e7" size={20} strokeWidth={2.5}/>
        </Button>
      </div>
    </div>
  )
}

export default PreferenceNav