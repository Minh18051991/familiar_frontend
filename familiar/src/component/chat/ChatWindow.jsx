import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    connectWebSocket,
    createMessageWithAttachments,
    getMessagesBetweenUsers,
    sendMessageRealTime,
    uploadFiles,
    deleteMessage
} from '../../service/post/MessageService';
import styles from './ChatWindow.module.css';
import {Button, Form, Image} from 'react-bootstrap';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import {IconButton} from "@mui/material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import ReactPlayer from 'react-player';
import {Link} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal as MuiModal, Box, Typography } from '@mui/material';



const ChatWindow = ({currentUser, otherUser, onClose, onLatestMessage}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [socketConnection, setSocketConnection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const emojiPickerRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    const chatId = `${Math.min(currentUser.userId, otherUser.userId)}_${Math.max(currentUser.userId, otherUser.userId)}`;

    const loadMessages = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await getMessagesBetweenUsers(currentUser.userId, otherUser.userId, page);
            if (response && Array.isArray(response.content)) {
                const fetchedMessages = response.content;
                setMessages(prevMessages => [...prevMessages, ...fetchedMessages]);
                setHasMore(response.number < response.totalPages - 1);
                setPage(prevPage => prevPage + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser.userId, otherUser.userId, page]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({behavior});
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const onMessageReceived = useCallback((receivedMessage) => {
        console.log(`New message received from user ${receivedMessage.senderUserId}:`, receivedMessage);
        if (
            (receivedMessage.senderUserId === currentUser.userId && receivedMessage.receiverUserId === otherUser.userId) ||
            (receivedMessage.senderUserId === otherUser.userId && receivedMessage.receiverUserId === currentUser.userId)
        ) {
            setMessages(prevMessages => {
                const messageExists = prevMessages.some(msg => msg.id === receivedMessage.id);
                if (!messageExists) {
                    return [receivedMessage, ...prevMessages];
                }
                return prevMessages;
            });
            onLatestMessage(receivedMessage);
            scrollToBottom('auto');
        }
    }, [currentUser.userId, otherUser.userId, scrollToBottom]);

    useEffect(() => {
        const connectSocket = async () => {
            try {
                const connection = await connectWebSocket(currentUser.userId, onMessageReceived);
                setSocketConnection(connection);
                setIsConnected(true);
                console.log(`WebSocket connected for user ${currentUser.userId}`);
            } catch (error) {
                console.error('Error connecting to WebSocket:', error);
                setIsConnected(false);
            }
        };

        connectSocket();

        return () => {
            if (socketConnection && typeof socketConnection.disconnect === 'function') {
                socketConnection.disconnect();
            }
            setIsConnected(false);
        };
    }, [currentUser.userId, onMessageReceived]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((newMessage.trim() || selectedFiles.length > 0) && !isSending) {
            setIsSending(true);
            const messageData = {
                senderUserId: currentUser.userId,
                receiverUserId: otherUser.userId,
                content: newMessage,
                createdAt: new Date().toISOString(),
                attachmentUrls: []
            };

            try {
                console.log('Preparing to send message:', messageData);
                console.log('Selected files:', selectedFiles);
                if (selectedFiles.length > 0) {
                    console.log('Uploading files...');
                    const attachmentUrls = await uploadFiles(selectedFiles);
                    messageData.attachmentUrls = attachmentUrls;
                }

                console.log('Sending message data:', messageData);

                if (isConnected) {
                    sendMessageRealTime(messageData);
                } else {
                    await createMessageWithAttachments(messageData);
                }

                setNewMessage('');
                setSelectedFiles([]);
                setPreviewUrls([]);
                scrollToBottom('auto');
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
        }
    };


    const handleClose = () => {
        setAnchorEl(null);
        setShowEmojiPicker(prev => ({
            ...prev,
            [chatId]: false
        }));
    };

    const open = Boolean(anchorEl);
    const id = open ? 'media-popover' : undefined;

    const handleEmojiClick = (emojiObject) => {
        setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
        handleClose();
    };
    const openEmoji = Boolean(emojiAnchorEl);
    const emojiId = openEmoji ? 'emoji-popper' : undefined;
    const handleDeleteClick = (message) => {
        setMessageToDelete(message);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (messageToDelete) {
            try {
                await deleteMessage(messageToDelete.id, currentUser.userId);
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageToDelete.id));
                setDeleteModalOpen(false);
                setMessageToDelete(null);
            } catch (error) {
                console.error('Error deleting message:', error);
                // You might want to show an error message to the user here
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setMessageToDelete(null);
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls(prevUrls => [...prevUrls, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };
    const removeFile = (index) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    };

    const handleImageClick = (url) => {
        setEnlargedImage(url);
    };
    const handleCloseEnlargedImage = (e) => {
        if (e.target.classList.contains(styles.enlargedImageOverlay)) {
            setEnlargedImage(null);
        }
    };


    const handleLoadMore = () => {
        if (hasMore && !isLoading) {
            loadMessages();
        }
    };
    useEffect(() => {
        if (messages.length > 0) {
            const latestMessage = messages[0]; // Assuming messages are sorted newest first
            onLatestMessage(latestMessage);
        }
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(prev => ({
                    ...prev,
                    [chatId]: false
                }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [chatId]);

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(prev => ({
            ...prev,
            [chatId]: !prev[chatId]
        }));
    };


   const renderMessage = (message) => {
    const isSent = message.senderUserId === currentUser.userId;
    const messageClass = isSent ? styles.sent : styles.received;

    return (
        <div key={message.id || message.createdAt} className={`${styles.messageWrapper} ${messageClass}`}>
            {!isSent && (
                <Image src={otherUser.userProfilePictureUrl} className={styles.messageAvatar} roundedCircle/>
            )}
            <div className={styles.messageContainer}>
                <div className={styles.messageCard}>
                    <div className={styles.messageContent}>
                        {message.content !== "[Attachment]" &&
                            <p>{message.content}</p>}
                        {message.attachmentUrls && message.attachmentUrls.length > 0 && (
                            <div className={styles.attachments}>
                                {message.attachmentUrls.map((url, index) => {
                                    const isImage = url.match(/\.(jpeg|jpg|gif|png|jfif)/i) != null;
                                    const isVideo = url.match(/\.(mp4|webm|ogg)/i) != null;

                                    if (isImage) {
                                        return <img key={index} src={url} alt="attachment"
                                                    className={styles.attachmentImage}
                                                    onClick={() => handleImageClick(url)}/>;
                                    } else if (isVideo) {
                                        return (
                                            <div key={index} className={styles.videoWrapper}>
                                                <ReactPlayer
                                                    url={url}
                                                    controls
                                                    width="100%"
                                                    height="100%"
                                                    className={styles.reactPlayer}
                                                />
                                            </div>
                                        );
                                    } else {
                                        return <a key={index} href={url} target="_blank" rel="noopener noreferrer"
                                                  className={styles.attachmentLink}>Attachment</a>;
                                    }
                                })}
                            </div>
                        )}
                        <span className={styles.timestamp}>
                            {moment(message.createdAt).format('HH:mm')}
                        </span>
                    </div>
                </div>
                {isSent && (
                    <IconButton
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(message)}
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </div>
        </div>
    );
};

    return (
        <div className={styles.chatWindow} key={chatId}>
            {enlargedImage && (
                <div
                    className={styles.enlargedImageOverlay}
                    onClick={handleCloseEnlargedImage}
                >
                    <img
                        src={enlargedImage}
                        alt="Enlarged view"
                        className={styles.enlargedImage}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            <div className={styles.chatHeader}>
                <Link to={`/users/detail/${otherUser.userId}`} className={styles.userLink}>
                    <Image src={otherUser.userProfilePictureUrl} className={styles.headerAvatar} roundedCircle/>
                    <h5>{`${otherUser.userFirstName} ${otherUser.userLastName}`}</h5>
                </Link>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
            </div>
            <div className={styles.chatMessages} ref={chatMessagesRef}>
                {hasMore && (
                    <button className={styles.loadMoreButton} onClick={handleLoadMore} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                )}
                <div ref={messagesEndRef}/>
                {messages.map(renderMessage)}
            </div>
            <div className={styles.filePreviewContainer}>
                {previewUrls.map((url, index) => (
                    <div key={index} className={styles.filePreview}>
                        {selectedFiles[index].type.startsWith('image/') ? (
                            <img src={url} alt="preview" className={styles.previewImage}/>
                        ) : (
                            <video src={url} className={styles.previewVideo}/>
                        )}
                        <IconButton
                            onClick={() => removeFile(index)}
                            className={styles.removeFileButton}
                            size="small"
                        >
                            <CancelIcon fontSize="small"/>
                        </IconButton>
                    </div>
                ))}
            </div>
            <Form onSubmit={handleSendMessage} className={styles.chatInputForm}>
                <div className={styles.inputWrapper}>
                    {showEmojiPicker[chatId] && (
                        <div ref={emojiPickerRef} className={styles.emojiPickerWrapper}>
                            <EmojiPicker onEmojiClick={handleEmojiClick}/>
                        </div>
                    )}
                    <IconButton
                        onClick={toggleEmojiPicker}
                        className={styles.emojiButton}
                    >
                        <InsertEmoticonIcon/>
                    </IconButton>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        style={{display: 'none'}}
                        id={`file-upload-${chatId}`}
                    />
                    <label htmlFor={`file-upload-${chatId}`}>
                        <IconButton component="span">
                            <AttachFileIcon/>
                        </IconButton>
                    </label>

                    <Form.Control
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Viết tin nhắn... "
                        className={styles.chatInput}
                        disabled={isSending}
                    />
                    <Button type="submit" className={styles.sendButton} disabled={!isConnected || isSending}>
                        {isSending ? 'Đang gởi..' : (isConnected ? 'Gửi' : 'Kết nối...')}
                    </Button>
                </div>
            </Form>
            <MuiModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="delete-modal-title" variant="h6" component="h2">
                        Xác nhận xóa tin nhắn
                    </Typography>
                    <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                        Bạn có chắc chắn muốn xóa tin nhắn này không?
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleDeleteCancel} sx={{ mr: 1 }}>
                            Hủy
                        </Button>
                        <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                            Xóa
                        </Button>
                    </Box>
                </Box>
            </MuiModal>
        </div>
    );
}

export default ChatWindow;
