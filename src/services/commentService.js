import api from '../utils/api';
import { COMMENT_ENDPOINTS } from '../config/endpoints';

export const commentService = {
  // Get comments for a post
  getPostComments: async (postId, page = 1, limit = 10, options = {}) => {
    try {
      // ✅ Build query parameters including sortBy
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(options.sortBy && { sortBy: options.sortBy }),
        ...options // Include any other options
      });
      
      const url = `${COMMENT_ENDPOINTS.GET_POST_COMMENTS(postId)}?${params.toString()}`;
      
    
      const response = await api.get(url);
      
 
      
      // Return đúng structure mà CommentContext expect
      return {
        data: {
          comments: response.data.data?.comments || [],
          pagination: response.data.data?.pagination || {},
          meta: response.data.data?.meta || {} //  Include meta info from backend
        }
      };
    } catch (error) {
      console.error('commentService.getPostComments error:', error);
      throw error;
    }
  },

  // Create comment  
  createComment: async (commentData) => {
    try {
      const response = await api.post(COMMENT_ENDPOINTS.CREATE, commentData);
      
      // Return đúng structure
      return {
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Update comment
  updateComment: async (commentId, content) => {
    try {
      const response = await api.put(COMMENT_ENDPOINTS.UPDATE(commentId), { content });
      
      return {
        data: response.data.data || response.data
      };
    } catch (error) {
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(COMMENT_ENDPOINTS.DELETE(commentId));
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Toggle like comment
  toggleLikeComment: async (commentId) => {
    try {
      const response = await api.post(COMMENT_ENDPOINTS.TOGGLE_LIKE(commentId));
      
      return {
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }
};