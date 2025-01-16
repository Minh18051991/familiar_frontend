import React, {useState, useEffect} from 'react';
import PostService from '../../services/PostService';
import {findUserById} from '../../service/user/userService';
import {Form, Button, Modal} from 'react-bootstrap';
import {BsCamera, BsTrash, BsEmojiSmile} from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import styles from './CreatePost.module.css';
import {useSelector} from "react-redux";

const CreatePost = ({onPostCreated}) => {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        userProfilePictureUrl: '',
        userFirstName: '',
        userLastName: ''
    });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const info = useSelector(state => state.user);
    const account = info ? info.account : null;

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const fetchedUserData = await findUserById(parseInt(userId));
                    setUserData({
                        userProfilePictureUrl: fetchedUserData.userProfilePictureUrl,
                        userFirstName: fetchedUserData.userFirstName,
                        userLastName: fetchedUserData.userLastName
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const postData = {
            content: content,
            userId: parseInt(localStorage.getItem('userId')),
        };

        try {
            const createdPost = await PostService.createPost(postData, files);
            onPostCreated(createdPost);
            setContent('');
            setFiles([]);
            setShowModal(false);
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const onEmojiClick = (emojiObject) => {
        setContent(prevContent => prevContent + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const CompactCreatePost = () => {
        let profilePicture;
        let altText = "Profile";

        if (account && account.profilePictureUrl) {
            profilePicture = account.profilePictureUrl;
        } else if (account && account.gender) {
            altText = account.gender;
            if (account.gender === 'Nam') {
                profilePicture = "https://static2.yan.vn/YanNews/2167221/202003/dan-mang-du-trend-thiet-ke-avatar-du-kieu-day-mau-sac-tu-anh-mac-dinh-b0de2bad.jpg";
            } else if (account.gender === 'Nữ') {
                profilePicture = "https://antimatter.vn/wp-content/uploads/2022/04/anh-avatar-trang-co-gai-toc-tem.jpg";
            } else {
                profilePicture = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";
            }
        } else {
            profilePicture = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";
        }

        return (
            <div className={styles.compactCreatePost} onClick={() => setShowModal(true)}>
                <img src={profilePicture} alt={altText} className={styles.profilePicture}/>
                <div
                    className={styles.fakeTextArea}>{`${userData.userFirstName} ${userData.userLastName}, bạn đang nghĩ gì thế?`}</div>
            </div>
        );
    };
    return (
        <>
            <CompactCreatePost/>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className={styles.textareaWrapper}>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`${userData.userFirstName} ${userData.userLastName}, bạn đang nghĩ gì thế?`}
                                className={styles.textarea}
                            />
                        </div>
                        <div className={styles.actionBar}>
                            <div className={styles.fileUpload}>
                                <label htmlFor="file-upload" className={styles.fileUploadLabel}>
                                    <BsCamera size={20}/>
                                    <span>Ảnh và Video</span>
                                </label>
                                <Form.Control
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept="image/*,video/*"
                                    className={styles.hiddenInput}
                                />
                            </div>
                            <Button
                                variant="link"
                                className={styles.emojiButton}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <BsEmojiSmile size={20}/>
                            </Button>
                        </div>
                        {showEmojiPicker && (
                            <div className={styles.emojiPickerContainer}>
                                <EmojiPicker onEmojiClick={onEmojiClick}/>
                            </div>
                        )}
                        {files.length > 0 && (
                            <div className={styles.previewContainer}>
                                {files.map((file, index) => (
                                    <div key={index} className={styles.previewItem}>
                                        <img src={URL.createObjectURL(file)} alt={`Preview ${index}`}
                                             className={styles.previewImage}/>
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <BsTrash/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {error && (
                            <p className={styles.errorMessage}>{error}</p>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang đăng bài...' : 'Đăng bài'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreatePost;