import axios from "axios";

export async function findUserById(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:8080/api/users/${id}`,{headers: {Authorization: `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        console.log("Lỗi:" + error.message);
    }
}