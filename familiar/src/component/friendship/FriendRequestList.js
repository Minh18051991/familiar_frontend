import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {acceptFriendship, cancelFriendship, friendRequestList} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";

function FriendRequestList() {
    const [listFriend, setListFriend] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const userId = useSelector(state => state.user.account.userId);

    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPages} = await friendRequestList(userId, page, size);
            setListFriend(prevList => [...prevList, ...data]);
            setTotalPages(totalPages)
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
            <h5 className={`${styles.suggestedFriendsTitle} mb-3 text-primary text-center`}>Lời mời kết bạn</h5>
            <div className="container">
                {listFriend && listFriend.length > 0 ? (
                    <div className="row">
                        {listFriend.map((user) => (
                            <div className={`col-12 col-sm-6 col-md-3 mb-3`}>
                                <div className={`${styles.card} shadow-sm border-light hoverShadow`}>
                                    <div className={`${styles.cardBody} text-center`}>
                                        <img
                                            src={user?.userProfilePictureUrl}
                                            alt="Friend Avatar"
                                            className={`${styles.friendAvatar} mb-3`}
                                        />
                                        <p className="card-title mb-2">{user?.userFirstName} {user?.userLastName}</p>
                                        <div className="d-flex justify-content-center mt-3">
                                            <button className="btn btn-primary btn-sm me-2 px-4"
                                                    onClick={() => handleConfirm(user.userId)}>
                                                Chấp nhận
                                            </button>
                                            <button className="btn btn-outline-secondary btn-sm px-4"
                                                    onClick={() => handleDelete(user.userId)}>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                        {hasMore && (
                            <div className="text-center mt-3">
                                <button
                                    className="btn btn-light"
                                    onClick={handleMore}
                                >
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center mt-5">
                        <h5>Không có lời mời kết bạn nào.</h5>
                        <p>Hãy kiểm tra lại sau nhé!</p>
                    </div>
                )}
            </div>
        </>

    );
}

export default FriendRequestList;