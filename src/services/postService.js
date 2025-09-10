// postService.js
import api from '../utils/api';

export const getPosts = async (params) => {
  const response = await api.get('/posts', { params });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

export const bookmarkPost = async (postId) => {
  const response = await api.post(`/posts/${postId}/bookmark`);
  return response.data;
};

// homeService.js
export const getTrendingTags = async () => {
  const response = await api.get('/home/trending-tags');
  return response.data;
};

export const getTopUsers = async () => {
  const response = await api.get('/home/top-users');
  return response.data;
};

export const getUpcomingContests = async () => {
  const response = await api.get('/contests/upcoming');
  return response.data;
};