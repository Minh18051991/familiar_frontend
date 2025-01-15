import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? {Authorization: `Bearer ${token}`} : {};
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
    console.log(`Attempting to delete comment with ID: ${commentId}`);
    try {
        const response = await axios.delete(`${API_URL}/${commentId}`, {
            headers: getAuthHeader()
        });
        console.log(`Delete response for comment ${commentId}:`, response);
        
        // Nếu server trả về 404 nhưng thực tế đã xóa thành công
        if (response.status === 404) {
            console.log('Server returned 404, but comment might have been deleted successfully');
            return { success: true, message: 'Comment might have been deleted successfully' };
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
                return { success: true, message: 'Comment might have been deleted successfully' };
            }
        }
        throw error;
    }
},

};

export default CommentService;