import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Giả lập người dùng cố định
const MOCK_USER_ID = 1;

export const getComments = async (postId) => {
  try {
    const commentsResponse = await axios.get(`${API_URL}/comments/post/${postId}`);
    const comments = commentsResponse.data;

    // Lấy thông tin người dùng
    const userIds = [...new Set(comments.map(comment => comment.userId))];
    const usersResponse = await axios.get(`${API_URL}/users?${userIds.map(id => `id=${id}`).join('&')}`);
    const users = usersResponse.data;

    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const commentMap = comments.reduce((acc, comment) => {
      comment.user = userMap[comment.userId];
      comment.replies = [];
      acc[comment.id] = comment;
      return acc;
    }, {});

    comments.forEach(comment => {
      if (comment.parentCommentId) {
        const parentComment = commentMap[comment.parentCommentId];
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      }
    });

    return Object.values(commentMap).filter(comment => !comment.parentCommentId);
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (postId, content, userId = MOCK_USER_ID, parentCommentId = null) => {
  try {
    const commentDTO = {
      postId,
      content,
      userId: MOCK_USER_ID,
      parentCommentId
    };

    const response = await axios.post(`${API_URL}/comments`, commentDTO);
    const newComment = response.data;

    // Lấy thông tin người dùng
    const userResponse = await axios.get(`${API_URL}/users/${MOCK_USER_ID}`);
    const user = userResponse.data;
    
    return { 
      ...newComment, 
      user,
      replies: []
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await axios.put(`${API_URL}/comments/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${API_URL}/comments/${commentId}`);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const getRepliesForComment = async (commentId) => {
  try {
    const response = await axios.get(`${API_URL}/comments/${commentId}/replies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching replies for comment:', error);
    throw error;
  }
};

// Nếu bạn vẫn cần chức năng like comment, bạn có thể giữ lại hàm này
// và điều chỉnh endpoint nếu cần
export const likeComment = async (commentId, userId = MOCK_USER_ID, iconId) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${commentId}/like`, {
      userId: MOCK_USER_ID,
      iconId
    });
    return response.data;
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};