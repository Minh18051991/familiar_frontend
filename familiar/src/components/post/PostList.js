import React, { useState, useEffect } from 'react';
import { getPosts } from '../../services/postService';
import { Box, Card, CardContent, Typography, Avatar, CardMedia } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreatePost from './CreatePost';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await getPosts(page);
      if (response.content.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...response.content]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <CreatePost onPostCreated={handlePostCreated} />

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {posts.map(post => (
          <Card key={post.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Avatar src={post.userProfilePictureUrl} sx={{ marginRight: 2 }} />
                <Typography variant="subtitle1">
                  {`${post.userFirstName} ${post.userLastName}`}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {post.content}
              </Typography>
              {post.attachmentUrls && post.attachmentUrls.length > 0 && (
                <CardMedia
                  component="img"
                  height="194"
                  image={post.attachmentUrls[0]}
                  alt="Post attachment"
                />
              )}
              <Typography variant="caption" color="text.secondary">
                Posted on: {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </InfiniteScroll>
    </Box>
  );
};

export default PostList;