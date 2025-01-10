import React, { useEffect, useState } from "react";
import styles from "../user/userDetail.module.css";
import {
    acceptFriendship,
    cancelFriendship, deleteFriendship,
    getFriendShipStatus,
    sendFriendship
} from "../../service/friendship/friendshipService";

export default function DetailUser({ user, userId }) {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const userId2 = user.userId;

    useEffect(() => {
        const fetchFriendshipStatus = async () => {
            console.log("======================'''''''''''''''''")
            console.log(userId2)
            const status = await getFriendShipStatus(userId, userId2);
            console.log("Friendship status:", status);
            setFriendshipStatus(status);
            setIsLoading(false);
        };
        fetchFriendshipStatus();
    }, [userId, userId2]);

    const handleSendFriendRequest = async () => {
        console.log("Sending friend request...");
        await sendFriendship(userId, userId2);
        setFriendshipStatus('pending');
    };

    const handleAcceptFriendRequest = async () => {
        console.log("Accepting friend request...");
        await acceptFriendship(userId, userId2);
        setFriendshipStatus('friend');
    };

    const handleDeclineFriendRequest = async () => {
        console.log("Declining friend request...");
        await cancelFriendship(userId, userId2);
        setFriendshipStatus('notFriend');
    };

    const handleUnfriend = async () => {
        console.log("Unfriending...");
        await deleteFriendship(userId, userId2);
        setFriendshipStatus('notFriend');
    };

    const handleCancelFriendRequest = async () => {
        console.log("Canceling friend request...");
        await cancelFriendship(userId, userId2);
        setFriendshipStatus('notFriend');
    };

    const handleResendFriendRequest = async () => {
        console.log("Resending friend request...");
        await sendFriendship(userId, userId2);
        setFriendshipStatus('pending');
    };

    const renderButton = () => {
        if (isLoading) {
            return <span>Đang tải...</span>; // Hiển thị thông báo đang tải
        }

        switch (friendshipStatus) {
            case "friend":
                return (
                    <div>
                        <div>Bạn và {user.userFirstName} {user.userLastName} hiện là bạn bè</div> <br/>
                        <button className={`${styles.actionDeleteBtn} btn px-3`} onClick={handleUnfriend}>
                            Xoá bạn bè
                        </button>
                    </div>
                );
            case "waiting":
                return (
                    <div>
                        <div>{user.userLastName} đã gửi cho bạn lời mời kết bạn</div> <br/>
                        <div>
                            <button className="btn btn-primary" onClick={handleAcceptFriendRequest}>
                                Chấp nhận
                            </button>
                            <button className={`${styles.actionDeleteBtn} btn px-3`} onClick={handleDeclineFriendRequest}>
                                Hủy
                            </button>
                        </div>
                    </div>
                );
            case "pending":
                return (
                    <div>
                        <div>Bạn đã gửi lời mời kết bạn đến {user.userFirstName} {user.userLastName}</div> <br/>
                        <button className={`${styles.actionDeleteBtn} btn px-3`} onClick={handleCancelFriendRequest}>
                            Hủy kết bạn
                        </button>
                    </div>
                );
            case "deleted":
                return (
                    <div>
                        <button className="btn btn-primary" onClick={handleResendFriendRequest}>
                            Kết bạn
                        </button>
                    </div>
                );
            case "notFriend":
                return (
                    <button className="btn btn-primary" onClick={handleSendFriendRequest}>
                        Kết bạn
                    </button>
                );
            default:
                return <span>Đang tải...</span>; // Hiển thị khi chưa có trạng thái xác định
        }
    };

    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="col-12 col-md-4 order-md-1">
            <div className={`${styles.card} shadow-lg rounded-4 border-0 mb-4 hoverShadow`}>
                <div className={`${styles.cardBody} text-center`}>
                    <img
                        src={user.userProfilePictureUrl}
                        alt="User Avatar"
                        className={`${styles.userAvatar} mb-4`}
                        style={{
                            width: "180px",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "5px solid #007bff"
                        }}
                    />
                    <h3 className={`${styles.userName} card-title mb-2`}>
                        {user.userFirstName} {user.userLastName}
                    </h3>
                    <p className={`${styles.userOccupation} text-muted mb-3`}>
                        {user.userOccupation}
                    </p>
                    <hr className="my-3" />
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
                    {/* Render button */}
                    {userId !== userId2 && (
                        <div className="mt-3">{renderButton()}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
