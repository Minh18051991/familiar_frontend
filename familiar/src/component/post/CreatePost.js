import React, { useState } from 'react';
import PostService from '../../services/PostService';
import { Card, CardContent, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ThumbnailContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '10px',
});

const Thumbnail = styled(Box)({
  position: 'relative',
  width: '100px',
  height: '100px',
});

const ThumbnailImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '4px',
});

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const postData = {
            content: content,
            userId: parseInt(localStorage.getItem('userId')),
        };
        console.log('Post data:', postData);
        try {
            const createdPost = await PostService.createPost(postData, files);
            onPostCreated(createdPost);
            setContent('');
            setFiles([]);
            console.log('Post created successfully:', createdPost);
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Tạo bài viết
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Bạn muốn đăng gì.."
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload files
                            <VisuallyHiddenInput
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </Button>
                        <Typography variant="body2">
                            {files.length > 0 ? `${files.length} file(s) selected` : 'No files selected'}
                        </Typography>
                    </Box>
                    <ThumbnailContainer>
                        {files.map((file, index) => (
                            <Thumbnail key={index}>
                                <ThumbnailImage src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                                <IconButton
                                    size="small"
                                    sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Thumbnail>
                        ))}
                    </ThumbnailContainer>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? 'Posting...' : 'Post'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreatePost;