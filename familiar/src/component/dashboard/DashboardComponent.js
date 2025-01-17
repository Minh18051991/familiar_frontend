import React from 'react';
import PostList from '../post/PostList';
import FriendRequestHome from "../friendship/FiendRequestHome";
import ChatBubble from '../chat/ChatBubble';
import styles from './DashboardComponent.module.css';
import FooterComponent from "../footer/FooterComponent";

function DashboardComponent() {
    return (
        <div className={`${styles.dashboardRow} row `}>
            <div className="col-12 col-md-2 col-lg-2 order-md-1">
                <FriendRequestHome/>
            </div>
            <div className="col-12 col-md-8 col-lg-8 order-md-2">
                <PostList/>
            </div>
            <div className="col-12 col-md-2 col-lg-2 order-md-3">
                <ChatBubble/>
            </div>
        </div>

    );
}

export default DashboardComponent;