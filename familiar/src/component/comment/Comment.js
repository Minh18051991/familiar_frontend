import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, TextField, Paper, IconButton } from '@mui/material';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';

const Comment = ({ comment, onReply, onEdit, onDelete, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEdit = () => {
    onEdit(comment.id, editedContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment.id, replyContent);
    setIsReplying(false);
    setReplyContent('');
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    if (isEditing) {
      setEditedContent(prevContent => prevContent + emoji);
    } else if (isReplying) {
      setReplyContent(prevContent => prevContent + emoji);
    }
    setShowEmojiPicker(false);
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
                rows={1}
                multiline
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                sx={{ mb: 1 }}
              />
              <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <InsertEmoticonIcon />
              </IconButton>
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
        <Button onClick={() => setIsReplying(!isReplying)} size="small" sx={{ ml: 1, minWidth: 'auto', p: '2px 5px', fontSize: '0.7rem' }}>Phản hồi</Button>
        <Box sx={{ mt: 1 }}>
          {currentUserId === comment.userId && !isEditing && (
            <>
              <Button onClick={() => setIsEditing(true)} size="small" sx={{ mr: 1 }}>Edit</Button>
              <Button onClick={() => onDelete(comment.id)} size="small" sx={{ mr: 1 }}>Delete</Button>
            </>
          )}

        </Box>

        {isReplying && (
          <Box mt={2}>
            <TextField
              size="small"
              multiline
              rows={0.5}
              placeholder="viết bình luân.."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <InsertEmoticonIcon />
            </IconButton>
          <IconButton
          onClick={handleReply}
        color="primary"
        size="small"
        sx={{ mr: 1 }}
      >
        <SendIcon />
      </IconButton>
      <IconButton
          onClick={() => setIsReplying(false)}
          color="error"
          size="small"
      >
        <CancelIcon />
      </IconButton>
          </Box>
        )}

        {showEmojiPicker && (
          <Box mt={2}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;