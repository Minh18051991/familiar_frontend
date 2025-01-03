import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import {Route, Routes} from "react-router-dom";
import ListFriendShipComponent from "./component/friendship/list";
import UserDetailComponent from "./component/user/UserDetailComponent";
import NavbarApp from "./component/layout/NavbarApp";
import {FooterApp} from "./component/layout/FooterApp";

function App() {
    return (

        <>
            <NavbarApp/>
            <Routes>
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
