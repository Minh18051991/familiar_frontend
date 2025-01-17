import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Box,
  Typography,
  Avatar,
  Modal
} from '@mui/material';
import ReactPlayer from 'react-player';
import CommentList from './CommentList';
import CommentService from '../../service/post/CommentService';
import moment from 'moment';

const CommentModal = ({ open, handleClose, post, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [enlargedMedia, setEnlargedMedia] = useState(null);

  useEffect(() => {
    if (open && post) {
      fetchComments();
    }
  }, [open, post]);

  const fetchComments = async () => {
    try {
      const response = await CommentService.getCommentsByPostId(post.id);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };



  const handleEnlargeMedia = (url) => {
    setEnlargedMedia(url);
  };

  const handleCloseEnlargedMedia = () => {
    setEnlargedMedia(null);
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  if (!post) return null;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Bài viết và Bình luận</DialogTitle>
        <DialogContent>
          {/* Post content */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={post.userProfilePictureUrl} alt={`${post.userFirstName} ${post.userLastName}`} />
              <Box sx={{ ml: 1 }}>
                <Typography variant="subtitle1">
                  {`${post.userFirstName} ${post.userLastName}`}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {moment(post.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1">{post.content}</Typography>
            {post.attachmentUrls && post.attachmentUrls.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {post.attachmentUrls.map((url, index) => (
                  <Box
                    key={index}
                    onClick={() => handleEnlargeMedia(url)}
                    sx={{ 
                      display: 'inline-block', 
                      cursor: 'pointer', 
                      margin: '5px',
                      maxWidth: '200px',
                      maxHeight: '200px',
                      overflow: 'hidden'
                    }}
                  >
                    {isVideo(url) ? (
                      <ReactPlayer
                        url={url}
                        width="100%"
                        height="100%"
                        controls
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt={`Attachment ${index + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Comments section */}
          <Typography variant="h6" sx={{ mb: 2 }}>Bình luận</Typography>
          <CommentList
            comments={comments}
            postId={post.id}
            currentUserId={currentUserId}
            onCommentAdded={fetchComments}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Enlarged media modal */}
      <Modal
        open={!!enlargedMedia}
        onClose={handleCloseEnlargedMedia}
        aria-labelledby="enlarged-media-modal"
        aria-describedby="enlarged-media-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {enlargedMedia && (
            isVideo(enlargedMedia) ? (
              <ReactPlayer
                url={enlargedMedia}
                width="100%"
                height="100%"
                controls
              />
            ) : (
              <img 
                src={enlargedMedia} 
                alt="Enlarged media" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            )
          )}
        </Box>
      </Modal>
    </>
  );
};

export default CommentModal;