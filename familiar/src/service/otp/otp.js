import axios from 'axios';

export const sendOtp = async (username) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:8080/api/otp/enter-otp`, username, {
            headers: {Authorization: `Bearer ${token}`}
        });
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};


// Hàm mới để bắt đầu quá trình quên mật khẩu
export const initiatePasswordReset = async (email) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/forget-password/generate-token`, {email: email });
        return response.data; // Giả sử response.data chứa { token: 'temporary_token' }
    } catch (error) {
        console.error("Error initiating password reset:", error);
        throw error;
    }
};


export const sendOtpToEmail = async (email, tempToken) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/otp/enter-otp-by-email`,
            { email:email },
            { headers: { Authorization: `Bearer ${tempToken}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending OTP to email:", error);
        throw error;
    }
};



export const verifyOtp = async (username) => {
    try {
        let token = '';
        if (localStorage.getItem('token')) {
            token = localStorage.getItem('token');

        }else {
            token = localStorage.getItem('resetPasswordToken');
        }



        const  response = await axios.post(`http://localhost:8080/api/otp/confirm-otp`, username, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        return false;
    }

}