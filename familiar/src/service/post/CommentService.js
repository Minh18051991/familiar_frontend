import axios from 'axios';

import {API_URL} from "../url/API_URL";

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? {Authorization: `Bearer ${token}`} : {};
};

const CommentService = {
    getCommentsByPostId: async (postId) => {
        try {
            const response = await axios.get(`${API_URL}/api/comments/post/${postId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },
    getCommentCountByPostId: async (postId) => {
        try {
            const comments = await CommentService.getCommentsByPostId(postId);
            console.log('Comments received:', comments); // Log để kiểm tra dữ liệu

            const countComments = (commentsArray) => {
                if (!Array.isArray(commentsArray)) {
                    console.warn('Expected an array, but received:', commentsArray);
                    return 0;
                }
                return commentsArray.reduce((count, comment) => {
                    let currentCount = 1;
                    if (comment.replies && Array.isArray(comment.replies)) {
                        currentCount += countComments(comment.replies);
                    }
                    return count + currentCount;
                }, 0);
            };

            const count = countComments(comments);
            console.log(`Total comment count for post ${postId}:`, count);
            return count;
        } catch (error) {
            console.error('Error counting comments:', error);
            return 0; // Trả về 0 thay vì throw error
        }
    },


    addComment: async (commentDTO) => {
        try {
            const response = await axios.post(`${API_URL}/api/comments`, commentDTO, {
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
            const response = await axios.put(`${API_URL}/api/comments/${commentId}`, commentDTO, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    },


    deleteComment: async (commentId) => {
        console.log(`Attempting to delete comment with ID: ${commentId}`);
        try {
            const response = await axios.delete(`${API_URL}/api/comments/${commentId}`, {
                headers: getAuthHeader()
            });
            console.log(`Delete response for comment ${commentId}:`, response);

            // Nếu server trả về 404 nhưng thực tế đã xóa thành công
            if (response.status === 404) {
                console.log('Server returned 404, but comment might have been deleted successfully');
                return {success: true, message: 'Comment might have been deleted successfully'};
            }

            return response.data;
        } catch (error) {
            console.error(`Error deleting comment ${commentId}:`, error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);

                // Nếu server trả về 404, coi như xóa thành công
                if (error.response.status === 404) {
                    console.log('Treating 404 as successful deletion');
                    return {success: true, message: 'Comment might have been deleted successfully'};
                }
            }
            throw error;
        }
    },

};

export default CommentService;