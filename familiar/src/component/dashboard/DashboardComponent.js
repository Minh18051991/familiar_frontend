import React from 'react';
import HomeComponent from '../login/HomeComponent';
import PostList from '../post/PostList';

function DashboardComponent() {
    return (
        <div>
            <HomeComponent />
            <PostList />
        </div>
    );
}

export default DashboardComponent;