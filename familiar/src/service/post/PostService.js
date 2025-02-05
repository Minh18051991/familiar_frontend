import axios from 'axios';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from '../../firebaseConfig';
import { API_URL as host } from "../url/API_URL";
const API_URL = `${host}/api/posts`;

class PostService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_URL
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            if (userId) {
                config.headers['User-Id'] = userId;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    getAllPosts(page = 0, size = 5) {
        return this.axiosInstance.get('', {
            params: {page, size}
        });
    }

    async createPost(postData, files) {
        try {
            const attachmentUrls = await this.uploadFiles(files);
            const formData = {
                ...postData,
                attachmentUrls: attachmentUrls
            };
            console.log('FormData sending :', formData);
            const response = await this.axiosInstance.post('', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async uploadFiles(files) {
        const urls = [];
        for (const file of files) {
            const storageRef = ref(storage, 'posts/' + file.name);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            urls.push(url);
        }
        return urls;
    }

    getPostById(id) {
        return this.axiosInstance.get(`/${id}`);
    }

    updatePost(id, postData) {
        return this.axiosInstance.put(`/${id}`, postData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    deletePost(id) {
        return this.axiosInstance.delete(`/${id}`);
    }

    getPostsByUserId(userId, page = 0, size = 5) {
        return this.axiosInstance.get(`/user/${userId}`, {
            params: {page, size}
        });
    }
}

export default new PostService();