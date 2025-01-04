import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Button, Avatar, Typography, Box } from '@mui/material';
import { getPosts, likePost } from '../../service/post/postService';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts(page);
      if (response.content && response.content.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...response.content]);
        setHasMore(!response.last);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      // Update the post in the state to reflect the new like
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar src={post.user?.profilePictureUrl} alt={post.user?.username} />
                  <Box ml={2}>
                    <Typography variant="subtitle1">{post.user?.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>
                {post.attachmentUrls && post.attachmentUrls.length > 0 && (
                  <Box mt={2}>
                    {post.attachmentUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Attachment ${index + 1}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                    ))}
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button startIcon={<ThumbUpIcon />} onClick={() => handleLike(post.id)}>
                  Like ({post.likes})
                </Button>
                <Button startIcon={<CommentIcon />}>
                  Comment ({post.comments?.length || 0})
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {hasMore && (
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostList;