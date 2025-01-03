import axios from "axios";

export async function getFriendShips(userId) {
  const response = await axios.get(
    `http://localhost:8080/api/friendships/list/${userId}`
  );
  return response?.data;
}

export async function searchNameFriendship(userId, searchName) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/friendships/search/${userId}?name_like=${searchName}`
    );
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function sendFriendship(userId1, userId2) {
  try {
    const response = await axios.post(`http://localhost:8080/api/friendships/send/${userId1}/${userId2}`);
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function deleteFriendship(userId1, userId2) {
  try {
    const response = await axios.delete(`http://localhost:8080/api/friendships/delete/${userId1}/${userId2}`);
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function acceptFriendship(userId1, userId2) {
  try {
    const response = await axios.put(`http://localhost:8080/api/friendships/accept/${userId1}/${userId2}`);
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}
export async function cancelFriendship(userId1, userId2) {
  try {
    const response = await axios.put(`http://localhost:8080/api/friendships/cancel/${userId1}/${userId2}`);
    return response.data;
  } catch (error) {
    console.log("loi:" + error.message);
  }
}

export async function suggestedFriendsList(userId1, userId2) {
  try {
    const response = await axios.get(`http://localhost:8080/api/friendships/suggestions/${userId1}/${userId2}`);
    return response.data;
  } catch (error) {
    console.log("Loi:" + error.message);
  }
}
