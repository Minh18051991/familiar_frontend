import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {findUserById} from "../../service/user/userService";
import {suggestedFriendsListPage} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import {useSelector} from "react-redux";
import DetailUserFriend from "./DetailUserFriend";
import PostService from "../../services/PostService";
import UserPosts from "./UserPosts";

function UserDetailComponent() {
    const [user, setUser] = useState({});
    const {id} = useParams();
    const [friendList, setFriendList] = useState([]);
    const [isFriend, setIsFriend] = useState(true);
    const userId = useSelector(state => state.user.account.userId);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const [listPost, setListPost] = useState([])

    useEffect(() => {
        const fetchFriendships = async () => {

            const friendId = id;

            try {
                const {data, totalPages} = await suggestedFriendsListPage(userId, friendId, page, size);

                setTotalPages(totalPages);

                if (Array.isArray(data)) {
                    const updateList = data.map(friend => ({
                        ...friend,
                        isFriend: false
                    }));
                    setFriendList(pre => [
                        ...pre,
                        ...updateList,
                    ]);
                } else {
                    setFriendList([]);
                }
            } catch (error) {
                console.error("Error fetching friendships:", error);
                setFriendList([]);
            }
        };

        fetchFriendships();
    }, [userId, id, page, size]);

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

    useEffect(() => {
        const fetchUser = async () => {
            const user = await findUserById(id);
            setUser(user);
        }
        fetchUser();
    }, [id])

    useEffect(() => {
        const fetchData = async () => {
            const friendId = id;
            const list = await PostService.getPostsByUserId(friendId);
            setListPost(list);
        }
        fetchData();
    }, [id]);


    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    {/* Thông tin người dùng */}
                    <div className="col-12 col-md-4 order-md-1">
                        <div className={`${styles.card} shadow-lg rounded-4 border-0 mb-4 hoverShadow`}>
                            <div className={`${styles.cardBody} text-center`}>
                                <img
                                    src={user.userProfilePictureUrl}
                                    alt="User Avatar"
                                    className={`${styles.userAvatar} mb-4`}
                                    style={{
                                        width: '180px',
                                        height: '180px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        border: '5px solid #007bff',
                                    }}
                                />
                                <h3 className={`${styles.userName} card-title mb-2`}>{user.userFirstName} {user.userLastName}</h3>
                                <p className={`${styles.userOccupation} text-muted mb-3`}>{user.userOccupation}</p>
                                <hr className="my-3"/>
                                <div className="text-start px-3">
                                    <div className={`${styles.userInfo} mb-3`}>
                                        <strong className="text-primary">🎂 Sinh nhật:</strong>
                                        <span className="ms-2">{formatDate(user.userDateOfBirth)}</span>
                                    </div>
                                    <div className={`${styles.userInfo} mb-3`}>
                                        <strong className="text-primary">👤 Giới tính:</strong>
                                        <span className="ms-2">{user.userGender}</span>
                                    </div>
                                    <div className={`${styles.userInfo} mb-3`}>
                                        <strong className="text-primary">📧 Email:</strong>
                                        <span className="ms-2">{user.userEmail}</span>
                                    </div>
                                    <div className={`${styles.userInfo} mb-3`}>
                                        <strong className="text-primary">🏠 Địa chỉ:</strong>
                                        <span className="ms-2">{user.userAddress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách gợi ý bạn bè */}
                    <div className="col-12 col-md-8 order-md-2">
                        <div>
                            {
                                friendList.length > 0 && <div>
                                    <div className={`${styles.card} shadow-lg rounded-4 border-0`}>
                                        <div className={`${styles.cardBody}`}>
                                            <h5 className={`${styles.suggestedFriendsTitle} mb-3 text-primary`}>Có thể bạn
                                                biết?</h5>
                                            <div className="row">
                                                {friendList.map((friend, index) => (
                                                    <DetailUserFriend friend={friend} col={3}
                                                                      userId={userId} setFriendList={setFriendList}/>
                                                ))}
                                            </div>
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
                                    </div>
                                </div>
                            }
                        </div>
                        <div>
                            Bài post
                            <UserPosts userId={id}/>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default UserDetailComponent;