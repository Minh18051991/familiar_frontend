import React, {useEffect, useState} from 'react';
import {Box, Button, IconButton, TextField, Typography} from '@mui/material';
import Comment from './Comment';
import CommentService from '../../service/post/CommentService';
import styles from './CommentList.module.css';
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';


const CommentList = ({postId}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const currentUserId = localStorage.getItem('userId');
    const [expandedComments, setExpandedComments] = useState({});
    const [visibleComments, setVisibleComments] = useState(() => {
        const initialState = {};
        comments.forEach(comment => {
            initialState[comment.id] = 4;
        });
        return initialState;
    });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiClick = (emojiObject) => {
        setNewComment(prev => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const toggleReplies = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await CommentService.getCommentsByPostId(postId);
            const commentsArray = Array.isArray(response) ? response : [];
            setComments(commentsArray);
            // Cập nhật visibleComments
            setVisibleComments(prev => {
                const newState = {...prev};
                commentsArray.forEach(comment => {
                    if (!newState[comment.id]) {
                        newState[comment.id] = 4;
                    }
                });
                return newState;
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        }
    };

    const handleAddComment = async () => {
        try {
            const commentDTO = {
                postId,
                userId: currentUserId,
                content: newComment,
                parentCommentId: null,
                level: 0
            };
            await CommentService.addComment(commentDTO);
            fetchComments();
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const refreshComments = async () => {
        try {
            const updatedComments = await CommentService.getCommentsByPostId(postId);
            const commentsArray = Array.isArray(updatedComments) ? updatedComments : [];
            setComments(commentsArray);
            // Cập nhật visibleComments
            setVisibleComments(prev => {
                const newState = {...prev};
                commentsArray.forEach(comment => {
                    if (!newState[comment.id]) {
                        newState[comment.id] = 4;
                    }
                });
                return newState;
            });
        } catch (error) {
            console.error('Error refreshing comments:', error);
        }
    };

    const handleReply = async (parentCommentId, content) => {
        try {
            const parentComment = findCommentById(comments, parentCommentId);
            const level = parentComment ? parentComment.level + 1 : 1;

            const commentDTO = {
                postId,
                userId: currentUserId,
                content,
                parentCommentId,
                level
            };
            await CommentService.addComment(commentDTO);
            fetchComments();
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleEdit = async (commentId, content) => {
        try {
            await CommentService.updateComment(commentId, {content});
            fetchComments();
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await CommentService.deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const findCommentById = (comments, id) => {
        for (let comment of comments) {
            if (comment.id === id) return comment;
            if (comment.replies) {
                const found = findCommentById(comment.replies, id);
                if (found) return found;
            }
        }
        return null;
    };

    const loadMoreComments = (parentId) => {
        setVisibleComments(prev => ({
            ...prev,
            [parentId || 'root']: (prev[parentId || 'root'] || 4) + 4
        }));
    };

    const collapseComments = (parentId) => {
        setVisibleComments(prev => ({
            ...prev,
            [parentId || 'root']: 4
        }));
    };

    const renderComments = (commentsToRender, depth = 0, parentId = null) => {
        if (!commentsToRender || commentsToRender.length === 0) {
            return <Typography className={styles.noComments}>Không có bình luận nào</Typography>;
        }

        const visibleCount = visibleComments[parentId || 'root'] || 4;
        const hasMoreComments = commentsToRender.length > visibleCount;

        const commentsToShow = commentsToRender.slice(0, visibleCount);

        return (
            <>
                {commentsToShow.map(comment => (
                    <Box key={comment.id} className={depth > 0 ? styles.nestedComments : ''}>
                        <Box className={styles.commentBubble}>
                            <Comment
                                comment={comment}
                                onReply={handleReply}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                currentUserId={currentUserId}
                                refreshComments={refreshComments}
                            />
                        </Box>
                        {comment.replies && comment.replies.length > 0 && (
                            <Button
                                onClick={() => toggleReplies(comment.id)}
                                className={styles.replyButton}
                            >
                                {expandedComments[comment.id]
                                    ? `Ẩn ${comment.replies.length} phản hồi`
                                    : `Xem ${comment.replies.length} phản hồi`}
                            </Button>
                        )}
                        {expandedComments[comment.id] && comment.replies && (
                            <Box>
                                {renderComments(comment.replies, depth + 1, comment.id)}
                            </Box>
                        )}
                    </Box>
                ))}
                {hasMoreComments && (
                    <Button
                        onClick={() => loadMoreComments(parentId)}
                        className={styles.loadMoreButton}
                    >
                        Xem thêm bình luận
                    </Button>
                )}
                {visibleCount > 4 && (
                    <Button
                        onClick={() => collapseComments(parentId)}
                        className={styles.collapseButton}
                    >
                        Thu gọn
                    </Button>
                )}
            </>
        );
    };

    return (
        <Box className={styles.commentListContainer}>
            {renderComments(comments)}
            <Box className={styles.commentInputContainer}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={styles.commentInput}
                />
                <Box className={styles.commentActions}>
                    <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <InsertEmoticonIcon />
                    </IconButton>
                    <Button
                        onClick={handleAddComment}
                        variant="contained"
                        color="primary"
                        className={styles.commentButton}
                    >
                        Bình Luận
                    </Button>
                </Box>
                {showEmojiPicker && (
                    <Box className={styles.emojiPickerContainer}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CommentList;