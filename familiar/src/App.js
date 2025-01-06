
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import {Route, Routes} from "react-router-dom";
import ListFriendShipComponent from "./component/friendship/list";
import UserDetailComponent from "./component/user/UserDetailComponent";
import NavbarApp from "./component/layout/NavbarApp";
import {FooterApp} from "./component/layout/FooterApp";
import LoginComponent from "./component/login/LoginComponent";
import HomeComponent from "./component/login/HomeComponent";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import RegisterComponent from "./component/register/RegisterComponent";
import {ToastContainer} from "react-toastify";
import DetailComponent from "./component/user/DetailComponent";
import PrivateRoute from "./component/login/PrivateRoute";
import HeaderComponent from "./component/header/HeaderComponent";


function App() {
  return (
    <>
        <HeaderComponent/>
        <ToastContainer autoClose={1000}/>
      <Routes>

        <Route path={'/register'} element={<RegisterComponent/>}/>
        <Route path={'/login'} element={<LoginComponent/>}/>
          <Route path={'/'} element={<HomeComponent/>}/>

          <Route path="/" element={<PrivateRoute />}>
              <Route path={'/user/detail/:id'} element={<DetailComponent/>}/>
              {/* Thêm các route khác cần bảo vệ ở đây */}
          </Route>
          <Route
              path="/friendships-list"
              element={<ListFriendShipComponent/>}
          ></Route>
          <Route
              path="/users/detail/:id"
              element={<UserDetailComponent/>}
          ></Route>
      </Routes>
        <FooterApp/>
    </>
  );
}

export default App;
