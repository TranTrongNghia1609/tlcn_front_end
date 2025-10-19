import React from 'react';
import ProblemHeader from './ProblemHeader';
import ProblemStatement from '@/components/problems/ProblemStatement';
import ProblemExamples from '@/components/problems/ProblemExamples';
import { useProblem } from '@/context/ProblemContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProblemDetail = () => {
  const { currentProblem, loading, error } = useProblem();
  console.log("Current Problem:", currentProblem);
  if (loading) {
    return (
      <div className="w-full px-4 py-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        
        <div className="border border-border/50 rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
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