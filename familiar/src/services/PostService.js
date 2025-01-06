import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';

class PostService {
    getAllPosts(page = 0, size = 10) {
        return axios.get(`${API_URL}?page=${page}&size=${size}`, {
            headers: this.authHeader(),
            withCredentials: true
        });
    }

    createPost(postData, files) {
        const formData = new FormData();
        formData.append('post', JSON.stringify(postData));
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }
        console.log(formData)
        console.log("----------")
        const headers = this.authHeader();
        console.log('Headers:', headers);
        return axios.post(API_URL, formData, {
            headers: {
                ...this.authHeader(),
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
    }

    getPostById(id) {
        return axios.get(`${API_URL}/${id}`, {
            headers: this.authHeader(),
            withCredentials: true
        });
    }

    updatePost(id, postData) {
        return axios.put(`${API_URL}/${id}`, postData, {
            headers: {
                ...this.authHeader(),
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
    }

    deletePost(id) {
        return axios.delete(`${API_URL}/${id}`, {
            headers: this.authHeader(),
            withCredentials: true
        });
    }

    getPostsByUserId(userId, page = 0, size = 10) {
        return axios.get(`${API_URL}/user/${userId}?page=${page}&size=${size}`, {
            headers: this.authHeader(),
            withCredentials: true
        });
    }

    authHeader() {
        const token = localStorage.getItem('token');
        console.log('token from local storage is: ', token);        if (token) {
            return {
                'Authorization': `Bearer ${token}`
            };
        } else {
            return {};
        }
    }
}

export default new PostService();