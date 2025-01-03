import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, TextField, Paper, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { createComment } from '../../services/commentService';
import { getLikes, createLike, deleteLike } from '../../services/likeService';

const CommentItem = ({ comment, postId, onCommentAdded }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [likes, setLikes] = useState([]);
  const [userLike, setUserLike] = useState(null);

  useEffect(() => {
    fetchLikes();
  }, [comment.id]);

  const fetchLikes = async () => {
    try {
      const fetchedLikes = await getLikes(null, comment.id);
      setLikes(fetchedLikes);
      const userLike = fetchedLikes.find(like => like.userId === 1); // Replace 1 with actual user ID
      setUserLike(userLike);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleLike = async () => {
    try {
      const userId = 1; // Replace with actual user ID when authentication is implemented
      if (userLike) {
        await deleteLike(userLike.id);
        setUserLike(null);
        setLikes(likes.filter(like => like.id !== userLike.id));
      } else {
        const newLike = await createLike(userId, null, comment.id);
        setUserLike(newLike);
        setLikes([...likes, newLike]);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      try {
        const userId = 1; // Replace with actual user ID when authentication is implemented
        await createComment(postId, replyContent, userId, comment.id);
        setReplyContent('');
        setShowReplyForm(false);
        onCommentAdded(); // Refresh comments after adding a reply
      } catch (error) {
        console.error('Error creating reply:', error);
      }
    }
  };

  return (
    <Box sx={{ mb: 2, ml: comment.parent_comment_id ? 4 : 0 }}>
      <Paper elevation={2} sx={{ p: 2, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Avatar
            src={comment.user.profile_picture_url}
            alt={comment.user.first_name}
            sx={{ mr: 2, width: 32, height: 32 }}
          />
          <Box>
            <Typography variant="subtitle2">
              {comment.user.first_name} {comment.user.last_name}
            </Typography>
            <Typography variant="body2">{comment.content}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <IconButton onClick={handleLike} color={userLike ? 'error' : 'default'} size="small">
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" sx={{ mr: 2 }}>{likes.length} likes</Typography>
              <Button size="small" onClick={() => setShowReplyForm(!showReplyForm)}>
                Reply
              </Button>
            </Box>
          </Box>
        </Box>
        {showReplyForm && (
          <Box component="form" onSubmit={handleReply} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button type="submit" variant="contained" size="small">
              Post Reply
            </Button>
          </Box>
        )}
      </Paper>
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </Box>
  );
};

export default CommentItem;