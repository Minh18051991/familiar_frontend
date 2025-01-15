import React, {useState} from 'react';
import styles from './Comment.module.css';
import {Avatar, Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography} from '@mui/material';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Link} from "react-router-dom";
import CommentService from "../../services/CommentService";


const Comment = ({comment, onReply, onEdit, onDelete, currentUserId, refreshComments}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const truncateContent = (content, maxLength = 45) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    const handleEdit = () => {
        onEdit(comment.id, editedContent);
        setIsEditing(false);
    };

    const handleReply = () => {
        onReply(comment.id, replyContent);
        setIsReplying(false);
        setReplyContent('');
    };

    const handleEmojiClick = (emojiObject) => {
        const emoji = emojiObject.emoji;
        if (isEditing) {
            setEditedContent(prevContent => prevContent + emoji);
        } else if (isReplying) {
            setReplyContent(prevContent => prevContent + emoji);
        }
        setShowEmojiPicker(false);
    };

    const handleDelete = async () => {
        if (comment && comment.id) {
            try {
                await CommentService.deleteComment(comment.id);
                onDelete(comment.id);
                refreshComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        } else {
            console.error('Comment ID is undefined');
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        handleDelete();
        handleMenuClose();
    };

    return (
        <Box className={styles.commentContainer}>
            <Box className={styles.commentHeader}>
                <Link to={`/users/detail/${comment.userId}`} className={styles.avatarLink}>
                    <Avatar
                        src={comment.userProfilePictureUrl}
                        alt={`${comment.userFirstName} ${comment.userLastName}`}
                        className={styles.avatar}
                    />
                </Link>
                <Box className={styles.headerContent}>
                    <Box className={styles.nameAndOptions}>
                        <Link to={`/users/detail/${comment.userId}`} className={styles.userNameLink}>
                            <Typography variant="subtitle2" className={styles.userName}>
                                {`${comment.userFirstName} ${comment.userLastName}`}
                            </Typography>
                        </Link>
                        {Number(comment.userId) === Number(currentUserId) && (
                            <Box className={styles.editDeleteContainer}>
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={handleMenuOpen}
                                    size="small"
                                >
                                    <MoreVertIcon/>
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleEditClick}>Chỉnh sửa</MenuItem>
                                    <MenuItem onClick={handleDeleteClick}>Xóa</MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Box>
                    <Paper elevation={0} className={styles.commentPaper}>
                        {isEditing ? (
                            <Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    sx={{mb: 1}}
                                />
                                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <InsertEmoticonIcon/>
                                </IconButton>
                                <Button onClick={handleEdit} variant="contained" size="small" sx={{mr: 1}}>Lưu</Button>
                                <Button onClick={() => setIsEditing(false)} variant="outlined" size="small">Hủy</Button>
                            </Box>
                        ) : (
                            <Typography className={styles.commentText}>
                                {isExpanded ? comment.content : truncateContent(comment.content)}
                                {comment.content.length > 45 && (
                                    <Button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        size="small"
                                        sx={{ml: 1, minWidth: 'auto', p: '2px 5px', fontSize: '0.7rem'}}
                                    >
                                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                    </Button>
                                )}
                            </Typography>
                        )}
                    </Paper>
                    <Box className={styles.commentMeta}>
                        <Typography variant="caption" className={styles.timestamp}>
                            {moment(comment.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                        </Typography>
                        <Button onClick={() => setIsReplying(!isReplying)} size="small" className={styles.replyButton}>
                            Phản hồi
                        </Button>
                    </Box>
                </Box>
            </Box>
            {isReplying && (
                <Box className={styles.replyContainer}>
                    <TextField
                        size="small"
                        multiline
                        rows={2}
                        placeholder="Viết bình luận..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        fullWidth
                        sx={{mb: 1}}
                    />
                    <Box className={styles.replyActions}>
                        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            <InsertEmoticonIcon/>
                        </IconButton>
                        <IconButton onClick={handleReply} color="primary" size="small" sx={{mr: 1}}>
                            <SendIcon/>
                        </IconButton>
                        <IconButton onClick={() => setIsReplying(false)} color="error" size="small">
                            <CancelIcon/>
                        </IconButton>
                    </Box>
                </Box>
            )}
            {showEmojiPicker && (
                <Box className={styles.emojiPickerContainer}>
                    <EmojiPicker onEmojiClick={handleEmojiClick}/>
                </Box>
            )}
        </Box>
    );
}

export default Comment;