import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    deleteFriendship,
    mutualFriendList,
    sendFriendship
} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import customStyles from "./ListFriendShip.module.css";
import { Link, useParams } from "react-router-dom";
import MutualFriends from "./MutualFriends";

function MutualFriendList() {
    const [friendList, setFriendList] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const { id: userId2 } = useParams();
    const userId = useSelector((state) => state.user.account.userId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, totalPages } = await mutualFriendList(userId, userId2, page, size);
                const updatedData = data.map((friend) => ({
                    ...friend,
                    isRequestSent: false, // Mặc định chưa gửi yêu cầu
                }));
                setFriendList((prevList) => [...prevList, ...updatedData]);
                setTotalPages(totalPages);
                setHasMore(page < totalPages - 1);
            } catch (error) {
                console.error("Error fetching mutual friends:", error);
                alert("Đã xảy ra lỗi khi tải danh sách bạn bè!");
            }
        };

        fetchData();
    }, [userId, userId2, page, size]);

    const handleMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleFriendAction = async (friendId, isFriend, isRequestSent) => {
        try {
            let updatedFriendList;
            if (isFriend && isRequestSent) {
                // Gửi yêu cầu kết bạn
                await sendFriendship(userId, friendId);
                updatedFriendList = friendList.map((friend) =>
                    friend.userId === friendId ? { ...friend, isRequestSent: false } : friend
                );
            } else if (!isRequestSent) {
                // Hủy yêu cầu kết bạn
                await deleteFriendship(userId, friendId);
                updatedFriendList = friendList.map((friend) =>
                    friend.userId === friendId ? { ...friend, isRequestSent: true } : friend
                );
            } else if (!isFriend) {
                // Xóa bạn bè (đặt isFriend và isRequestSent thành false)
                await deleteFriendship(userId, friendId);
                updatedFriendList = friendList.map((friend) =>
                    friend.userId === friendId ? { ...friend, isFriend: true, isRequestSent: true } : friend
                );
            }

            // Cập nhật lại friendList sau khi xử lý
            setFriendList((prevList) => {
                return prevList.map((friend) =>
                    friend.userId === friendId ? { ...friend, ...updatedFriendList.find((f) => f.userId === friendId) } : friend
                );
            });
        } catch (error) {
            console.error("Lỗi xử lý bạn bè:", error);
        }
    };

    return (
        <>
            <h5 className="mb-3 justify-content-center text-primary text-center mt-4" style={{ textAlign: "center"}}>
                BẠN BÈ CHUNG
            </h5>

            <div className="container">
                {friendList.length > 0 ? (
                    <div className="row justify-content-center" style={{justifyContent: "center", alignItems: "center",
                    display: "flex", flexWrap: "wrap", marginRight: "10px"}}>
                        {friendList.map((user) => (
                            <div className="col-md-4 col-lg-3 mb-4" key={user.userId}>
                                <div className="card shadow-sm" style={{width: "230px"}}>
                                    <img
                                        src={user?.userProfilePictureUrl}
                                        alt="Friend Avatar"
                                        className="card-img-top rounded-circle mx-auto mt-3"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                        <Link to={`/users/detail/${user.userId}`} className="text-decoration-none text-dark">
                                            <h5 className="card-title">
                                                {user?.userFirstName} {user?.userLastName}
                                            </h5>
                                        </Link>

                                        <div className="my-3 d-flex justify-content-center align-items-center">
                                            <MutualFriends mutualFriends={user?.mutualFriends || []} friendId={user.userId} />
                                        </div>

                                        <div className="d-flex justify-content-center mt-3">
                                            <button
                                                onClick={() =>
                                                    handleFriendAction(user.userId, user.isFriend, user.isRequestSent)
                                                }
                                                className={`btn btn-sm px-3 ${
                                                    user.isFriend
                                                        ? user.isRequestSent
                                                            ? "btn-primary"
                                                            : "btn-outline-secondary"
                                                        : "btn-outline-secondary"
                                                }`}
                                            >
                                                {user.isFriend
                                                    ? user.isRequestSent
                                                        ? "Kết bạn"
                                                        : "Hủy kết bạn"
                                                    : "Xóa bạn bè"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-5">
                        <h5>Không có bạn bè chung nào</h5>
                        <p>Hãy kiểm tra lại sau nhé!</p>
                    </div>
                )}

                {/* Nút xem thêm */}
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

export default MutualFriendList;
