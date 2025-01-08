import React, {useState} from 'react';
import styles from './App.module.css';
import HeaderComponent from "./component/header/HeaderComponent";
import {Route, Routes} from "react-router-dom";
import LoginComponent from "./component/login/LoginComponent";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import RegisterComponent from "./component/register/RegisterComponent";
import {ToastContainer} from "react-toastify";
import DetailComponent from "./component/user/DetailComponent";
import PrivateRoute from "./component/login/PrivateRoute";
import FooterComponent from "./component/footer/FooterComponent";
import UpdateAccountComponent from "./component/account/UpdateAccountComponent";
import DashboardComponent from "./component/dashboard/DashboardComponent";
import ListFriendShipComponent from "./component/friendship/list";
import UserFriendsComponent from "./component/user/UserFriendsComponent";
import FriendRequestList from "./component/friendship/FriendRequestList";

function App() {

    return (
        <div className={styles.appContainer}>
            <HeaderComponent/>
            <ToastContainer autoClose={500}/>
            <main className={styles.mainContent}>
                <Routes>
                    <Route path={'/register'} element={<RegisterComponent/>}/>
                    <Route path={'/login'} element={<LoginComponent/>}/>
                    <Route path="/" element={<PrivateRoute/>}>
                        <Route index element={<DashboardComponent/>}/>
                        <Route path={'/user/detail/:id'} element={<DetailComponent/>}/>
                        <Route path={'/account/change-password/:username'} element={<UpdateAccountComponent/>}/>
                        {/* Thêm các route khác cần bảo vệ ở đây */}
                        <Route
                            path="/friendships-list"
                            element={<ListFriendShipComponent/>}
                        ></Route>
                        <Route
                            path="/users/detail/:id"
                            element={<UserFriendsComponent/>}
                        ></Route>
                        <Route
                            path="/friendships/request"
                            element={<FriendRequestList/>}
                        ></Route>
                    </Route>
                </Routes>
            </main>
            <FooterComponent/>
        </div>
    );
}

export default App;
