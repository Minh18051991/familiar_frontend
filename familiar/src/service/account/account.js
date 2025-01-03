import axios from "axios";


export async function checkLogin(loginInfo) {
    console.log(loginInfo)
    try {

        const response = await axios.post('http://localhost:8080/api/auth/login',loginInfo)
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
        await axios.post('http://localhost:8080/api/register/account/create', account);
        return true; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        return false
    }
}



export async function checkUsernameExists(username) {
    try {
        const response = await axios.post('http://localhost:8080/api/register/account/check-username',username);
        return response.data;
    } catch (error) {
        console.error("Error checking username:", error);
        return false;
    }
}