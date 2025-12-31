import React from 'react';
import ProblemHeader from './ProblemHeader';
import ProblemStatement from '@/components/problems/ProblemStatement';
import ProblemExamples from '@/components/problems/ProblemExamples';
import { useProblem } from '@/context/ProblemContext';
import { Loader2, AlertCircle, Lock, XCircle } from 'lucide-react';

const ProblemDetail = () => {
  const { currentProblem, loading, error } = useProblem();
  
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
    // ✅ Different UI based on error type
    const getErrorIcon = () => {
      if (error.isNotFound) return <XCircle className="h-16 w-16 text-red-500" />;
      if (error.isForbidden || error.isUnauthorized) return <Lock className="h-16 w-16 text-yellow-500" />;
      return <AlertCircle className="h-16 w-16 text-red-500" />;
    };

    const getErrorTitle = () => {
      if (error.isNotFound) return 'Problem Not Found';
      if (error.isForbidden) return 'Access Denied';
      if (error.isUnauthorized) return 'Authentication Required';
      return 'Error Loading Problem';
    };

    const getErrorColor = () => {
      if (error.isNotFound) return 'bg-red-50 border-red-200 text-red-700';
      if (error.isForbidden || error.isUnauthorized) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      return 'bg-red-50 border-red-200 text-red-700';
    };

    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className={`max-w-md w-full ${getErrorColor()} border-2 rounded-lg p-8 shadow-lg`}>
          <div className="flex flex-col items-center text-center gap-4">
            {getErrorIcon()}
            <div>
              <h2 className="text-2xl font-bold mb-2">{getErrorTitle()}</h2>
              <p className="text-base font-medium">
                {error.message || 'Failed to fetch problem'}
              </p>
              {error.status && (
                <p className="text-sm mt-2 opacity-75">
                  Error Code: {error.status}
                </p>
              )}
            </div>
            
            
            
          </div>
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