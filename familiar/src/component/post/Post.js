import React from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, IconButton
} from '@mui/material';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import styles from './PostList.module.css';

const Post = ({ post, currentUserId, onEditClick, onCommentClick, onImageClick }) => {
  const isCurrentUserPost = currentUserId && currentUserId === post.userId.toString();
  return (
    <Card className={styles.postCard}>
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
          {/*{isCurrentUserPost && (*/}
          {/*  <IconButton*/}
          {/*    onClick={() => onEditClick(post)}*/}
          {/*    size="small"*/}
          {/*    sx={{ marginLeft: 'auto' }}*/}
          {/*  >*/}
          {/*    <EditIcon />*/}
          {/*  </IconButton>*/}
          {/*)}*/}
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
                onClick={() => onImageClick(url)}
              />
            ))}
          </Box>
        )}
        <Box className={styles.postActions}>
          <IconButton
            onClick={() => onCommentClick(post)}
            size="small"
          >
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            ({post.commentCount || 0}) bình luận
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Post;