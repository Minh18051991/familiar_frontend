import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    Modal,
    Typography
} from '@mui/material';
import styles from './PostList.module.css';
import EditPost from './EditPost';
import CreatePost from './CreatePost';
import moment from 'moment';
import PostService from "../../services/PostService";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import CommentModal from '../comment/CommentModal';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import ReactPlayer from "react-player";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [changePost, setChangePost] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [openImage, setOpenImage] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [allPostsLoaded, setAllPostsLoaded] = useState(false);

    const currentUserId = localStorage.getItem('userId');

    const fetchPosts = useCallback(async () => {
        if (!hasMore || isLoading) return;
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await PostService.getAllPosts(page, token);
            if (response.data && Array.isArray(response.data.content)) {
                const newPosts = response.data.content.filter(
                    newPost => !posts.some(existingPost => existingPost.id === newPost.id)
                );
                if (newPosts.length > 0) {
                    setPosts(prevPosts => {
                        const updatedPosts = [...prevPosts, ...newPosts];
                        return updatedPosts.filter((post, index, self) =>
                            index === self.findIndex((t) => t.id === post.id)
                        )
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    });
                    setPage(prevPage => prevPage + 1);
                } else {
                    setHasMore(false);
                    setAllPostsLoaded(true);
                }
            } else {
                setError('Không còn bài viết nào để hiển thị');
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to fetch posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore, posts, isLoading, changePost]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const handleImageClick = (url) => {
        setOpenImage(url);
    };

    const handleCloseImage = () => {
        setOpenImage(null);
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
        setIsEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditingPost(null);
        setIsEditModalOpen(false);
    };

  const handlePostUpdated = (updatedPost) => {
    // Cập nhật bài viết trong state hiện tại
    setPosts(prevPosts => prevPosts.map(post =>
        post.id === updatedPost.id ? {...post, ...updatedPost} : post
    ));

    // Đóng modal chỉnh sửa
    setEditingPost(null);
    setIsEditModalOpen(false);

    // Tải lại dữ liệu
    setPage(0);
    setHasMore(true);
    setAllPostsLoaded(false);
    setPosts([]); // Xóa tất cả bài viết hiện tại
    setChangePost(prev => !prev); // Trigger re-fetch

    // Hiển thị thông báo thành công
    toast.success('Bài viết đã được cập nhật thành công');
};

    const handleCommentClick = (post) => {
        setSelectedPost(post);
        setCommentModalOpen(true);
    };

    const handleCloseCommentModal = () => {
        setCommentModalOpen(false);
        setSelectedPost(null);
    };

    const handleChangePost = () => {
        setChangePost(prev => !prev);
    }
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
                } else {
                    toast.error('Không thể xóa bài viết. Vui lòng thử lại.');
                }
            } catch (err) {
                toast.error('Xóa thành công');
            } finally {
                // Đặt lại các state để tải lại dữ liệu, bất kể thành công hay thất bại
                setPage(0);
                setHasMore(true);
                setAllPostsLoaded(false);
                setPosts([]); // Xóa tất cả bài viết hiện tại
                setChangePost(prev => !prev); // Trigger re-fetch
            }
        }
    };
    const isVideoUrl = (url) => {
        if (!url) return false;

        // Danh sách các phần mở rộng video phổ biến
        const videoExtensions = ['mp4', 'mkv', 'avi', 'webm', 'mov', 'flv', 'wmv'];

        // Kiểm tra nếu URL chứa phần mở rộng video
        const hasVideoExtension = videoExtensions.some(ext =>
            url.toLowerCase().includes(`.${ext}`)
        );

        // Kiểm tra nếu là URL từ Firebase Storage và chứa tên file video
        const isFirebaseStorageVideo = url.includes('firebasestorage.googleapis.com') &&
            videoExtensions.some(ext =>
                url.toLowerCase().includes(`%2f${ext}`) || // Đối với URL đã được mã hóa
                url.toLowerCase().includes(`/${ext}`)      // Đối với URL chưa được mã hóa
            );

        return hasVideoExtension || isFirebaseStorageVideo;
    }

    return (
        <Box sx={{maxWidth: 800, margin: 'auto', p: 2}}>
            <CreatePost onPostCreated={handlePostCreated}/>

            {posts.map((post, index) => (
                <Card key={`${post.id}-${index}`} className={styles.postCard}>
                    <CardContent className={styles.postContent}>
                        <Box className={styles.userInfo}>
                            <Link to={`/users/detail/${post.userId}`}
                                  style={{textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
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
                            </Link>
                            {currentUserId && currentUserId === post.userId.toString() && (
                                <>
                                    <IconButton
                                        onClick={() => handleEditClick(post)}
                                        size="small"
                                        sx={{marginLeft: 'auto'}}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeletePost(post.id)}
                                        size="small"
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </>
                            )}
                        </Box>
                        <Typography variant="body1" className={styles.postText}>
                            {post.content}
                        </Typography>
                        {post.attachmentUrls && post.attachmentUrls.length > 0 && (
                            <Box className={styles.attachmentGrid}>
                                {post.attachmentUrls.map((url, attachmentIndex) => (
                                    isVideoUrl(url) ? (
                                        <Box key={`${post.id}-attachment-${attachmentIndex}`}
                                             className={styles.videoWrapper}>
                                            <ReactPlayer
                                                url={url}
                                                width="100%"
                                                height="100%"
                                                controls={true}
                                                light={true}
                                                onClick={() => handleImageClick(url)}
                                            />
                                        </Box>
                                    ) : (
                                        <img
                                            key={`${post.id}-attachment-${attachmentIndex}`}
                                            src={url}
                                            alt={`Attachment ${attachmentIndex + 1}`}
                                            className={styles.attachmentImage}
                                            onClick={() => handleImageClick(url)}
                                        />
                                    )
                                ))}
                            </Box>
                        )}
                        <Box className={styles.postActions}>
                            <IconButton
                                onClick={() => handleCommentClick(post)}
                                size="small"
                            >
                                <CommentIcon/>
                            </IconButton>
                            <Typography variant="body2" sx={{marginLeft: 1}}>
                                ({post.commentCount || 0}) bình luận
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            {isLoading && <CircularProgress/>}
            {error && !allPostsLoaded && <Alert severity="error">{error}</Alert>}
            {!hasMore && allPostsLoaded && <Typography>Không còn bài viết nào nữa</Typography>}
            {hasMore && !isLoading && (
                <Button onClick={fetchPosts}>Load More</Button>
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
                    {isVideoUrl(openImage) ? (
                        <ReactPlayer
                            url={openImage}
                            width="100%"
                            height="100%"
                            controls={true}
                        />
                    ) : (
                        <img src={openImage} alt="Enlarged view" style={{maxWidth: '100%', maxHeight: '100%'}}/>
                    )}
                </Box>
            </Modal>

            {editingPost && (
                <EditPost
                    post={editingPost}
                    open={isEditModalOpen}
                    onClose={handleEditClose}
                    onUpdate={handlePostUpdated}
                    handleChange={handleChangePost}
                />
            )}

            <CommentModal
                open={commentModalOpen}
                handleClose={handleCloseCommentModal}
                post={selectedPost}
                currentUserId={currentUserId}
            />
        </Box>
    );
};

export default PostList;