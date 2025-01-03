import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Đã thay đổi URL để phù hợp với json-server

export const getIcons = async () => {
  const response = await axios.get(`${API_URL}/icons`);
  return response.data;
};