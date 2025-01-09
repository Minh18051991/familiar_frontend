import React from 'react';
import HomeComponent from '../login/HomeComponent';
import PostList from '../post/PostList';
import FriendRequestHome from "../friendship/FiendRequestHome";

function DashboardComponent() {
    return (
        <>
            <HomeComponent/>
            <div className="row">
                <div className="col-12 col-md-2 order-md-1">
                      <FriendRequestHome/>
                </div>
                <div className="col-12 col-md-8 order-md-1">
                    <PostList/>
                </div>
                <div className="col-12 col-md-2 order-md-1">
                   Danh sách bạn bè và khung chat
                </div>
            </div>


        </>
    );
}

export default DashboardComponent;