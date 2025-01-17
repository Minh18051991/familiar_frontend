import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography, Button, Modal } from '@mui/material';
import PostService from '../../service/post/PostService';
import Post from '../post/Post';
import CommentModal from '../comment/CommentModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPost from '../post/EditPost';
import { toast } from 'react-toastify';

const UserPosts = ({ userId }) => {
  const [postsMap, setPostsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [openImage, setOpenImage] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const resetState = useCallback(() => {
    setPostsMap({});
    setPage(0);
    setHasMore(true);
    setOpenImage(null);
    setSelectedPost(null);
    setInitialLoadDone(false);
  },[]);

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
      setInitialLoadDone(true);
    }
  }, [userId, page, loading, hasMore, postsMap]);

  useEffect(() => {
    resetState()
    fetchPosts();
  }, [userId,resetState]);


  useEffect(() => {
    if (!initialLoadDone && !loading) {
      fetchPosts();
    }
  }, [initialLoadDone, loading, fetchPosts]);

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
  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditingPost(null);
    setIsEditModalOpen(false);
  };

const handlePostUpdated = async (updatedPost) => {
  try {
    // Cập nhật state local trước
    setPostsMap(prevPosts => ({
      ...prevPosts,
      [updatedPost.id]: { ...prevPosts[updatedPost.id], ...updatedPost }
    }));

    // Đóng modal chỉnh sửa
    setEditingPost(null);
    setIsEditModalOpen(false);

    // Hiển thị thông báo thành công
    toast.success('Bài viết đã được cập nhật thành công');
    await fetchPosts();
    window.location.reload();
  } catch (error) {
    console.error('Error refreshing posts after update:', error);
    toast.error('Có lỗi xảy ra khi làm mới dữ liệu. Vui lòng thử lại.');
  }
};

  const handleDeletePost = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }
        const response = await PostService.deletePost(postId, token);

        if (response && response.status === 200) {
          toast.success('Bài viết đã được xóa thành công');
          setPostsMap(prevPosts => {
            const newPosts = { ...prevPosts };
            delete newPosts[postId];
            return newPosts;
          });
        } else {
          toast.error('Không thể xóa bài viết. Vui lòng thử lại.');
        }
      } catch (err) {
        console.error('Lỗi khi xóa bài viết:', err);
        toast.error('Có lỗi xảy ra khi xóa bài viết');
      }
    }
  };
  const safeToString = (value) => {
    try {
      return value.toString();
    } catch (error) {
      console.warn('Error converting value to string:', error);
      return '';
    }
  };

 return (
     <Box>
       {initialLoadDone && sortedPosts.length === 0 ? (
           <Typography variant="body1" align="center" sx={{ my: 2 }}>
             Người dùng này chưa có bài viết nào.
           </Typography>
       ) : (
           sortedPosts.map((post) => (
               post && (
                   <Box key={post.id ? post.id.toString() : Math.random().toString()} sx={{ mb: 2 }}>
                     <Post
                         post={post}
                         currentUserId={userId}
                         onCommentClick={handleCommentClick}
                         onImageClick={handleImageClick}
                     />
                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                       <Button
                           startIcon={<EditIcon />}
                           onClick={() => handleEditClick(post)}
                           size="small"
                           sx={{ mr: 1 }}
                       >
                         Sửa
                       </Button>
                       <Button
                           startIcon={<DeleteIcon />}
                           onClick={() => handleDeletePost(post.id)}
                           size="small"
                           color="error"
                       >
                         Xóa
                       </Button>
                     </Box>
                   </Box>
               )
           ))
       )}
    {loading && <CircularProgress />}

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

    {editingPost && (
      <EditPost
        post={editingPost}
        open={isEditModalOpen}
        onClose={handleEditClose}
        onUpdate={handlePostUpdated}
        handleChange={() =>{}}
      />
    )}
  </Box>
);
};

export default UserPosts;