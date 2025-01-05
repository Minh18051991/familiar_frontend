import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getPosts = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/posts?page=${page}&size=${size}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (postData, files) => {
  try {
    const formData = new FormData();
    formData.append('post', JSON.stringify(postData));
    if (files && files.length > 0) {
      files.forEach(file => formData.append('files', file));
    }

    const response = await axios.post(`${API_URL}/posts`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${id}`, postData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    await axios.delete(`${API_URL}/posts/${id}`, {
      headers: getAuthHeader()
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/posts/user/${userId}?page=${page}&size=${size}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};