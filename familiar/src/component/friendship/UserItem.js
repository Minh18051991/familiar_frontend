import React, { useEffect, useState } from "react";
import customStyles from "./ListFriendShip.module.css";
import styles from "../user/userDetail.module.css";
import { Link } from "react-router-dom";
import { acceptFriendship, cancelFriendship, mutualFriendList } from "../../service/friendship/friendshipService";
import { useSelector } from "react-redux";
import MutualFriends from "./MutualFriends";

export default function UserItem({ user, setListFriend }) {
    const userId1 = useSelector((state) => state.user.account.userId);
    const [mutualFriends, setMutualFriends] = useState([]);

    const handleConfirm = async (friendId) => {
        await acceptFriendship(friendId, userId1);
        setListFriend((prevList) =>
            prevList.filter((friend) => friend.userId !== friendId)
        );
    };

    const handleDelete = async (friendId) => {
        await cancelFriendship(friendId, userId1);
        setListFriend((prevList) =>
            prevList.filter((friend) => friend.userId !== friendId)
        );
    };

    // Lấy danh sách bạn chung
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await mutualFriendList(userId1, user.userId, 0, 5);
                setMutualFriends(data || []);
            } catch (error) {
                console.error("Error fetching mutual friends:", error);
                setMutualFriends([]);
            }
        };
        fetchData();
    }, [userId1, user.userId]);

    return (
        <div key={user.userId} className={`${customStyles.requestItem} shadow-sm border-light hoverShadow`}>
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
                {/* Hiển thị danh sách bạn chung */}
                <div className={customStyles.mutualFriends}>
                    <MutualFriends mutualFriends={mutualFriends}/>
                </div>
                {/* Các nút chấp nhận và hủy kết bạn */}
                <div className= "d-flex justify-content-center mt-3">
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
    );
}
