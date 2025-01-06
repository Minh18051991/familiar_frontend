import {checkLogin} from "../../service/account/account";


export function login(loginInfo){
    return async (dispatch) => {
        console.log("--loGIN")
        const account = await checkLogin(loginInfo);
        if(account!= null){
            localStorage.setItem('token', account.token);
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