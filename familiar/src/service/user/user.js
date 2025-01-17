import axios from "axios";


import { API_URL } from "../url/API_URL";

export async function getUserById(userId) {
    const token = localStorage.getItem('token');
    console.log("token: ", token)

    if (!token) {
        console.error("No token found");
        return { error: "Không tìm thấy token xác thực" };
    }

    try {
        console.log("--GET USER BY ID");

        const response = await axios.get(`${API_URL}/api/user/detail/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data;
        console.log(userData);

        return userData || null;
    } catch (error) {
        console.error("Error fetching user data:", error);

        if (error.response) {
            // Lỗi từ server
            if (error.response.status === 401) {
                return { error: "Không có quyền truy cập. Vui lòng đăng nhập lại." };
            }
            return { error: error.response.data.message || "Lỗi từ server" };
        } else if (error.request) {
            // Lỗi không nhận được phản hồi
            return { error: "Không thể kết nối đến server" };
        } else {
            // Lỗi khác
            return { error: "Đã xảy ra lỗi khi lấy thông tin người dùng" };
        }
    }
}

export const updateUser = async (userId, updatedData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(API_URL+`/api/user/update/${userId}`, updatedData,{
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export async function createUser(user) {

    try {

        const response = await axios.post(API_URL+'/api/user/create',user)
        const userReponse = response.data;
        if (userReponse != null) {
            return userReponse;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function checkEmailExists(email) {
    try {
        const response = await axios.post(API_URL+'/api/user/checkEmail', email);
        return response.data;
    } catch (error) {
        console.error("Error checking username:", error);
        return false;
    }
}


export async function searchUsers(keyword, page = 0, size = 10) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error("No token found");
        return { error: "Không tìm thấy token xác thực" };
    }

    try {
        console.log("--SEARCH USERS");

        const response = await axios.get(`${API_URL}/api/user/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                keyword: keyword,
                page: page,
                size: size
            }
        });

        const usersData = response.data;
        console.log(usersData);

        return usersData;
    } catch (error) {
        console.error("Error searching users:", error);

        if (error.response) {
            if (error.response.status === 401) {
                return { error: "Không có quyền truy cập. Vui lòng đăng nhập lại." };
            }
            return { error: error.response.data.message || "Lỗi từ server" };
        } else if (error.request) {
            return { error: "Không thể kết nối đến server" };
        } else {
            return { error: "Đã xảy ra lỗi khi tìm kiếm người dùng" };
        }
    }
}

export async function getAllUsers(page = 0, size = 20,name='') {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("No token found");
        return { error: "Không tìm thấy token xác thực" };
    }

    try {
        const response = await axios.get(`${API_URL}/api/user/list`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size ,name}
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response) {
            if (error.response.status === 401) {
                return { error: "Không có quyền truy cập. Vui lòng đăng nhập lại." };
            }
            return { error: error.response.data.message || "Lỗi từ server" };
        } else if (error.request) {
            return { error: "Không thể kết nối đến server" };
        } else {
            return { error: "Đã xảy ra lỗi khi lấy danh sách người dùng" };
        }
    }
}

export async function deleteUser(userId) {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/api/user/delete/${userId}`, null,{headers: { Authorization: `Bearer ${token}` }})
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}
