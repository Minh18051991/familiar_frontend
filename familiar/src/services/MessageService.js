import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const API_URL = 'http://localhost:8080/api/messages';
const SOCKET_URL = 'http://localhost:8080/ws';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleError = (error) => {
  if (error.response) {
    console.error("Server responded with error:", error.response.data);
    return error.response.data;
  } else if (error.request) {
    console.error("No response received:", error.request);
    return { message: "No response from server" };
  } else {
    console.error("Error setting up request:", error.message);
    return { message: "Error setting up request" };
  }
};

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    connectHeaders: {},
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    console.log('WebSocket Connection Established');
    
    // Subscribe to receive messages for the specific user
    stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      onMessageReceived(receivedMessage);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('WebSocket Connection Error:', frame.headers['message']);
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
    console.log('WebSocket Disconnected');
  }
};

export const sendMessageRealTime = (message) => {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.active) {
      console.log('Attempting to send message:', message);
      stompClient.publish({
        destination: "/app/chat.private", // Đảm bảo đây là endpoint chính xác trên server
        body: JSON.stringify(message),
        headers: {},
        skipContentLengthHeader: true,
      });
      console.log('Message sent successfully');
      resolve(true);
    } else {
      console.error('WebSocket is not connected or not active. Unable to send message.');
      reject(new Error('WebSocket is not connected or not active'));
    }
  });
};

export const createMessage = async (messageDTO) => {
  try {
    const response = await axiosInstance.post('', messageDTO);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMessageById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateMessage = async (id, messageDTO) => {
  try {
    const response = await axiosInstance.put(`/${id}`, messageDTO);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteMessage = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const getMessagesBetweenUsers = async (user1Id, user2Id, page = 0, size = 20) => {
  try {
    const response = await axiosInstance.get('/between', {
      params: { user1Id, user2Id, page, size },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export default {
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
  getMessagesBetweenUsers,
  connectWebSocket,
  disconnectWebSocket,
  sendMessageRealTime
};