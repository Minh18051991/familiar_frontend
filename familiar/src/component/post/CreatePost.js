import React, { useState, useEffect } from 'react';
import PostService from '../../services/PostService';
import { findUserById } from '../../service/user/userService';
import { Form, Button, Modal } from 'react-bootstrap';
import { BsCamera, BsTrash, BsEmojiSmile } from 'react-icons/bs';
import styles from './CreatePost.module.css';

const CreatePost = ({ onPostCreated }) => {
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

    const CompactCreatePost = () => (
        <div className={styles.compactCreatePost} onClick={() => setShowModal(true)}>
            <img src={userData.userProfilePictureUrl} alt="Profile" className={styles.profilePicture} />
            <div className={styles.fakeTextArea}>{`${userData.userFirstName} ${userData.userLastName}, bạn đang nghĩ gì thế?`}</div>
        </div>
    );

    return (
        <>
            <CompactCreatePost />
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create a Post</Modal.Title>
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
                                    <BsCamera size={20} />
                                    <span>Photo/Video</span>
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
                            <Button variant="link" className={styles.emojiButton}>
                                <BsEmojiSmile size={20} />
                            </Button>
                        </div>
                        {files.length > 0 && (
                            <div className={styles.previewContainer}>
                                {files.map((file, index) => (
                                    <div key={index} className={styles.previewItem}>
                                        <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className={styles.previewImage} />
                                        <Button 
                                            variant="light" 
                                            size="sm" 
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <BsTrash />
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
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Posting...' : 'Post'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreatePost;