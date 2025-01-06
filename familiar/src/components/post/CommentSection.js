import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import CommentItem from './CommentItem';
import { getComments, createComment } from '../../services/commentService';
import { getLikes } from '../../services/likeService';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState({});

  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const fetchedLikes = await getLikes(postId);
      const likesMap = {};
      fetchedLikes.forEach(like => {
        if (like.commentId) {
          if (!likesMap[like.commentId]) {
            likesMap[like.commentId] = [];
          }
          likesMap[like.commentId].push(like);
        }
      });
      setLikes(likesMap);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const userId = 1; // Replace with actual user ID when authentication is implemented
        await createComment(postId, newComment, userId);
        setNewComment('');
        fetchComments(); // Refresh comments after adding a new one
        fetchLikes(); // Refresh likes after adding a new comment
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    }
  };

  const handleCommentLiked = () => {
    fetchLikes(); // Refresh likes when a comment is liked or unliked
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 2 }}>
        {comments.map((comment) => (
          <Paper 
            key={comment.id} 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 2, 
              borderRadius: '16px', 
              backgroundColor: '#f5f5f5'
            }}
          >
            <CommentItem
              comment={comment}
              postId={postId}
              onCommentAdded={fetchComments}
              onCommentLiked={handleCommentLiked}
              likes={likes[comment.id] || []}
            />
          </Paper>
        ))}
      </Box>
      <Paper 
        component="form" 
        onSubmit={handleCommentSubmit} 
        sx={{ 
          p: 2, 
          mt: 2, 
          borderRadius: '16px', 
          backgroundColor: '#f0f0f0'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button type="submit" variant="contained">
          Post Comment
        </Button>
      </Paper>
    </Box>
  );
};

export default CommentSection;