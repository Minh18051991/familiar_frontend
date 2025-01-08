import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography, Button, Modal } from '@mui/material';
import PostService from '../../services/PostService';
import Post from '../post/Post';
import CommentModal from '../comment/CommentModal';

const UserPosts = ({ userId }) => {
  const [postsMap, setPostsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [openImage, setOpenImage] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const lastPostId = Object.values(postsMap).length > 0 
        ? Math.min(...Object.values(postsMap).map(post => post.id))
        : null;
      const response = await PostService.getPostsByUserId(userId, page, lastPostId);
      const newPosts = response.data.content;
      if (newPosts.length > 0) {
        setPostsMap(prevPosts => {
          const updatedPosts = { ...prevPosts };
          newPosts.forEach(post => {
            if (!updatedPosts[post.id]) {
              updatedPosts[post.id] = post;
            }
          });
          return updatedPosts;
        });
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, page, loading, hasMore, postsMap]);

  useEffect(() => {
    fetchPosts();
  }, [userId, fetchPosts]);

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedPost(null);
  };

  const handleImageClick = (url) => {
    setOpenImage(url);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const sortedPosts = Object.values(postsMap).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Box>
      {sortedPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          currentUserId={userId}
          onCommentClick={handleCommentClick}
          onImageClick={handleImageClick}
        />
      ))}
      {loading && <CircularProgress />}
      {hasMore && !loading && (
        <Button onClick={fetchPosts} fullWidth>Load More</Button>
      )}

      <Modal
        open={!!openImage}
        onClose={handleCloseImage}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90%',
          maxHeight: '90%',
        }}>
          <img src={openImage} alt="Enlarged view" style={{maxWidth: '100%', maxHeight: '100%'}} />
        </Box>
      </Modal>

      <CommentModal
        open={commentModalOpen}
        handleClose={handleCloseCommentModal}
        post={selectedPost}
        currentUserId={userId}
      />
    </Box>
  );
};

export default UserPosts;