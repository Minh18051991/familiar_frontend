import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button, IconButton
} from '@mui/material';
import PostService from "../../service/post/PostService";
import EmojiPicker from 'emoji-picker-react';
import InsertEmotionIcon from '@mui/icons-material/InsertEmoticon';

const EditPost = ({ post, open, onClose, onUpdate,handleChange }) => {
  const [editedContent, setEditedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (post) {
      setEditedContent(post.content);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting( prev => !prev);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const updatedPost = await PostService.updatePost(post.id, { content: editedContent }, token);
      onUpdate(updatedPost);
      onClose();
      handleChange()
    } catch (err) {
      console.error('Error updating post:', err);
      onUpdate(post);
      onClose();
    }
  };
const handleEmojiClick = (emojiObject) => {
  setEditedContent(prev => prev + emojiObject.emoji);
  setShowEmojiPicker(false);
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cập nhập bài viết </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="content"
            label="Post Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <InsertEmotionIcon />
          </IconButton>
          {showEmojiPicker && (
              <EmojiPicker onEmojiClick={handleEmojiClick}
                           sx={{ position:'absolute', width: '100px' , height: '100px',left: 0, right: 0, bottom: '100%', transform: 'translateY(-50%)' }}/>

          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang cập nhật...' :  'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPost;