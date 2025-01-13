import React, {useState, useEffect, useCallback} from 'react';
import { useSelector } from 'react-redux';
import { getFriendShips } from '../../service/friendship/friendshipService';
import ChatWindow from '../chat/ChatWindow';
import styles from './FriendListWithChat.module.css';

const FriendListWithChat = () => {
    const [friends, setFriends] = useState([]);
    const [activeChats, setActiveChats] = useState([]);
    const [latestMessages, setLatestMessages] = useState({});
    const currentUser = useSelector(state => state.user.account);

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
    };

    const handleCloseChatWindow = (userId) => {
        setActiveChats(prevChats => prevChats.filter(chat => chat.userId !== userId));
    };


    const handleLatestMessage = useCallback((friendId, message) => {
        setLatestMessages(prev => ({
            ...prev,
            [friendId]: message
        }));
    }, []);

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
                                                    <p className={styles.latestMessage}>
                                                        {latestMessages[friend.userId].content}
                                                    </p>
                                                )}
                                            </div>
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