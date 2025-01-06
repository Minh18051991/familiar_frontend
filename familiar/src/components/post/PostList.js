import React, { useState, useEffect, useCallback } from 'react';
import PostService from "../../services/PostService";
import CreatePost from './CreatePost';
import EditPost from './EditPost';
import {
  Box, Card, CardContent, Typography, Avatar,
  CircularProgress, Alert, Button, Modal, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styles from './PostList.module.css';
import moment from 'moment';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [openImage, setOpenImage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const currentUserId = localStorage.getItem('userId');

  const fetchPosts = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await PostService.getAllPosts(page, token);
      if (response.data && Array.isArray(response.data.content)) {
        const newPosts = response.data.content.filter(
          newPost => !posts.some(existingPost => existingPost.id === newPost.id)
        );
        if (newPosts.length > 0) {
          setPosts(prevPosts => {
            const updatedPosts = [...prevPosts, ...newPosts];
            return updatedPosts.filter((post, index, self) =>
                index === self.findIndex((t) => t.id === post.id)
            );
          });
          setPage(prevPage => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected data format received from server.');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, posts, isLoading]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleImageClick = (url) => {
    setOpenImage(url);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
  };

  const handleEditClose = () => {
    setEditingPost(null);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    ));
    setEditingPost(null);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
      <CreatePost onPostCreated={handlePostCreated} />

      {posts.map((post, index) => (
        <Card key={`${post.id}-${index}`} className={styles.postCard}>
          <CardContent className={styles.postContent}>
            <Box className={styles.userInfo}>
              <Avatar
                src={post.userProfilePictureUrl}
                alt={`${post.userFirstName} ${post.userLastName}`}
              />
              <Box>
                <Typography variant="subtitle1" className={styles.userName}>
                  {`${post.userFirstName} ${post.userLastName}`}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {moment(post.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                </Typography>
              </Box>
              {currentUserId && currentUserId === post.userId.toString() && (
                <IconButton
                  onClick={() => handleEditClick(post)}
                  size="small"
                  sx={{ marginLeft: 'auto' }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
            <Typography variant="body1" className={styles.postText}>
              {post.content}
            </Typography>
            {post.attachmentUrls && post.attachmentUrls.length > 0 && (
              <Box className={styles.attachmentGrid}>
                {post.attachmentUrls.map((url, attachmentIndex) => (
                  <img
                    key={`${post.id}-attachment-${attachmentIndex}`}
                    src={url}
                    alt={`Attachment ${attachmentIndex + 1}`}
                    className={styles.attachmentImage}
                    onClick={() => handleImageClick(url)}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!isLoading && !error && hasMore && (
        <Button
          onClick={fetchPosts}
          variant="contained"
          color="primary"
          fullWidth
          className={styles.loadMoreButton}
        >
          Load More
        </Button>
      )}

      {isLoading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2 }} />}

      <Modal
        open={!!openImage}
        onClose={handleCloseImage}
        aria-labelledby="image-modal"
        aria-describedby="full-size-image"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90%',
          maxHeight: '90%',
        }}>
          <img src={openImage} alt="Full size" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
      </Modal>

      {editingPost && (
        <EditPost
          post={editingPost}
          open={!!editingPost}
          handleClose={handleEditClose}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </Box>
  );
};

export default PostList;