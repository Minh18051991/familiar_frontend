import React, {useEffect, useState} from "react";
import styles from "../user/userDetail.module.css";
import {Link} from "react-router-dom";
import {acceptFriendship, cancelFriendship, mutualFriendList} from "../../service/friendship/friendshipService";
import {useSelector} from "react-redux";
import customStyles from "./ListFriendShip.module.css";
import MutualFriends from "./MutualFriends";

export default function UserItemHome({user, setListFriend}) {

    const userId = useSelector(state => state.user.account.userId);
    const [mutualFriends, setMutualFriends] = useState([]);

    const handleConfirm = async (friendId) => {
        await acceptFriendship(friendId, userId);
        setListFriend((prevList) => prevList.filter((friend) => friend.userId !== friendId));
    };

    const handleDelete = async (friendId) => {
        await cancelFriendship(friendId, userId);
        setListFriend((prevList) => prevList.filter((friend) => friend.userId !== friendId));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await mutualFriendList(userId, user.userId, 0, 5);
                setMutualFriends(data || []);
            } catch (error) {
                console.error("Error fetching mutual friends:", error);
                setMutualFriends([]);
            }
        };
        fetchData();
    }, [userId, user.userId]);


    return (
        <>
            <div key={user.userId} className={`${styles.cardFriendRequestHome} shadow-sm border-light hoverShadow`}>
                <div className={`${styles.cardBodyHome} text-center pb-2 pt-0`}>
                    <div className="d-flex m-0">
                        <img
                            src={user?.userProfilePictureUrl}
                            alt="Friend Avatar"
                            className={`${styles.friendAvatarHome}`}
                        />
                        <Link to={`/users/detail/${user.userId}`} style={{textDecoration: 'none'}}>
                            <p className="mx-2" style={{color: 'black', fontWeight: 400}}>
                                {user?.userFirstName} {user?.userLastName}
                            </p>
                        </Link>
                    </div>

                    {/* Hiển thị danh sách bạn chung */}
                    <div className={customStyles.mutualFriends}>
                        <MutualFriends mutualFriends={mutualFriends}/>
                    </div>

                    <div className="d-flex justify-content-center m-0">
                        <button
                            className={`${styles.btnAvatarHome} btn btn-primary btn-sm me-2 px-1`}
                            onClick={() => handleConfirm(user.userId)}>
                            Chấp nhận
                        </button>
                        <button
                            className={`${styles.btnAvatarHome} btn btn-outline-secondary btn-sm px-2`}
                            onClick={() => handleDelete(user.userId)}>
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};