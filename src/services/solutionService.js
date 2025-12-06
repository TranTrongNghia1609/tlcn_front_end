import api from '../utils/api';

const BASE_URL = '/solutions';

export const solutionService = {
  // Create solution
  createSolution: async (data) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Get solutions by problem
  getSolutionsByProblem: async (problemShortId, params = {}) => {
    const response = await api.get(`${BASE_URL}/problem/${problemShortId}`, { params });
    return response.data;
  },

  // Get solution by ID
  getSolutionById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update solution
  updateSolution: async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete solution
  deleteSolution: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Vote solution (upvote/downvote)
  voteSolution: async (id, voteType) => {
    const response = await api.post(`${BASE_URL}/${id}/vote`, { voteType });
    return response.data;
  },

  // Remove vote
  removeVote: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}/vote`);
    return response.data;
  },

  // Get vote status for multiple solutions
  getUserVoteStatus: async (solutionIds) => {
    const response = await api.get(`${BASE_URL}/votes/status`, {
      params: { solutionIds: solutionIds.join(',') }
    });
    return response.data;
  },

  // Add comment
  addComment: async (id, data) => {
    const response = await api.post(`${BASE_URL}/${id}/comments`, data);
    return response.data;
  },

  // Update comment
  updateComment: async (id, commentId, data) => {
    const response = await api.put(`${BASE_URL}/${id}/comments/${commentId}`, data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id, commentId) => {
    const response = await api.delete(`${BASE_URL}/${id}/comments/${commentId}`);
    return response.data;
  },

  // Vote comment
  voteComment: async (id, commentId, voteType) => {
    const response = await api.post(`${BASE_URL}/${id}/comments/${commentId}/vote`, { voteType });
    return response.data;
  },

  // Add reply
  addReply: async (id, commentId, data) => {
    const response = await api.post(`${BASE_URL}/${id}/comments/${commentId}/replies`, data);
    return response.data;
  },

  // Moderate solution (Admin)
  moderateSolution: async (id, action, reason = null) => {
    const response = await api.patch(`${BASE_URL}/${id}/moderate`, { action, reason });
    return response.data;
  },

  // Get all solutions (Admin)
  getAllSolutions: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/admin/all`, { params });
    return response.data;
  },

  // Check solution exists
  checkSolutionExists: async (problemShortId) => {
    try {
      const response = await api.get(`${BASE_URL}/check/${problemShortId}`);
      return response.data;
    } catch (error) {
      console.error('Check solution error:', error);
      throw error;
    }
  }
};

export default solutionService;