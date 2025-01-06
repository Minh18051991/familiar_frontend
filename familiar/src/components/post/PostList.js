import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import PostService from '../../services/PostService';
import CreatePost from './CreatePost';
import styles from './PostList.module.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [page, size]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await PostService.getAllPosts(page, size);
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading && page === 0) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className={styles.postList}>
      <Typography variant="h4" component="h2" gutterBottom>
        Posts
      </Typography>
      <CreatePost onPostCreated={handleNewPost} />
      {posts.map((post) => (
        <Card key={post.id} className={styles.postCard}>
          <CardHeader
            avatar={
              <Avatar
                src={post.profilePictureUrl}
                alt={`${post.userFirstName} ${post.userLastName}`}
              >
                {post.userFirstName ? post.userLastName.charAt(0) : 'U'}
              </Avatar>
            }
            title={`${post.userFirstName} ${post.userLastName}`}
            subheader={new Date(post.createdAt).toLocaleString()}
          />
          {post.attachmentUrls && post.attachmentUrls.length > 0 && (
            <CardMedia
              component="img"
              height="194"
              image={post.attachmentUrls[0]}
              alt="Post attachment"
            />
          )}
          <CardContent>
            <Typography variant="body1" color="text.primary">
              {post.content}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={handlePageChange}
        color="primary"
        className={styles.pagination}
      />
    </div>
  );
};

export default PostList;