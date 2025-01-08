import {checkLogin} from "../../service/account/account";
import {purgeStore} from "./Store";


export function login(loginInfo) {
    return async (dispatch) => {
        console.log("--loGIN")
        const account = await checkLogin(loginInfo);
        if (account != null) {
            localStorage.setItem('token', account.token);
            localStorage.setItem('userId', account.userId);
            dispatch({
                type: 'LOGIN',
                payload: {
                    username: account.username,
                    role: account.role,
                    profilePictureUrl: account.profilePictureUrl,
                    userId: account.userId,
                    gender: account.gender
                }
            });
            console.log("Login thành công", account.userId);
            return true;
        } else {
            console.log("Tài khoản không tồn tại");
            return false;
        }
    }
}

export function logout() {
    return (dispatch) => {
        // Xóa token từ localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        purgeStore()

        dispatch({type: 'LOGOUT'});
    };
}

export function updateAvatar(newAvatarUrl) {
    return {
        type: 'UPDATE_AVATAR',
        payload: newAvatarUrl
    }
}