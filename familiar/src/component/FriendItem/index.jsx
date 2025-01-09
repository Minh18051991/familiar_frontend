import { Link } from "react-router-dom";
import styles from "./FriendItem.module.css";
import { useState } from "react";
import DeleteFriendModal from "./DeleteFriendModal";

export function FriendItem({userData, handleIsLoading, updateUsers}) {
  const [friendship, setFriendship] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);


  const handleShowModal = (userData) => {
    setFriendship(userData);
    setIsShowModal(prevState => !prevState);
  }

  const handleCloseModal = () => {
    setIsShowModal(prev => !prev);
  }

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

        <button onClick={() => (handleShowModal(userData))} className={styles.actionBtn}>
          Xoá bạn bè
        </button>
        <Link  className={styles.actionBtn} to={`/users/detail/${userData.userId}`}>Xem chi tiết</Link>
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
