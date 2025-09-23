// postService.js
import api from '../utils/api';
import { POST_ENDPOINTS, UPLOAD_ENDPOINTS } from '../config/endpoints';
// Get posts with filters/pagination
export const getPosts = async (params) => {
  const response = await api.get(POST_ENDPOINTS.GET_ALL, { params });
  return response.data;
};

// Get popular posts
export const getPopularPosts = async (params) => {
  const response = await api.get(POST_ENDPOINTS.GET_POPULAR, { params });
  return response.data;
};

// Get recent posts
export const getRecentPosts = async (params) => {
  const response = await api.get(POST_ENDPOINTS.GET_RECENT, { params });
  return response.data;
};

// Get single post details
export const getPostDetails = async (postId) => {
  const response = await api.get(POST_ENDPOINTS.GET_DETAILS(postId));
  return response.data;
};
export const toggleLikePost = async (postId) => {
  
  try {
    const response = await api.post(POST_ENDPOINTS.TOGGLE_LIKE(postId));
    return response.data;
  } catch (error) {
    console.error('❌ postService API error:', error);
    throw error;
  }
};

// Create new post
export const createPost = async (postData) => {
  const response = await api.post(POST_ENDPOINTS.CREATE, postData);
  return response.data;
};

// Update existing post
export const updatePost = async (postId, postData) => {
  const response = await api.put(POST_ENDPOINTS.UPDATE(postId), postData);
  return response.data;
};

// Delete post
export const deletePost = async (postId) => {
  const response = await api.delete(POST_ENDPOINTS.DELETE(postId));
  return response.data;
};

// Like post
export const likePost = async (postId) => {
  const response = await api.post(POST_ENDPOINTS.LIKE(postId));
  return response.data;
};

// Unlike post
export const unlikePost = async (postId) => {
  const response = await api.post(POST_ENDPOINTS.UNLIKE(postId));
  return response.data;
};

// Share post
export const sharePost = async (postId) => {
  const response = await api.post(POST_ENDPOINTS.SHARE(postId));
  return response.data;
};

// Increment view count
export const incrementViews = async (postId) => {
  const response = await api.post(POST_ENDPOINTS.VIEW(postId));
  return response.data;
};

// Bookmark post
export const bookmarkPost = async (postId) => {
  const response = await api.post(POST_ENDPOINTS.BOOKMARK(postId));
  return response.data;
};

// Unbookmark post
export const unbookmarkPost = async (postId) => {
  const response = await api.post(POST_ENDPOINTS.UNBOOKMARK(postId));
  return response.data;
};

// Upload multiple images for post
export const uploadPostImages = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append('images', file);
  });

  const response = await api.post(UPLOAD_ENDPOINTS.POST_IMAGES_MULTIPLE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Upload single image for post content
export const uploadPostImageSingle = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post(UPLOAD_ENDPOINTS.POST_IMAGE_SINGLE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Get post images
export const getPostImages = async (postId) => {
  const response = await api.get(UPLOAD_ENDPOINTS.POST_IMAGES_GET(postId));
  return response.data;
};

// Search posts
export const searchPosts = async (query, params = {}) => {
  const response = await api.get(POST_ENDPOINTS.GET_ALL, { 
    params: { search: query, ...params } 
  });
  return response.data;
};

// Get posts by hashtag
export const getPostsByHashtag = async (hashtag, params = {}) => {
  const response = await api.get(POST_ENDPOINTS.GET_ALL, { 
    params: { hashtag, ...params } 
  });
  return response.data;
};

// Get posts by author
export const getPostsByAuthor = async (authorId, params = {}) => {
  const response = await api.get(POST_ENDPOINTS.GET_ALL, { 
    params: { author: authorId, ...params } 
  });
  return response.data;
};