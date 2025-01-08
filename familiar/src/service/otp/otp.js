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

export const verifyOtp = async (username) => {
    try {
        const token = localStorage.getItem('token');
        const  response = await axios.post(`http://localhost:8080/api/otp/confirm-otp`, username, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        return false;
    }

}