import React from 'react';
import HomeComponent from '../login/HomeComponent';
import PostList from '../../components/post/PostList';

function DashboardComponent() {
    return (
        <div>
            <HomeComponent />
            <PostList />
        </div>
    );
}

export default DashboardComponent;