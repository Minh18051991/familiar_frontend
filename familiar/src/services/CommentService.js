import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const CommentService = {
  getCommentsByPostId: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/post/${postId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  addComment: async (commentDTO) => {
    try {
      const response = await axios.post(API_URL, commentDTO, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  updateComment: async (commentId, commentDTO) => {
    try {
      const response = await axios.put(`${API_URL}/${commentId}`, commentDTO, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      await axios.delete(`${API_URL}/${commentId}`, {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default CommentService;