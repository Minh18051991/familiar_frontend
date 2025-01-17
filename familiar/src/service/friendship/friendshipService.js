import axios from "axios";

import { API_URL } from "../url/API_URL";
export async function getFriendShips(userId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    API_URL + `/api/friendships/list/${userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response?.data;
}

export async function searchNameFriendship(userId, searchName) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      API_URL + `/api/friendships/search/${userId}?name_like=${searchName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function sendFriendship(userId1, userId2) {
  const token = localStorage.getItem("token");
  console.log("++++++++++++++++++");
  console.log(token);
  try {
    const response = await axios.post(
      API_URL + `/api/friendships/send/${userId1}/${userId2}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function deleteFriendship(userId1, userId2) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(
      API_URL + `/api/friendships/delete/${userId1}/${userId2}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function acceptFriendship(userId1, userId2) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      API_URL + `/api/friendships/accept/${userId1}/${userId2}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function cancelFriendship(userId1, userId2) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      API_URL + `/api/friendships/cancel/${userId1}/${userId2}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function suggestedFriendsListPage(userId1, userId2, page, size) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      API_URL + `/api/friendships/suggestions-page/${userId1}/${userId2}?_page=${page}&_limit=${size}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = response.data.content;
    const totalPages = response.data.totalPages;
    return {
      data: data,
      totalPages: totalPages,
    };
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function friendRequestList(userId, page, size) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      API_URL + `/api/friendships/request/${userId}?_page=${page}&_limit=${size}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = response.data.content;
    const totalPages = response.data.totalPages;
    const totalElements = response.data.totalElements;
    return {
      data: data,
      totalPages: totalPages,
      totalElements: totalElements,
    };
  } catch (error) {
    console.log("Loi:" + error.message);
  }
}

export async function getFriendShipStatus(userId1, userId2) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      API_URL + `/api/friendships/status/${userId1}/${userId2}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("Loi:" + error.message);
  }
}

export async function mutualFriendList(userId1, userId2, page, size) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      API_URL + `/api/friendships/mutual/${userId1}/${userId2}?_page=${page}&_limit=${size}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = response.data.content;
    const totalPages = response.data.totalPages;
    const totalElements = response.data.totalElements;
    return {
      data: data,
      totalPages: totalPages,
      totalElements: totalElements,
    };
  } catch (error) {
    console.log("Loi:" + error.message);
  }
}

export async function getMutualFriends(userId1, userId2, page, size) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    API_URL + `/api/friendships/mutual/${userId1}/${userId2}?_page=${page}&_limit=${size}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response?.data;
}
