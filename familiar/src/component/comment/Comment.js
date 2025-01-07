import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, TextField, Paper} from '@mui/material';
import moment from 'moment';

const Comment = ({ comment, onReply, onEdit, onDelete, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');

  const handleEdit = () => {
    onEdit(comment.id, editedContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment.id, replyContent);
    setIsReplying(false);
    setReplyContent('');
  };

  return (
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Avatar src={comment.userProfilePictureUrl} alt={`${comment.userFirstName} ${comment.userLastName}`} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Paper elevation={0} sx={{
            p: 2,
            bgcolor: '#61dff1',
            borderRadius: '14px',
            maxWidth: 'fit-content',
          }}>
            <Typography variant="subtitle2">{`${comment.userFirstName} ${comment.userLastName}`}</Typography>
            {isEditing ? (
                <Box>
                  <TextField
                      fullWidth
                      multiline
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      sx={{ mb: 1 }}
                  />
                  <Button onClick={handleEdit} variant="contained" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={() => setIsEditing(false)} variant="outlined" size="small">Cancel</Button>
                </Box>
            ) : (
                <Typography>{comment.content}</Typography>
            )}
          </Paper>

          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {moment(comment.createdAt).format('MMMM D, YYYY [at] h:mm A')}
          </Typography>

          <Box sx={{ mt: 1 }}>
            {currentUserId === comment.userId && !isEditing && (
                <>
                  <Button onClick={() => setIsEditing(true)} size="small" sx={{ mr: 1 }}>Edit</Button>
                  <Button onClick={() => onDelete(comment.id)} size="small" sx={{ mr: 1 }}>Delete</Button>
                </>
            )}
            <Button onClick={() => setIsReplying(!isReplying)} size="small">Phản hồi</Button>
          </Box>

          {isReplying && (
              <Box mt={2}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="viết bình luân.."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    sx={{ mb: 1 }}
                />
                <Button onClick={handleReply} variant="contained" size="small" sx={{ mr: 1 }}>Phản hồi</Button>
                <Button onClick={() => setIsReplying(false)} variant="outlined" size="small">Hủy</Button>
              </Box>
          )}
        </Box>
      </Box>
  );
};

export default Comment;