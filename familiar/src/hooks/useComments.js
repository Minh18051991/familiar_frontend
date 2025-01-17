import { useState, useEffect } from 'react';
import CommentService from '../service/post/CommentService';

const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await CommentService.getCommentsByPostId(postId);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async (content, parentCommentId = null) => {
    try {
      const parentComment = parentCommentId ? findCommentById(comments, parentCommentId) : null;
      const level = parentComment ? parentComment.level + 1 : 0;

      const commentDTO = {
        postId,
        userId: currentUserId,
        content,
        parentCommentId,
        level
      };
      await CommentService.addComment(commentDTO);
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const editComment = async (commentId, content) => {
    try {
      await CommentService.updateComment(commentId, { content });
      fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await CommentService.deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const findCommentById = (comments, id) => {
    for (let comment of comments) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = findCommentById(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  };

  return {
    comments,
    addComment,
    editComment,
    deleteComment,
    currentUserId
  };
};

export default useComments;