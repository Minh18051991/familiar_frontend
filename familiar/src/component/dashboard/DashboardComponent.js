import React from 'react';
import HomeComponent from '../login/HomeComponent';
import PostList from '../post/PostList';
import FriendRequestHome from "../friendship/FiendRequestHome";
import FriendListWithChat from '../friendship/FriendListWithChat';
import styles from './DashboardComponent.module.css';

function DashboardComponent() {
    return (
        <>
            <HomeComponent/>
            <div className={`${styles.dashboardRow} row vh-100`}>
                <div className="col-12 col-md-2 order-md-1">
                    <FriendRequestHome/>
                </div>
                <div className="col-12 col-md-8 order-md-2">
                    <PostList/>
                </div>
                <div className={`col-12 col-md-2 order-md-3 ${styles.friendListContainer}`}>
                    <FriendListWithChat/>
                </div>
            </div>
        </>
    )
        ;
}

export default DashboardComponent;