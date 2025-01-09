import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {findUserById} from "../../service/user/userService";
import {suggestedFriendsListPage} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import {useSelector} from "react-redux";
import Friends from "./Friends";
import UserPosts from "./UserPosts";
import DetailUser from "./DetailUser";

function UserFriendsComponent() {
    const [user, setUser] = useState({});
    const {id} = useParams();
    const [friendList, setFriendList] = useState([]);
    const [isFriend, setIsFriend] = useState(true);
    const userId = useSelector(state => state.user.account.userId);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    {/* Thông tin người dùng */}
                        <DetailUser user={user} userId={userId} />

                    {/* Danh sách gợi ý bạn bè */}
                    <div className="col-12 col-md-8 order-md-2">
                        <div>
                            {
                                friendList.length > 0 && <div>
                                    <div className={`${styles.card} shadow-lg rounded-4 border-0`}>
                                        <div className={`${styles.cardBody}`}>
                                            <h5 className={`${styles.suggestedFriendsTitle} mb-3 text-primary`}>Gợi ý kết
                                                bạn?</h5>
                                            <div className="row">
                                                {friendList.map((friend, index) => (
                                                    <Friends friend={friend} col={3}
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
                            <div className="container my-4">
                                <div className={`${styles.suggestedFriendsTitle} mb-3 text-primary`}
                                     style={{color: "#1877f2"}}>
                                    Bài viết
                                </div>
                            </div>
                            <UserPosts userId={id}/>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default UserFriendsComponent;