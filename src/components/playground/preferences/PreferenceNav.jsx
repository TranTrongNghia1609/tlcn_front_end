import React, { useState } from "react"
import { ComboBox } from "@/components/common/Combobox"
import { Play, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/utils";
import { useProblem } from "@/context/ProblemContext";
import { submitCode } from "@/services/submissionService";
export function PreferenceNav({changLanguage, onSubmit}) {
  const { currentProblem } = useProblem();

  return (
    <div className="flex justify-between">
      <ComboBox
        options={languages}
        placeholder="Select language..."
        defaultValue="cpp"
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