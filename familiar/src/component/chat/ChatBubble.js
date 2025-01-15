import React, { useState } from 'react';
import FriendListWithChat from '../friendship/FriendListWithChat';
import { Message as MessageIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';
import styles from './ChatBubble.module.css';

function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.chatBubbleContainer}>
      {isOpen ? (
        <div className={styles.chatList}>
          <button className={styles.closeButton} onClick={toggleChat}>
            <CloseIcon />
          </button>
          <FriendListWithChat />
        </div>
      ) : (
        <button className={styles.chatBubble} onClick={toggleChat}>
          <MessageIcon />
        </button>
      )}
    </div>
  );
}

export default ChatBubble;