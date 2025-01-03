import axios from "axios";

export async function findUserById(id) {
    try {
        const response = await axios.get(`http://localhost:8080/api/users/${id}`);
        return response.data;
    } catch (error) {
        console.log("Lỗi:" + error.message);
    }
}