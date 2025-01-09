import React, { useEffect, useState } from "react";
import styles from "../user/userDetail.module.css";
import {
    acceptFriendship,
    cancelFriendship,
    getFriendShipStatus,
    sendFriendship
} from "../../service/friendship/friendshipService";

export default function DetailUser({ user, userId }) {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const userId2 = user.userId;

    useEffect(() => {
        const fetchFriendshipStatus = async () => {
            const status = await getFriendShipStatus(userId, userId2);
            setFriendshipStatus(status);
            setIsLoading(prevState => !prevState);
        }
        fetchFriendshipStatus();
    }, [userId, userId2]);

    const handleSendFriendRequest = async () => {
        await sendFriendship(userId, userId2);
    };

    const handleAcceptFriendRequest = async () => {
        await acceptFriendship(userId, userId2);
    };

    const handleDeclineFriendRequest = async () => {
        await cancelFriendship(userId, userId2);
    };

    const handleUnfriend = async () => {
        await cancelFriendship(userId, userId2);
    };

    const handleCancelFriendRequest = async () => {
        await cancelFriendship(userId, userId2);
    };

    const renderButton = () => {

        switch (friendshipStatus) {
            case "friend":
                return (
                    <button className={`${styles.actionDeleteBtn} btn px-3`} onClick={handleUnfriend}>
                        Xoá bạn bè
                    </button>
                );
            case "waiting":
                return (
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={handleAcceptFriendRequest}
                        >
                            Chấp nhận
                        </button>
                        <button
                            className={`${styles.actionDeleteBtn} btn px-3`}
                            onClick={handleDeclineFriendRequest}
                        >
                            Xoá
                        </button>
                    </div>
                );
            case "pending":
                return (
                    <button
                        className={`${styles.actionDeleteBtn} btn px-3`}
                        onClick={handleCancelFriendRequest}
                    >
                        Hủy lời mời kết bạn
                    </button>
                );
            case "notFriend":
                return (
                    <button
                        className="btn btn-primary"
                        onClick={handleSendFriendRequest}
                    >
                        Kết bạn
                    </button>
                );
            default:
                return <span>Đang tải...</span>;
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
                    {
                        (userId !== userId2) ? <div className="mt-3">{renderButton()}</div>: ""
                    }
                </div>
            </div>
        </div>
    );
}
