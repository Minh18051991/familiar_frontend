import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getMessagesBetweenUsers, createMessage, connectWebSocket, sendMessageRealTime } from '../../services/MessageService';
import styles from './ChatWindow.module.css';
import { Form, Button, Image } from 'react-bootstrap';
import moment from 'moment';

const ChatWindow = ({ currentUser, otherUser, onClose,onLatestMessage }) => {
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
    messagesEndRef.current?.scrollIntoView({ behavior });
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
        if (newMessage.trim() && !isSending) {
            setIsSending(true);
            const messageData = {
                senderUserId: currentUser.userId,
                receiverUserId: otherUser.userId,
                content: newMessage,
                createdAt: new Date().toISOString()
            };

            try {
                let sentMessage;
                if (isConnected) {
                    sendMessageRealTime(messageData);
                    sentMessage = messageData;
                } else {
                    sentMessage = await createMessage(messageData);
                }

                setNewMessage('');
                scrollToBottom('auto');
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
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


    const renderMessage = (message) => {
        const isSent = message.senderUserId === currentUser.userId;
        const messageClass = isSent ? styles.sent : styles.received;

        return (
            <div key={message.id || message.createdAt} className={`${styles.messageWrapper} ${messageClass}`}>
                {!isSent && (
                    <Image src={otherUser.userProfilePictureUrl} className={styles.messageAvatar} roundedCircle />
                )}
                <div className={styles.messageCard}>
                    <div className={styles.messageContent}>
                        <p>{message.content}</p>
                        <span className={styles.timestamp}>
                            {moment(message.createdAt).format('HH:mm')}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.chatWindow} key={chatId}>
            <div className={styles.chatHeader}>
                <Image src={otherUser.userProfilePictureUrl} className={styles.headerAvatar} roundedCircle />
                <h5>{`${otherUser.userFirstName} ${otherUser.userLastName}`}</h5>
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
            <Form onSubmit={handleSendMessage} className={styles.chatInputForm}>
                <div className={styles.inputWrapper}>
                    <Form.Control
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className={styles.chatInput}
                        disabled={isSending}
                    />
                    <Button type="submit" className={styles.sendButton} disabled={!isConnected || isSending}>
                        {isSending ? 'Sending...' : (isConnected ? 'Send' : 'Connecting...')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ChatWindow;