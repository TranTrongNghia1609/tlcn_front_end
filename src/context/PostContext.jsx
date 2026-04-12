import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { connectSocket, onPostCreated, onPostCounts } from '../services/socket';
import * as postService from '../services/postService';

// Initial state
const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  total: 0
};

// Action types
const POST_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_POSTS: 'SET_POSTS',
  ADD_POSTS: 'ADD_POSTS',
  SET_CURRENT_POST: 'SET_CURRENT_POST',
  UPDATE_POST_LIKE: 'UPDATE_POST_LIKE',
  UPDATE_POST: 'UPDATE_POST',
  REMOVE_POST: 'REMOVE_POST',
  UPDATE_POST_COUNTS: 'UPDATE_POST_COUNTS',
  ADD_NEW_POST: 'ADD_NEW_POST',
  RESET_POSTS: 'RESET_POSTS',
  SET_PAGE: 'SET_PAGE'
};

// Helper function để normalize post data từ server
const normalizePost = (post) => ({
  ...post,
  isLiked: Boolean(post.isLiked), // Ensure boolean từ server
  likesCount: post.likesCount || 0,
  commentsCount: post.commentsCount || 0,
  sharesCount: post.sharesCount || 0,
  viewsCount: post.viewsCount || 0
});

// Helper function để normalize array of posts
const normalizePosts = (posts) => {
  if (!Array.isArray(posts)) return [];
  return posts.map(normalizePost);
};

// Enhanced Reducer
function postReducer(state, action) {
  switch (action.type) {
    case POST_ACTIONS.UPDATE_POST_LIKE:
      const { postId, isLiked, likesCount } = action.payload;
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === postId
            ? { ...post, isLiked: Boolean(isLiked), likesCount: likesCount || 0 }
            : post
        ),
        currentPost: state.currentPost?._id === postId
          ? { ...state.currentPost, isLiked: Boolean(isLiked), likesCount: likesCount || 0 }
          : state.currentPost
      };
    
    case POST_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case POST_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case POST_ACTIONS.SET_POSTS:
      // Handle both { posts: [], meta: {} } and direct array formats
      const postsData = action.payload.posts || action.payload;
      const normalizedPosts = normalizePosts(postsData);
      
      return {
        ...state,
        posts: normalizedPosts,
        total: action.payload.meta?.total || action.payload.total || normalizedPosts.length,
        hasMore: action.payload.meta?.page ? 
          (action.payload.meta.page * 20 < action.payload.meta.total) : 
          (action.payload.hasMore !== undefined ? action.payload.hasMore : true),
        loading: false,
        error: null
      };
    
    case POST_ACTIONS.ADD_POSTS:
      //  Handle pagination - append posts
      const newPostsData = action.payload.posts || action.payload;
      const normalizedNewPosts = normalizePosts(newPostsData);
      const allPosts = [...state.posts, ...normalizedNewPosts];
      
      return {
        ...state,
        posts: allPosts,
        total: action.payload.meta?.total || action.payload.total || state.total,
        hasMore: action.payload.meta?.page ? 
          (action.payload.meta.page * 20 < action.payload.meta.total) : 
          (action.payload.hasMore !== undefined ? action.payload.hasMore : allPosts.length < state.total),
        loading: false,
        error: null
      };
    
    case POST_ACTIONS.SET_CURRENT_POST:
      return { 
        ...state, 
        currentPost: normalizePost(action.payload), 
        loading: false 
      };
    
    case POST_ACTIONS.UPDATE_POST:
      const updatedPost = normalizePost(action.payload);
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === updatedPost._id ? { ...post, ...updatedPost } : post
        ),
        currentPost: state.currentPost?._id === updatedPost._id
          ? { ...state.currentPost, ...updatedPost }
          : state.currentPost
      };
    
    case POST_ACTIONS.REMOVE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        currentPost: state.currentPost?._id === action.payload ? null : state.currentPost,
        total: Math.max(0, state.total - 1)
      };
    
    case POST_ACTIONS.UPDATE_POST_COUNTS:
      const { postId: countsPostId, likesCount: countsLikes, commentsCount, sharesCount } = action.payload;
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === countsPostId
            ? { 
                ...post, 
                likesCount: countsLikes !== undefined ? countsLikes : post.likesCount, 
                commentsCount: commentsCount !== undefined ? commentsCount : post.commentsCount, 
                sharesCount: sharesCount !== undefined ? sharesCount : post.sharesCount 
              }
            : post
        ),
        currentPost: state.currentPost?._id === countsPostId
          ? { 
              ...state.currentPost, 
              likesCount: countsLikes !== undefined ? countsLikes : state.currentPost.likesCount, 
              commentsCount: commentsCount !== undefined ? commentsCount : state.currentPost.commentsCount, 
              sharesCount: sharesCount !== undefined ? sharesCount : state.currentPost.sharesCount 
            }
          : state.currentPost
      };
    
    case POST_ACTIONS.ADD_NEW_POST:
      const newPost = normalizePost(action.payload);
      return {
        ...state,
        posts: [newPost, ...state.posts],
        total: state.total + 1
      };
    
    case POST_ACTIONS.RESET_POSTS:
      return { ...initialState };
    
    case POST_ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };
    
    default:
      return state;
  }
}

// Create context
const PostContext = createContext();

// Custom hook
export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within PostProvider');
  }
  return context;
};

// Provider component
export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  //  Enhanced getPosts with better error handling
  const getPosts = useCallback(async (page = 1, limit = 20, filters = {}) => {
    try {
      dispatch({ type: POST_ACTIONS.SET_LOADING, payload: true });
      
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      };            
      const response = await postService.getPosts(params);            
      // Handle different response formats
      const data = response.data || response;
      
      if (page === 1) {
        dispatch({ type: POST_ACTIONS.SET_POSTS, payload: data });
      } else {
        dispatch({ type: POST_ACTIONS.ADD_POSTS, payload: data });
      }
      
      dispatch({ type: POST_ACTIONS.SET_PAGE, payload: page });
      
      return data;
    } catch (error) {
      console.error(' PostContext.getPosts error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Enhanced getPostDetails
  const getPostDetails = useCallback(async (postId) => {
    try {
      dispatch({ type: POST_ACTIONS.SET_LOADING, payload: true });
      
      
      const response = await postService.getPostDetails(postId);
      const data = response.data || response;
      const post = data.post || data;
      
      dispatch({ type: POST_ACTIONS.SET_CURRENT_POST, payload: post });
      
      return post;
    } catch (error) {
      console.error('❌ PostContext.getPostDetails error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  //  Enhanced createPost
  const createPost = useCallback(async (postData) => {
    try {
      dispatch({ type: POST_ACTIONS.SET_LOADING, payload: true });
      
      const response = await postService.createPost(postData);
      const data = response.data || response;
      const post = data.post || data;
      
      dispatch({ type: POST_ACTIONS.ADD_NEW_POST, payload: post });
      dispatch({ type: POST_ACTIONS.SET_LOADING, payload: false });
      
      return data;
    } catch (error) {
      console.error(' PostContext.createPost error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  //  Enhanced updatePost
  const updatePost = useCallback(async (postId, updates) => {
    try {
      const response = await postService.updatePost(postId, updates);
      const data = response.data || response;
      const post = data.post || data;
      
      dispatch({ type: POST_ACTIONS.UPDATE_POST, payload: post });
      
      return post;
    } catch (error) {
      console.error(' PostContext.updatePost error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  //  Enhanced deletePost
  const deletePost = useCallback(async (postId) => {
    try {
      await postService.deletePost(postId);
      dispatch({ type: POST_ACTIONS.REMOVE_POST, payload: postId });
      
      return true;
    } catch (error) {
      console.error(' PostContext.deletePost error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Simplified toggleLike - server handles all logic
  const toggleLike = useCallback(async (postId) => {
    try {

      //  Get current post state for optimistic update
      const currentPost = state.posts.find(post => post._id === postId) || state.currentPost;
      
      if (currentPost) {
        const currentLikeState = Boolean(currentPost.isLiked);
        const currentLikesCount = currentPost.likesCount || 0;
        
        // Calculate optimistic new state
        const newLikeState = !currentLikeState;
        const newLikesCount = newLikeState 
          ? currentLikesCount + 1 
          : Math.max(0, currentLikesCount - 1);


        //  Apply optimistic update immediately
        dispatch({
          type: POST_ACTIONS.UPDATE_POST_LIKE,
          payload: {
            postId,
            isLiked: newLikeState,
            likesCount: newLikesCount
          }
        });
      }

      //  Call API - server response is authoritative
      const response = await postService.toggleLikePost(postId);
      
      //  Update with server response (authoritative)
      if (response?.data && response.data.isLiked !== undefined) {
        const serverIsLiked = Boolean(response.data.isLiked);
        const serverLikesCount = response.data.likesCount || 0;

        dispatch({
          type: POST_ACTIONS.UPDATE_POST_LIKE,
          payload: {
            postId,
            isLiked: serverIsLiked,
            likesCount: serverLikesCount
          }
        });
      }
      
      return response;
    } catch (error) {
      console.error('PostContext.toggleLike error:', error);
      
      // Revert optimistic update on error
      const currentPost = state.posts.find(post => post._id === postId) || state.currentPost;
      if (currentPost) {
        
        dispatch({
          type: POST_ACTIONS.UPDATE_POST_LIKE,
          payload: {
            postId,
            isLiked: Boolean(currentPost.isLiked),
            likesCount: currentPost.likesCount || 0
          }
        });
      }
      
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [state.posts, state.currentPost]);

  // likePost uses toggleLike (consistent behavior)
  const likePost = useCallback(async (postId) => {
    return toggleLike(postId);
  }, [toggleLike]);

  // Enhanced bookmarkPost
  const bookmarkPost = useCallback(async (postId) => {
    try {      
      const response = await postService.bookmarkPost(postId);
      
      //  Update bookmark status in posts if server provides updated post
      const updatedPost = response?.data?.post;
      if (updatedPost) {
        dispatch({ 
          type: POST_ACTIONS.UPDATE_POST, 
          payload: updatedPost 
        });
      }
      
      return response;
    } catch (error) {
      console.error('PostContext.bookmarkPost error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  //  Enhanced loadMorePosts
  const loadMorePosts = useCallback(async (filters = {}) => {
    if (state.loading || !state.hasMore) {
      return;
    }
    
    try {
      const nextPage = state.page + 1;
      
      await getPosts(nextPage, 20, filters);
    } catch (error) {
      console.error('PostContext.loadMorePosts error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.loading, state.hasMore, state.page, getPosts]);

  // Enhanced refreshPosts
  const refreshPosts = useCallback(async (filters = {}) => {
    try {
      
      dispatch({ type: POST_ACTIONS.SET_LOADING, payload: true });
      await getPosts(1, 20, filters);
    } catch (error) {
      console.error('PostContext.refreshPosts error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [getPosts]);

  // Enhanced getPopularPosts
  const getPopularPosts = useCallback(async (limit = 10) => {
    try {
      dispatch({ type: POST_ACTIONS.SET_LOADING, payload: true });
            
      const response = await postService.getPopularPosts({ limit: limit.toString() });
      const data = response.data || response;
      
      dispatch({ type: POST_ACTIONS.SET_POSTS, payload: data });
      
      return data;
    } catch (error) {
      console.error('PostContext.getPopularPosts error:', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Enhanced searchPosts
  const searchPosts = useCallback(async (query, filters = {}) => {
    try {
      dispatch({ type: POST_ACTIONS.SET_LOADING, payload: true });      
      const params = {
        search: query,
        ...filters
      };
      
      const response = await postService.getPosts(params);
      const data = response.data || response;
      
      dispatch({ type: POST_ACTIONS.SET_POSTS, payload: data });
      
      return data;
    } catch (error) {
      console.error('PostContext.searchPosts error: ', error);
      dispatch({ type: POST_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  //  Utility functions
  const clearError = useCallback(() => {
    dispatch({ type: POST_ACTIONS.SET_ERROR, payload: null });
  }, []);

  const resetPosts = useCallback(() => {
    dispatch({ type: POST_ACTIONS.RESET_POSTS });
  }, []);

  const updatePostLike = useCallback((postId, isLiked, likesCount) => {
    dispatch({
      type: POST_ACTIONS.UPDATE_POST_LIKE,
      payload: { postId, isLiked: Boolean(isLiked), likesCount: likesCount || 0 }
    });
  }, []);

  //  Socket effects for real-time updates
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token)return;

    try {      
      // Connect socket
      const socket = connectSocket(token);

      // Listen for new posts (admin created)
      onPostCreated((payload) => {
        dispatch({ type: POST_ACTIONS.ADD_NEW_POST, payload });
      });

      // Listen for count updates (likes, shares, comments)
      onPostCounts((payload) => {
        dispatch({ type: POST_ACTIONS.UPDATE_POST_COUNTS, payload });
      });

      return () => {
      };
    } catch (error) {
      console.error(' Socket connection error:', error);
    }
  }, []);

  //  Memoized context value
  const value = React.useMemo(() => ({
    // State
    posts: state.posts,
    currentPost: state.currentPost,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    page: state.page,
    total: state.total,
    
    // Actions
    getPosts,
    getPostDetails,
    createPost,
    updatePost,
    deletePost,
    likePost,
    toggleLike,
    bookmarkPost,
    loadMorePosts,
    refreshPosts,
    getPopularPosts,
    searchPosts,
    clearError,
    resetPosts,
    updatePostLike,
    
    // Dispatch for advanced usage
    dispatch
  }), [
    state,
    getPosts,
    getPostDetails,
    createPost,
    updatePost,
    deletePost,
    likePost,
    toggleLike,
    bookmarkPost,
    loadMorePosts,
    refreshPosts,
    getPopularPosts,
    searchPosts,
    clearError,
    resetPosts,
    updatePostLike
  ]);

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;