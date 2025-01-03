import './App.css';
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
import PostList from "./components/post/PostList";


function App() {
  return (
    <>
      <HeaderComponent/>
        <ToastContainer autoClose={1000}/>
      <Routes>

        <Route path={'/register'} element={<RegisterComponent/>}/>
        <Route path={'/account'} element={<LoginComponent/>}/>
          <Route path={'/'} element={<HomeComponent/>}/>

          <Route path="/" element={<PrivateRoute />}>
              <Route path={'/user/detail/:id'} element={<DetailComponent/>}/>
              {/* Thêm các route khác cần bảo vệ ở đây */}
          </Route>
      </Routes>
        <PostList/>
    </>
  );
}

export default App;