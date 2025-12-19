import api from '../utils/api';
import { DISCUSSION_ENDPOINTS } from '../config/endpoints';

const discussionService = {
  // Get all discussions
  getDiscussions: async (classCode, params = {}) => {
    const response = await api.get(DISCUSSION_ENDPOINTS.GET_DISCUSSIONS(classCode), { params });
    return response.data;
  },

  // Get discussion by ID
  getDiscussionById: async (classCode, discussionId) => {
    const response = await api.get(DISCUSSION_ENDPOINTS.GET_DISCUSSION_BY_ID(classCode, discussionId));
    return response.data;
  },


  // Update discussion
  updateDiscussion: async (classCode, discussionId, data) => {
    const response = await api.put(DISCUSSION_ENDPOINTS.UPDATE_DISCUSSION(classCode, discussionId), data);
    return response.data;
  },

  // Delete discussion
  deleteDiscussion: async (classCode, discussionId) => {
    const response = await api.delete(DISCUSSION_ENDPOINTS.DELETE_DISCUSSION(classCode, discussionId));
    return response.data;
  },


  // Add comment
  addComment: async (classCode, discussionId, data) => {
    const response = await api.post(DISCUSSION_ENDPOINTS.ADD_COMMENT(classCode, discussionId), data);
    return response.data;
  },

  // Edit comment
  editComment: async (classCode, discussionId, commentId, data) => {
    const response = await api.put(DISCUSSION_ENDPOINTS.EDIT_COMMENT(classCode, discussionId, commentId), data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (classCode, discussionId, commentId) => {
    const response = await api.delete(DISCUSSION_ENDPOINTS.DELETE_COMMENT(classCode, discussionId, commentId));
    return response.data;
  },

  // Toggle comment like
  toggleCommentLike: async (classCode, discussionId, commentId) => {
    const response = await api.post(DISCUSSION_ENDPOINTS.TOGGLE_COMMENT_LIKE(classCode, discussionId, commentId));
    return response.data;
  },

  // Add reply to comment
  addReply: async (classCode, discussionId, commentId, data) => {
    const response = await api.post(DISCUSSION_ENDPOINTS.ADD_REPLY(classCode, discussionId, commentId), data);
    return response.data;
  },

  // Edit reply
  editReply: async (classCode, discussionId, commentId, replyId, data) => {
    const response = await api.put(DISCUSSION_ENDPOINTS.EDIT_REPLY(classCode, discussionId, commentId, replyId), data);
    return response.data;
  },

  // Delete reply
  deleteReply: async (classCode, discussionId, commentId, replyId) => {
    const response = await api.delete(DISCUSSION_ENDPOINTS.DELETE_REPLY(classCode, discussionId, commentId, replyId));
    return response.data;
  },

  // Toggle reply like
  toggleReplyLike: async (classCode, discussionId, commentId, replyId) => {
    const response = await api.post(DISCUSSION_ENDPOINTS.TOGGLE_REPLY_LIKE(classCode, discussionId, commentId, replyId));
    return response.data;
  },

  // ===== REACTIONS =====
  
  // Add reaction
  addReaction: async (classCode, discussionId, type) => {
    const response = await api.post(DISCUSSION_ENDPOINTS.ADD_REACTION(classCode, discussionId), { type });
    return response.data;
  },

  // Remove reaction
  removeReaction: async (classCode, discussionId) => {
    const response = await api.delete(DISCUSSION_ENDPOINTS.REMOVE_REACTION(classCode, discussionId));
    return response.data;
  },

  
};

export default discussionService;