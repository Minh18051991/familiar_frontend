import React from 'react';
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
import UpdateAccountComponent from "./component/account/UpdateAccountComponent";
import DashboardComponent from "./component/dashboard/DashboardComponent";
import ListFriendShipComponent from "./component/friendship/list";
import UserFriendsComponent from "./component/user/UserFriendsComponent";
import FriendRequestList from "./component/friendship/FriendRequestList";
import SearchResultsPage from "./pages/SearchResultsPage";
import ForgerPasswordModal from "./component/forgetPassword/ForgerPasswordModal";
import TermsOfService from "./component/termsOfService/TermsOfService";
import PrivacyPolicy from "./component/privacyPolicy/PrivacyPolicy";
import AboutUs from "./component/aboutUs/AboutUs";
import MutualFriendList from "./component/friendship/MutualFriendList";


function App() {

    return (
        <div className={styles.appContainer}>
            <HeaderComponent/>
            <ToastContainer autoClose={500}/>
            <main className={styles.mainContent}>
                <Routes>
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path={'/register'} element={<RegisterComponent/>}/>
                    <Route path={'/login'} element={<LoginComponent/>}/>
                    <Route path={'/forget-password'} element={<ForgerPasswordModal/>}/>
                    <Route path={'/account/change-password/:username'} element={<UpdateAccountComponent/>}/>

                    <Route path="/" element={<PrivateRoute/>}>
                        <Route index element={<DashboardComponent/>}/>
                        <Route path={'/user/detail/:id'} element={<DetailComponent/>}/>

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

                        <Route
                            path={`/friends/mutual-list/:id`}
                            element={<MutualFriendList/>}
                        ></Route>

                    </Route>
                </Routes>
            </main>
            {/*<FooterComponent/>*/}
        </div>
    );
}

export default App;
