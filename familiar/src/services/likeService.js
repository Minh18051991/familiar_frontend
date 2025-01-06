import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Replace with your API URL

export const getLikes = async (postId, commentId) => {
  try {
    const response = await axios.get(`${API_URL}/likes`, {
      params: { postId, commentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
};

export const createLike = async (userId, postId, commentId) => {
  try {
    const response = await axios.post(`${API_URL}/likes`, {
      userId,
      postId,
      commentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating like:', error);
    throw error;
  }
};

export const deleteLike = async (likeId) => {
  try {
    await axios.delete(`${API_URL}/likes/${likeId}`);
  } catch (error) {
    console.error('Error deleting like:', error);
    throw error;
  }
};