import { create } from 'zustand';
import { getSubmissionById, getSubmissionByUserId } from '@/services/submissionService';

export const submissionsStore = create((set) => ({
  submissions: [],
  currentSubmission: null,
  addSubmission: (submission) =>
    set((state) => ({
      currentSubmission: submission,
      submissions: [submission, ...state.submissions],
    })),
  setCurrentSubmission: (submission) => 
    set(() => ({
      currentSubmission: submission,
    })),
  clearSubmissions: () => set({ submissions: [] }),
  updateSubmission: (submissionId, updateData) => 
    set((state) => ({
      submissions: state.submissions.map((submission) =>
        submission._id === submissionId
          ? { ...submission, ...updateData }
          : submission
      ),
    })),
  fetchSubmissions: async (userId, problemId, page) => {
    const response = await getSubmissionByUserId(userId, problemId, page);
    
    console.log('🔵 Response from BE:', {
      page,
      count: response.data.content.length,
      first: response.data.content[0]?._id,
      last: response.data.content[response.data.content.length - 1]?._id
    });
    
    set({submissions: [...response.data.content]});
    console.log('🟢 Submissions fetched and stored:', [...response.data.content]);
  },
  setProblemSubmissions: (submissions) => {
    set({submissions: submissions});
  }
}));  
