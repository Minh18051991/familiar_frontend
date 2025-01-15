import React, {useState, useEffect, useCallback} from 'react';
import { useSelector } from 'react-redux';
import { getFriendShips } from '../../service/friendship/friendshipService';
import ChatWindow from '../chat/ChatWindow';
import styles from './FriendListWithChat.module.css';

const FriendListWithChat = () => {
    const [friends, setFriends] = useState([]);
    const [activeChats, setActiveChats] = useState([]);
    const [latestMessages, setLatestMessages] = useState({});
    const [newMessageNotifications,setNewMessageNofications] = useState(false);
    const [readMessages, setReadMessages] = useState({});
    const currentUser = useSelector(state => state.user.account);

const handleLatestMessage = useCallback((friendId, message) => {
    console.log("Received message:", message);

    setLatestMessages(prev => ({
        ...prev,
        [friendId]: message
    }));

    // Kiểm tra xem tin nhắn có phải từ bạn bè không
    const isMessageFromFriend = message.senderUserId === friendId;

    if (isMessageFromFriend) {
        // Chỉ đặt thông báo mới nếu tin nhắn đến từ bạn bè
        if (!readMessages[friendId] || readMessages[friendId] !== message.id) {
            setNewMessageNofications(prev => ({...prev, [friendId]: true }));
        }
    } else {
        // Nếu tin nhắn từ người dùng hiện tại, tắt thông báo mới
        setNewMessageNofications(prev => ({...prev, [friendId]: false }));
        setReadMessages(prev => ({...prev, [friendId]: message.id }));
    }

    // Di chuyển bạn bè lên đầu danh sách, bất kể ai gửi tin nhắn
    setFriends(prevFriends => {
        const updatedFriends = prevFriends.filter(f => f.userId !== friendId);
        const friendToMove = prevFriends.find(f => f.userId === friendId);
        return [friendToMove, ...updatedFriends];
    });
}, [readMessages]);
    useEffect(() => {
        // Khôi phục các cuộc trò chuyện đang hoạt động từ localStorage
        const storedActiveChats = JSON.parse(localStorage.getItem('activeChats')) || [];
        setActiveChats(storedActiveChats);
    }, []);

    useEffect(() => {
        // Lưu các cuộc trò chuyện đang hoạt động vào localStorage
        localStorage.setItem('activeChats', JSON.stringify(activeChats));
    }, [activeChats]);

useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendships = await getFriendShips(currentUser.userId);
                setFriends(friendships);

            } catch (error) {
                console.error('Error fetching friends:', error);
            }

        };

        fetchFriends();
    }, [currentUser.userId]);





    const handleFriendClick = (friend) => {
        if (!activeChats.some(chat => chat.userId === friend.userId)) {
            setActiveChats(prevChats => [...prevChats, friend]);
        }
        // Đánh dấu tin nhắn là đã đọc
        markMessageAsRead(friend.userId);
    };

    const handleCloseChatWindow = (userId) => {
        setActiveChats(prevChats => prevChats.filter(chat => chat.userId !== userId));
    };

    const markMessageAsRead = (friendId) => {
        setNewMessageNofications(prev => ({...prev, [friendId]: false }));
        if (latestMessages[friendId]) {
            setReadMessages(prev => ({...prev, [friendId]: latestMessages[friendId].id }));
        }
    };

    const handleChatOpen = (friendId) => {
        markMessageAsRead(friendId);
    };




    return (
        <div className={`card ${styles.friendListCard}`}>
            <div className="card-header">
                <h5 className="mb-0">Tin nhắn</h5>
            </div>
            <div className={`card-body ${styles.scrollableCardBody}`}>
                <div className={styles.friendList}>
                    {friends.length > 0 ? (
                        <div className={`${styles.friendGrid} row g-2`}>
                            {friends.map((friend) => (
                                <div key={friend.userId} className="col-12 mb-2">
                                    <div
                                        className={`${styles.friendItem} card`}
                                        onClick={() => handleFriendClick(friend)}
                                    >
                                        <div className="card-body p-2 d-flex align-items-center">
                                            <img
                                                src={friend.userProfilePictureUrl}
                                                alt={`${friend.userFirstName} ${friend.userLastName}`}
                                                className={`${styles.avatar} rounded-circle me-2`}
                                            />
                                            <div className={styles.friendInfo}>
                                                <span className={`${styles.friendName} card-title mb-0`}>
                                                    {friend.userFirstName} {friend.userLastName}
                                                </span>
                                                {latestMessages[friend.userId] && (
                                                    <p className={`${styles.latestMessage} ${newMessageNotifications[friend.userId] ? styles.newMessageText : ''}`}>
                                                        {latestMessages[friend.userId].content}
                                                    </p>
                                                )}
                                            </div>
                                            {newMessageNotifications[friend.userId] && (
                                                <div className={styles.newMessageNotification}>
                                                    Mới
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={`${styles.noFriends} text-center`}>Chưa có bạn bè.</p>
                    )}
                </div>
            </div>
            <div className={styles.chatWindowsContainer}>
                {activeChats.map((friend, index) => (
                    <div
                        key={friend.userId}
                        className={styles.chatWindowWrapper}
                        style={{ right: `${index * 320}px` }}
                    >
                        <ChatWindow
                            currentUser={currentUser}
                            otherUser={friend}
                            onClose={() => handleCloseChatWindow(friend.userId)}
                            onLatestMessage={(message) => handleLatestMessage(friend.userId, message)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendListWithChat;