import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const CommentForm = ({ onSubmit, initialContent = '', buttonText = 'Add Comment' }) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Viết bình luận "
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit}>{buttonText}</Button>
    </Box>
  );
};

export default CommentForm;