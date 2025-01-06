import {checkLogin} from "../../service/account/account";


export function login(loginInfo){
    return async (dispatch) => {
        console.log("--loGIN")
        const account = await checkLogin(loginInfo);
        if(account!= null){
            localStorage.setItem('token', account.token);
            localStorage.setItem('userId', account.userId);
            dispatch({
                type: 'LOGIN',
                payload: {
                    username: account.username,
                    role: account.role,
                    profilePictureUrl: account.profilePictureUrl,
                    userId: account.userId
                }
            });
            console.log("Login thành công", account.userId);
            return true;
        }else {
            console.log("Tài khoản không tồn tại");
            return false;
        }
    }
}

export function logout(){
    localStorage.removeItem('token');
    return {
        type: 'LOGOUT',
        payload: null
    }
}