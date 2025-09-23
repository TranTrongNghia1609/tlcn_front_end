import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { commentService } from '../services/commentService';

// Initial state
const initialState = {
  commentsByPost: {}, // { postId: { comments: [], pagination: {}, loading: false } }
  repliesByComment: {}, // { commentId: { replies: [], pagination: {}, loading: false } }
  loading: false,
  error: null
};

// Action types
const COMMENT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_POST_COMMENTS: 'SET_POST_COMMENTS',
  ADD_POST_COMMENTS: 'ADD_POST_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  SET_COMMENT_REPLIES: 'SET_COMMENT_REPLIES',
  ADD_COMMENT_REPLIES: 'ADD_COMMENT_REPLIES',
  ADD_REPLY: 'ADD_REPLY',
  UPDATE_COMMENT_LIKE: 'UPDATE_COMMENT_LIKE',
  CLEAR_POST_COMMENTS: 'CLEAR_POST_COMMENTS'
};

// Reducer
function commentReducer(state, action) {
  switch (action.type) {
    case COMMENT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case COMMENT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case COMMENT_ACTIONS.SET_POST_COMMENTS:
      const { postId, comments, pagination } = action.payload;
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            comments,
            pagination: {
              ...pagination,
              currentSort: pagination.sortBy || 'newest',
              lastUpdated: new Date().toISOString()
            },
            loading: false
          }
        },
        loading: false
      };

    case COMMENT_ACTIONS.ADD_POST_COMMENTS:
      const { postId: pid, comments: newComments, pagination: newPagination } = action.payload;
      const existingData = state.commentsByPost[pid] || { comments: [] };
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [pid]: {
            comments: [...existingData.comments, ...newComments],
            pagination: {
              ...newPagination,
              currentSort: newPagination.sortBy || existingData.pagination?.currentSort || 'newest',
              lastUpdated: new Date().toISOString()
            },
            loading: false
          }
        },
        loading: false
      };

    case COMMENT_ACTIONS.ADD_COMMENT:
      const { postId: addPostId, comment } = action.payload;
      const postData = state.commentsByPost[addPostId] || { comments: [], pagination: {} };
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [addPostId]: {
            ...postData,
            comments: [comment, ...postData.comments],
            pagination: {
              ...postData.pagination,
              totalComments: (postData.pagination.totalComments || 0) + 1
            }
          }
        }
      };

    case COMMENT_ACTIONS.UPDATE_COMMENT:
      const { postId: upPostId, commentId, updates } = action.payload;
      const updatePostData = state.commentsByPost[upPostId];
      if (!updatePostData) return state;

      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [upPostId]: {
            ...updatePostData,
            comments: updatePostData.comments.map(comment =>
              comment._id === commentId ? { ...comment, ...updates } : comment
            )
          }
        }
      };

    case COMMENT_ACTIONS.DELETE_COMMENT:
      const { postId: delPostId, commentId: delCommentId } = action.payload;
      const deletePostData = state.commentsByPost[delPostId];
      if (!deletePostData) return state;

      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [delPostId]: {
            ...deletePostData,
            comments: deletePostData.comments.filter(comment => comment._id !== delCommentId),
            pagination: {
              ...deletePostData.pagination,
              totalComments: Math.max(0, (deletePostData.pagination.totalComments || 0) - 1)
            }
          }
        }
      };

    case COMMENT_ACTIONS.ADD_REPLY:
      const { parentCommentId, reply, postId: replyPostId } = action.payload;
      const replyPostData = state.commentsByPost[replyPostId];
      if (!replyPostData) return state;

      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [replyPostId]: {
            ...replyPostData,
            comments: replyPostData.comments.map(comment =>
              comment._id === parentCommentId
                ? { ...comment, replies: [reply, ...(comment.replies || [])] }
                : comment
            )
          }
        }
      };

    case COMMENT_ACTIONS.UPDATE_COMMENT_LIKE:
      const { commentId: likeCommentId, isLiked, likesCount } = action.payload;
      const newState = { ...state };

      // Update in all posts that contain this comment
      Object.keys(newState.commentsByPost).forEach(postId => {
        const postData = newState.commentsByPost[postId];
        if (postData) {
          newState.commentsByPost[postId] = {
            ...postData,
            comments: postData.comments.map(comment => {
              if (comment._id === likeCommentId) {
                return { ...comment, isLiked, likesCount };
              }
              // Check replies too
              if (comment.replies) {
                return {
                  ...comment,
                  replies: comment.replies.map(reply =>
                    reply._id === likeCommentId
                      ? { ...reply, isLiked, likesCount }
                      : reply
                  )
                };
              }
              return comment;
            })
          };
        }
      });

      return newState;

    case COMMENT_ACTIONS.CLEAR_POST_COMMENTS:
      const { postId: clearPostId } = action.payload;
      const { [clearPostId]: removed, ...remainingComments } = state.commentsByPost;
      return {
        ...state,
        commentsByPost: remainingComments
      };

    default:
      return state;
  }
}

// Create context
const CommentContext = createContext();

// Custom hook
export const useComment = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComment must be used within CommentProvider');
  }
  return context;
};

// Provider component
export const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  // API functions
  const api = {

    loadPostComments: useCallback(async (postId, page = 1, options = {}) => {
      try {
        dispatch({ type: COMMENT_ACTIONS.SET_LOADING, payload: true });

        console.log('🎯 CommentContext.loadPostComments:', {
          postId: postId?.slice(-4),
          page,
          options,
          sortBy: options.sortBy
        });

        // ✅ Pass options including sortBy to service
        const response = await commentService.getPostComments(
          postId,
          page,
          options.limit || 10,
          options
        );

        console.log('✅ CommentContext response:', {
          commentsCount: response.data.comments?.length,
          pagination: response.data.pagination,
          meta: response.data.meta
        });

        // ✅ Parse correct structure from service
        const { comments, pagination, meta } = response.data;

        if (page === 1) {
          dispatch({
            type: COMMENT_ACTIONS.SET_POST_COMMENTS,
            payload: {
              postId,
              comments,
              pagination: {
                ...pagination,
                sortBy: options.sortBy || 'newest',
                meta
              }
            }
          });
        } else {
          dispatch({
            type: COMMENT_ACTIONS.ADD_POST_COMMENTS,
            payload: {
              postId,
              comments,
              pagination: {
                ...pagination,
                sortBy: options.sortBy || 'newest',
                meta
              }
            }
          });
        }

        return response.data;
      } catch (error) {
        console.error('❌ CommentContext.loadPostComments error:', error);
        dispatch({ type: COMMENT_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    }, []),

    // Create comment or reply
    createComment: useCallback(async (commentData) => {
      try {
        const response = await commentService.createComment(commentData);
        const comment = response.data;

        if (commentData.parentCommentId) {
          // This is a reply
          dispatch({
            type: COMMENT_ACTIONS.ADD_REPLY,
            payload: {
              parentCommentId: commentData.parentCommentId,
              reply: comment,
              postId: commentData.postId
            }
          });
        } else {
          // This is a main comment
          dispatch({
            type: COMMENT_ACTIONS.ADD_COMMENT,
            payload: { postId: commentData.postId, comment }
          });
        }

        return response;
      } catch (error) {
        dispatch({ type: COMMENT_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    }, []),

    // Update comment
    updateComment: useCallback(async (commentId, content, postId) => {
      try {
        const response = await commentService.updateComment(commentId, content);

        dispatch({
          type: COMMENT_ACTIONS.UPDATE_COMMENT,
          payload: { postId, commentId, updates: response.data }
        });

        return response;
      } catch (error) {
        dispatch({ type: COMMENT_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    }, []),

    // Delete comment
    deleteComment: useCallback(async (commentId, postId) => {
      try {
        await commentService.deleteComment(commentId);

        dispatch({
          type: COMMENT_ACTIONS.DELETE_COMMENT,
          payload: { postId, commentId }
        });

        return true;
      } catch (error) {
        dispatch({ type: COMMENT_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    }, []),

    // Toggle like comment
    toggleLikeComment: useCallback(async (commentId) => {
      try {
        const response = await commentService.toggleLikeComment(commentId);
        const { isLiked, likesCount } = response.data;

        dispatch({
          type: COMMENT_ACTIONS.UPDATE_COMMENT_LIKE,
          payload: { commentId, isLiked, likesCount }
        });

        return response;
      } catch (error) {
        dispatch({ type: COMMENT_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    }, []),

    // Clear comments for a post
    clearPostComments: useCallback((postId) => {
      dispatch({
        type: COMMENT_ACTIONS.CLEAR_POST_COMMENTS,
        payload: { postId }
      });
    }, []),

    // Clear error
    clearError: useCallback(() => {
      dispatch({ type: COMMENT_ACTIONS.SET_ERROR, payload: null });
    }, [])
  };

  // Selectors
  const selectors = {
    getPostComments: useCallback((postId) => {
      return state.commentsByPost[postId] || { comments: [], pagination: {}, loading: false };
    }, [state.commentsByPost]),

    getCommentsCount: useCallback((postId) => {
      const postData = state.commentsByPost[postId];
      return postData?.pagination?.totalComments || 0;
    }, [state.commentsByPost])
  };

  // ✅ Fixed value object - no naming conflicts
  const value = {
    // State
    loading: state.loading,
    error: state.error,

    // ✅ API Actions with clear names
    loadPostComments: api.loadPostComments,     // Load comments from API
    createComment: api.createComment,
    updateComment: api.updateComment,
    deleteComment: api.deleteComment,
    toggleLikeComment: api.toggleLikeComment,
    clearPostComments: api.clearPostComments,
    clearError: api.clearError,

    // ✅ Selectors with clear names
    getPostComments: selectors.getPostComments,  // Get comments from state
    getCommentsCount: selectors.getCommentsCount,

    // Direct state access for advanced usage
    commentsByPost: state.commentsByPost,
    repliesByComment: state.repliesByComment,

    // Dispatch for advanced usage
    dispatch
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};

export default CommentContext;