import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {acceptFriendship, cancelFriendship, friendRequestList} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import {Link} from "react-router-dom";

function FriendRequestHome() {
    const [listFriend, setListFriend] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const userId = useSelector(state => state.user.account.userId);

    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPages} = await friendRequestList(userId, page, size);
            setListFriend(data);
        }
        fetchData()
    }, [userId, page, size]);

    const handleConfirm = (friendId) => {
        const fetchData = async () => {
            await acceptFriendship(friendId, userId);
            const list = await friendRequestList(userId);
            setListFriend(list);
        }
        fetchData();
    }

    const handleDelete = (friendId) => {
        const fetchData = async () => {
            await cancelFriendship(friendId, userId);
            const list = await friendRequestList(userId);
            setListFriend(list)
        }
        fetchData();
    }

    useEffect(() => {
        // Kiểm tra nếu page đạt totalPages - 1 thì cập nhật lại hasMore
        if (page >= totalPages - 1) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }
    }, [page, totalPages]);

    const handleMore = () => {
        if (page < totalPages - 1) {
            setPage(prevPage => prevPage + 1);
        }
    }
    return (
        <>
            <h5 className={`${styles.suggestedFriendsTitle} mb-3 text-primary text-center`} style={{marginTop: "10px"}}>Lời mời kết bạn</h5>
            {listFriend && listFriend.length > 0 ? (
                <div>

                    {listFriend.map((user) => (
                        <div className={`${styles.card} shadow-sm border-light hoverShadow`}>
                            <div className={`${styles.cardBodyHome} text-center pb-2 pt-0`}>
                                <div className="d-flex m-0">
                                    <img
                                        src={user?.userProfilePictureUrl}
                                        alt="Friend Avatar"
                                        className={`${styles.friendAvatarHome}`}
                                    />
                                    <Link to={`/users/detail/${user.userId}`} style={{textDecoration: 'none'}}>
                                        <p className="mx-2" style={{color: 'black'}}>
                                            {user?.userFirstName} {user?.userLastName}
                                        </p>
                                    </Link>
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

                    ))}
                    <div className="d-flex justify-content-end mt-1">
                        <Link className="" to={'/friendships/request'} style={{textDecoration: 'none'}}>
                            Xem tất cả
                        </Link>
                    </div>
                </div>

            ) : (
                <div className="text-center mt-5">
                    <h5>Không có lời mời kết bạn nào.</h5>
                    <p>Hãy kiểm tra lại sau nhé!</p>
                </div>
            )}
        </>

    );
}

export default FriendRequestHome;