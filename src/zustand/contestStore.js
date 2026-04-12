import { create } from 'zustand';
export const contestStore = create((set) => ({
  contest: null,
  contestProblems: [],
  setContest: (contest) => 
    set(() => ({
      contest: contest,
    })),
  setContestProblems: (problems) =>
    set(() => ({
      contestProblems: problems,
    })),
    
}));