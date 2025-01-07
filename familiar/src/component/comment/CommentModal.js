import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import CommentList from './CommentList';
import CommentService from '../../services/CommentService';
import moment from 'moment';

const CommentModal = ({ open, handleClose, post, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (open && post) {
      fetchComments();
    }
  }, [open, post]);

  const fetchComments = async () => {
    try {
      const response = await CommentService.getCommentsByPostId(post.id);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const commentDTO = {
        postId: post.id,
        userId: currentUserId,
        content: newComment,
        parentCommentId: null
      };
      await CommentService.createComment(post.id, newComment, currentUserId);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Bài viết và Bình luận</DialogTitle>
      <DialogContent>
        {/* Post content */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={post.userProfilePictureUrl} alt={`${post.userFirstName} ${post.userLastName}`} />
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle1">
                {`${post.userFirstName} ${post.userLastName}`}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {moment(post.createdAt).format('MMMM D, YYYY [at] h:mm A')}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">{post.content}</Typography>
          {post.attachmentUrls && post.attachmentUrls.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {post.attachmentUrls.map((url, index) => (
                <img 
                  key={index} 
                  src={url} 
                  alt={`Attachment ${index + 1}`} 
                  style={{ maxWidth: '100%', maxHeight: '200px', marginRight: '10px' }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Comments section */}
        <Typography variant="h6" sx={{ mb: 2 }}>Bình luận</Typography>
        <CommentList
          comments={comments}
          postId={post.id}
          currentUserId={currentUserId}
          onCommentAdded={fetchComments}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;