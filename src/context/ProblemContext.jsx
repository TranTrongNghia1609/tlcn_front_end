import React, { createContext, useContext, useState, useEffect } from 'react';
import { problemService } from '../services/problemService';

const ProblemContext = createContext(undefined);

export const ProblemProvider = ({ children, problemId }) => {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(problemId);
    const fetchProblem = async () => {
      if (!problemId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await problemService.getProblemById(problemId);
        setCurrentProblem(data.data);
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError(err.message || 'Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const value = {
    currentProblem,
    loading,
    error,
    setCurrentProblem,
  };

  return (
    <ProblemContext.Provider value={value}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblem = () => {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblem must be used within a ProblemProvider');
  }
  return context;
};