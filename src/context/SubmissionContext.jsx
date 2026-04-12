import { createContext, useContext, useState } from 'react';

const SubmissionContext = createContext();

export const useSubmission = () => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error('useSubmission must be used within SubmissionProvider');
  }
  return context;
};

export const SubmissionProvider = ({ children }) => {
  const [submissionState, setSubmissionState] = useState({
    isSubmitting: false,
    submissionId: null,
    status: null, // 'pending', 'success', 'failed'
    result: null
  });

  const startSubmission = (submissionId) => {
    setSubmissionState({
      isSubmitting: true,
      submissionId,
      status: 'pending',
      result: null
    });
  };

  const updateSubmissionResult = (result) => {
    setSubmissionState(prev => ({
      ...prev,
      isSubmitting: false,
      status: result.status,
      result: result
    }));
  };

  const resetSubmission = () => {
    setSubmissionState({
      isSubmitting: false,
      submissionId: null,
      status: null,
      result: null
    });
  };

  return (
    <SubmissionContext.Provider 
      value={{ 
        submissionState, 
        startSubmission, 
        updateSubmissionResult, 
        resetSubmission 
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};