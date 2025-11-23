import React from 'react';
import ProblemHeader from './ProblemHeader';
import ProblemStatement from '@/components/problems/ProblemStatement';
import ProblemExamples from '@/components/problems/ProblemExamples';
import { useProblem } from '@/context/ProblemContext';
import { Loader2 } from 'lucide-react';

const ProblemDetail = () => {
  const { currentProblem, loading, error } = useProblem();
  console.log("Current Problem:", currentProblem);
  
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          <p className="font-semibold">Error loading problem</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="w-full px-4 py-6">
        <p className="text-muted-foreground">No problem found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-col justify-center items-center content-center">
        <div>
          <ProblemHeader 
            title={currentProblem.name} 
            tags={currentProblem.tags} 
            time={currentProblem.time} 
            memory={currentProblem.memory}
          />
        </div>
        <ProblemStatement 
          statement={currentProblem.statement} 
          input={currentProblem.input} 
          output={currentProblem.output}
        />
        <ProblemExamples 
          examplesInput={currentProblem.examplesInput} 
          examplesOutput={currentProblem.examplesOutput}
        />
      </div>
    </div>
  );
};

export default ProblemDetail;