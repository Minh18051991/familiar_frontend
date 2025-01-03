import React from 'react';
import { Container } from '@mui/material';
import PostList from './components/HomePage/PostList';
import Header from "./components/Layout/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <>
            <Header />
            <Container maxWidth="md">
                <PostList />
            </Container>
        </>
    );
}

export default App;