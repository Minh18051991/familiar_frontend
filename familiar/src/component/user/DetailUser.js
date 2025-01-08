import React, { useEffect, useState } from "react";
import styles from "../user/userDetail.module.css";
import {
    acceptFriendship,
    cancelFriendship,
    checkFriendShip,
    pendingFriendship,
    sendFriendship
} from "../../service/friendship/friendshipService";

export default function DetailUser({ user, userId }) {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sentRequest, setSentRequest] = useState(false);

    const userId2 = user.userId;

    useEffect(() => {
        const checkFriendShipStatus = async () => {
            const data = await checkFriendShip(userId, userId2);

            try {
                if (data) {
                    console.log("==========isFriend=========")
                    console.log(data.isFriend)
                    console.log(userId2)
                    setFriendshipStatus("friend");
                } else {
                    const pendingData = await pendingFriendship(userId, userId2);

                    if (pendingData) {
                        setFriendshipStatus("pending");
                        setSentRequest(true);
                    } else {
                        setFriendshipStatus("notFriend");
                    }
                }
            } catch (error) {
                console.error("Lỗi khi thao tác với kết bạn:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkFriendShipStatus();
    }, [userId, userId2]);

    const sendFriendRequest = async () => {
        await sendFriendship(userId, userId2);
        setFriendshipStatus("pending");
        setSentRequest(true);
    };

    const acceptFriendRequest = async () => {
        await acceptFriendship(userId, userId2);
        setFriendshipStatus("friend");
    };

    const rejectFriendRequest = async () => {
        await cancelFriendship(userId, userId2);
        setFriendshipStatus("notFriend");
    };

    const cancelFriendRequest = async () => {
        await cancelFriendship(userId, userId2);
        setFriendshipStatus("notFriend");
        setSentRequest(false);
    };

    const deleteFriendshipRequest = async () => {
        await cancelFriendship(userId, userId2);
        setFriendshipStatus("notFriend");
    };

    const renderButton = () => {
        if (isLoading) {
            return <button disabled>Đang tải...</button>;
        }

        switch (friendshipStatus) {
            case "friend":
                return (
                    <button onClick={deleteFriendshipRequest} className="btn btn-danger">
                        Hủy kết bạn
                    </button>
                );
            case "pending":
                return (
                    <div>
                        {sentRequest ? (
                            <button
                                onClick={cancelFriendRequest}
                                className="btn btn-warning"
                            >
                                Hủy lời mời kết bạn
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={acceptFriendRequest}
                                    className="btn btn-success"
                                >
                                    Chấp nhận kết bạn
                                </button>
                                <button
                                    onClick={rejectFriendRequest}
                                    className="btn btn-danger ms-2"
                                >
                                    Từ chối kết bạn
                                </button>
                            </>
                        )}
                    </div>
                );
            case "notFriend":
                return (
                    <button onClick={sendFriendRequest} className="btn btn-primary">
                        Kết bạn
                    </button>
                );
            default:
                return null;
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
                    <div className="mt-3">{renderButton()}</div>
                </div>
            </div>
        </div>
    );
}
