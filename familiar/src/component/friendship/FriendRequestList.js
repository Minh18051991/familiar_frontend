import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  acceptFriendship,
  cancelFriendship,
  friendRequestList,
} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import customStyles from "./ListFriendShip.module.css";
import { Link } from "react-router-dom";

function FriendRequestList() {
  const [listFriend, setListFriend] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const userId = useSelector((state) => state.user.account.userId);

  useEffect(() => {
    const fetchData = async () => {
      const { data, totalPages } = await friendRequestList(userId, page, size);
      setListFriend((prevList) => [...prevList, ...data]);
      setTotalPages(totalPages);
      setHasMore(page < totalPages - 1);
    };
    fetchData();
  }, [userId, page, size]);

  const handleConfirm = async (friendId) => {
    await acceptFriendship(friendId, userId);
    // Cập nhật lại danh sách sau khi chấp nhận lời mời
    setListFriend((prevList) =>
        prevList.filter((friend) => friend.userId !== friendId)
    );
  };

  const handleDelete = async (friendId) => {
    await cancelFriendship(friendId, userId);
    // Cập nhật lại danh sách sau khi xoá bạn
    setListFriend((prevList) =>
        prevList.filter((friend) => friend.userId !== friendId)
    );
  };

  const handleMore = async () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Chuyển sang trang tiếp theo
    }
  };

  return (
      <>
        <h5
            className={`${styles.suggestedFriendsTitle} mb-3 text-primary text-center`}
            style={{ marginTop: "15px" }}
        >
          Lời mời kết bạn
        </h5>
        <div className="container">
          {listFriend && listFriend.length > 0 ? (
              <div className={customStyles.listFriendContainer}>
                {listFriend.map((user) => (
                    <div
                        key={user.userId}
                        className={`${customStyles.requestItem} shadow-sm border-light hoverShadow`}
                    >
                      <div className={`${styles.cardBody} text-center`}>
                        <div className={customStyles.topContent}>
                          <img
                              src={user?.userProfilePictureUrl}
                              alt="Friend Avatar"
                              className={`${styles.friendAvatar} mb-3`}
                          />
                          <Link to={`/users/detail/${user.userId}`} style={{ textDecoration: "none" }}>
                            <p className="mx-2" style={{ color: "black", fontWeight: 500 }}>
                              {user?.userFirstName} {user?.userLastName}
                            </p>
                          </Link>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                          <button
                              className="btn btn-primary btn-sm me-2 px-4"
                              onClick={() => handleConfirm(user.userId)}
                          >
                            Chấp nhận
                          </button>
                          <button
                              className="btn btn-outline-secondary btn-sm px-4"
                              onClick={() => handleDelete(user.userId)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center mt-5">
                <h5>Không có lời mời kết bạn nào.</h5>
                <p>Hãy kiểm tra lại sau nhé!</p>
              </div>
          )}
          {hasMore && (
              <div className="text-center mt-3">
                <button className="btn btn-light" onClick={handleMore}>
                  Xem thêm
                </button>
              </div>
          )}
        </div>
      </>
  );
}

export default FriendRequestList;
