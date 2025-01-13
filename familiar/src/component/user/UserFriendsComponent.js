import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findUserById } from "../../service/user/userService";
import { suggestedFriendsListPage } from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import { useSelector } from "react-redux";
import Friends from "./Friends";
import UserPosts from "./UserPosts";
import DetailUser from "./DetailUser";

function UserFriendsComponent() {
    const [user, setUser] = useState({});
    const { id } = useParams();
    const [friendList, setFriendList] = useState([]);
    const userId = useSelector((state) => state.user.account.userId);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    // Khi id thay đổi, reset danh sách bạn bè và trang
    useEffect(() => {
        setFriendList([]);
        setPage(0);
    }, [id]);

    // Lấy danh sách bạn bè gợi ý
    useEffect(() => {
        const fetchFriendships = async () => {
            const friendId = id;

            try {
                const { data, totalPages } = await suggestedFriendsListPage(
                    userId,
                    friendId,
                    page,
                    size
                );

                setTotalPages(totalPages);

                if (Array.isArray(data)) {
                    const updateList = data.map((friend) => ({
                        ...friend,
                        isFriend: false,
                    }));

                    setFriendList((prevList) => [...prevList, ...updateList]);
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

    // Kiểm tra trạng thái trang cuối
    useEffect(() => {
        setHasMore(page < totalPages - 1);
    }, [page, totalPages]);

    // Xử lý chuyển sang trang tiếp theo
    const handleMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // Xử lý quay lại trang đầu
    const handleGoToFirstPage = () => {
        setPage(0);
        setFriendList([]);
    };

    // Lấy thông tin người dùng
    useEffect(() => {
        const fetchUser = async () => {
            const user = await findUserById(id);
            setUser(user);
        };
        fetchUser();
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5" key={id}>
            <div className="row">
                {/* Thông tin người dùng */}
                <DetailUser user={user} userId={userId} />

                {/* Danh sách gợi ý bạn bè */}
                <div className="col-12 col-md-8 order-md-2">
                    {friendList.length > 0 && (
                        <div>
                            <div className={`${styles.card} shadow-lg rounded-4 border-0`}>
                                <div className={`${styles.cardBody}`}>
                                    <h5 className={`${styles.suggestedFriendsTitle} mb-3 text-primary`}>
                                        Gợi ý kết bạn?
                                    </h5>
                                    <div className="row">
                                        {friendList.map((friend) => (
                                            <Friends
                                                key={friend.userId}
                                                friend={friend}
                                                col={3}
                                                userId={userId}
                                                setFriendList={setFriendList}
                                            />
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="text-center mt-3">
                                            {hasMore ? (
                                                <button
                                                    className="btn btn-light"
                                                    onClick={handleMore}
                                                >
                                                    Xem thêm
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-light"
                                                    onClick={handleGoToFirstPage}
                                                >
                                                    Trang đầu
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="container my-4">
                        <div className={`${styles.suggestedFriendsTitle} mb-3 text-primary`} style={{ color: "#1877f2" }}>
                            Bài viết
                        </div>
                    </div>
                    <UserPosts userId={id} />
                </div>
            </div>
        </div>
    );
}

export default UserFriendsComponent;
