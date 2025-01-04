import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, Typography } from '@mui/material';
import { createPost } from '../../services/postService';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const newPost = await createPost(content, files);
      onPostCreated(newPost);
      setContent('');
      setFiles([]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="What's on your mind?"
          value={content}
          onChange={handleContentChange}
          sx={{ marginBottom: 2 }}
        />
        <input
          accept="image/*,video/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" sx={{ marginRight: 2 }}>
            Upload Files
          </Button>
        </label>
        <Button variant="contained" onClick={handleSubmit}>
          Post
        </Button>

        {files.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2">Selected files:</Typography>
            {files.map((file, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                <Typography variant="body2">{file.name}</Typography>
                <Button 
                  size="small" 
                  onClick={() => handleRemoveFile(index)}
                  sx={{ marginLeft: 1 }}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;