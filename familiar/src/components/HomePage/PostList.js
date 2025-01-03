import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Button, Avatar, Typography, Box, Modal, IconButton } from '@mui/material';
import { getPosts, likePost } from '../../services/postService';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import CommentSection from './CommentSection';
import CreatePost from './CreatePost';
import styles from './PostList.module.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const userId = 1; // Assuming current user id is 1
      const iconId = 1; // Assuming default like icon id is 1
      const updatedLikesCount = await likePost(postId, userId, iconId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: updatedLikesCount, user_has_liked: !post.user_has_liked } 
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleOpenComments = (post) => {
    setSelectedPost(post);
  };

  const handleCloseComments = () => {
    setSelectedPost(null);
  };

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <Grid container spacing={4} className={styles.postList}>
      <Grid item xs={12}>
        <CreatePost onNewPost={handleNewPost} />
      </Grid>
      {posts.map((post) => (
        <Grid item xs={12} key={post.id}>
          <Card className={styles.postCard}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={post.user && post.user.profile_picture_url ? post.user.profile_picture_url : '/default-avatar.png'}
                />
                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                  {post.user ? `${post.user.first_name} ${post.user.last_name}` : 'Unknown User'}
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {post.content}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                startIcon={<ThumbUpIcon />} 
                onClick={() => handleLike(post.id)}
                color={post.user_has_liked ? "primary" : "default"}
              >
                Like ({post.likes_count || 0})
              </Button>
              <Button size="small" startIcon={<CommentIcon />} onClick={() => handleOpenComments(post)}>
                Comment
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Modal
        open={selectedPost !== null}
        onClose={handleCloseComments}
        aria-labelledby="comment-modal-title"
        aria-describedby="comment-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseComments}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="comment-modal-title" variant="h6" component="h2">
            Comments
          </Typography>
          {selectedPost && <CommentSection postId={selectedPost.id} />}
        </Box>
      </Modal>
    </Grid>
  );
};

export default PostList;