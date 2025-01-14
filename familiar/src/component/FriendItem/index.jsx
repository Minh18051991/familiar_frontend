import { Link } from "react-router-dom";
import styles from "./FriendItem.module.css";
import React, {useEffect, useState} from "react";
import DeleteFriendModal from "./DeleteFriendModal";
import {useSelector} from "react-redux";
import {mutualFriendList} from "../../service/friendship/friendshipService";
import customStyles from "../friendship/ListFriendShip.module.css";
import MutualFriends from "../friendship/MutualFriends";

export function FriendItem({userData, handleIsLoading, updateUsers}) {
  const [friendship, setFriendship] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);

  const userId = useSelector((state) => state.user.account.userId);
  const [mutualFriends, setMutualFriends] = useState([]);


  const handleShowModal = (userData) => {
    setFriendship(userData);
    setIsShowModal(prevState => !prevState);
  }

  const handleCloseModal = () => {
    setIsShowModal(prev => !prev);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await mutualFriendList(userId, userData.userId, 0, 5);
        setMutualFriends(data || []);
      } catch (error) {
        console.error("Error fetching mutual friends:", error);
        setMutualFriends([]);
      }
    };
    fetchData();
  }, [userId, userData.userId]);


  return (
    <div className={styles.wrapper}>
      <div className={styles.imageContainer}>
        <img
          src={
            userData?.userProfilePictureUrl ||
            "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
          }
          alt=""
        />
      </div>

      <div className={styles.content}>
        <p className={styles.userName}>
          {userData?.userFirstName} {userData?.userLastName}
        </p>

        <div className={customStyles.mutualFriends}>
          <MutualFriends mutualFriends={mutualFriends} friendId={userData.userId}/>
        </div>

        <button onClick={() => (handleShowModal(userData))} className={styles.actionBtn}>
          Xoá bạn bè
        </button>
        <Link className={styles.actionBtn} to={`/users/detail/${userData.userId}`}>Xem chi tiết</Link>
      </div>


      <DeleteFriendModal
          isShowModal={isShowModal}
          friendship={friendship}
          handleCloseModal={handleCloseModal}
            handleIsLoading={handleIsLoading}
            updateUsers={updateUsers}
        />
    </div>
  );
}
