import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  friendRequestList,
} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import customStyles from "./ListFriendShip.module.css";
import UserItem from "./UserItem";

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

  const handleMore = async () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
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
                    <UserItem user={user} setListFriend={setListFriend}/>
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
