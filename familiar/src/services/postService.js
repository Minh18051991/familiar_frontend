import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getPosts = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/posts?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const createPost = async (postDTO) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, postDTO);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post by id:', error);
    throw error;
  }
};

export const updatePost = async (postId, postDTO) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${postId}`, postDTO);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_URL}/posts/${postId}`);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/posts/user/${userId}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts by user id:', error);
    return [];
  }
};

export const getRecentPosts = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/posts/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
};

export const getPostCountForUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/count/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post count for user:', error);
    return 0;
  }
};