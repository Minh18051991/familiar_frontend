import axios from "axios";
import { API_URL } from "../url/API_URL";
export async function findUserById(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/users/${id}`,{headers: {Authorization: `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        console.log("Lỗi:" + error.message);
    }
}