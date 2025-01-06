import React from 'react';
import styles from './App.module.css';
import HeaderComponent from "./component/header/HeaderComponent";
import {Route, Routes} from "react-router-dom";
import LoginComponent from "./component/login/LoginComponent";
import HomeComponent from "./component/login/HomeComponent";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import RegisterComponent from "./component/register/RegisterComponent";
import {ToastContainer} from "react-toastify";
import DetailComponent from "./component/user/DetailComponent";
import PrivateRoute from "./component/login/PrivateRoute";
import FooterComponent from "./component/footer/FooterComponent";
import UpdateAccountComponent from "./component/account/UpdateAccountComponent";
import PostList from "./components/post/PostList";

function App() {
    return (
        <div className={styles.appContainer}>
            <HeaderComponent/>
            <ToastContainer autoClose={1000}/>
            <main className={styles.mainContent}>
                <Routes>
                    <Route path={'/register'} element={<RegisterComponent/>}/>
                    <Route path={'/login'} element={<LoginComponent/>}/>
                    <Route path={'/'} element={<PostList/>}/>
                    <Route path="/" element={<PrivateRoute/>}>
                        <Route path={'/user/detail/:id'} element={<DetailComponent/>}/>
                        <Route path={'/account/change-password/:username'} element={<UpdateAccountComponent/>}/>
                        {/* Thêm các route khác cần bảo vệ ở đây */}
                    </Route>
                </Routes>

            </main>
            <FooterComponent/>
        </div>
    );
}
export default App;