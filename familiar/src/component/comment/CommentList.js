import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import Comment from './Comment';
import CommentService from '../../services/CommentService';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
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

  const handleAddComment = async () => {
    try {
      const commentDTO = {
        postId,
        userId: currentUserId,
        content: newComment,
        parentCommentId: null,
        level: 0
      };
      await CommentService.addComment(commentDTO);
      fetchComments();
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      const parentComment = findCommentById(comments, parentCommentId);
      const level = parentComment ? parentComment.level + 1 : 1;

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
      console.error('Error adding reply:', error);
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      await CommentService.updateComment(commentId, { content });
      fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
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

  const renderComments = (comments) => {
    return comments.map(comment => (
      <Box key={comment.id} ml={comment.level * 4}>
        <Comment
          comment={comment}
          onReply={handleReply}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentUserId={currentUserId}
        />
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies)}
      </Box>
    ));
  };

  return (
    <Box>
        {renderComments(comments)}
      <Box>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment} variant="contained" color="primary"  sx={{ mt: 2 }}>Bình Luận</Button>
      </Box>
    </Box>
  );
};

export default CommentList;