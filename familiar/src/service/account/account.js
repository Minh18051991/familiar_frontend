import axios from "axios";

import { API_URL } from "../url/API_URL";
export async function checkLogin(loginInfo) {
    console.log(loginInfo)
    try {

        const response = await axios.post(API_URL+'/api/auth/login',loginInfo)
        const account = response.data;
        if (account != null) {
            return account;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function createAccount(account) {

    try {
        await axios.post(API_URL+'/api/register/account/create', account);
        return true; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        return false
    }
}



export async function checkUsernameExists(username) {
    try {
        const response = await axios.post(API_URL+'/api/register/account/check-username',username);
        return response.data;
    } catch (error) {
        console.error("Error checking username:", error);
        return false;
    }
}


export async function updatePassword(account) {
    try {
        let token = '';
        if (localStorage.getItem('token')) {
            token = localStorage.getItem('token');

        }else {
            token = localStorage.getItem('resetPasswordToken');
        }
        await axios.post(API_URL+'/api/account/change-password', account,{headers: { Authorization: `Bearer ${token}` }  });
        return true; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        return false
    }
}

