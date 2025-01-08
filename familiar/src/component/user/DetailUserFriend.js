import React from "react";
import styles from "./userDetail.module.css";
import {cancelFriendship, sendFriendship} from "../../service/friendship/friendshipService";


export default function DetailUserFriend({friend, col, userId, setFriendList}) {
    const handleAddFriend = async (userId2) => {
        try {
            const updatedFriendStatus = !friend.isFriend;

            if (updatedFriendStatus) {
                await sendFriendship(userId, userId2);
            } else {
                await cancelFriendship(userId, userId2);
            }

            setFriendList(prevList =>
                prevList.map(f =>
                    f.userId === userId2 ? { ...f, isFriend: updatedFriendStatus } : f
                )
            );
        } catch (error) {
            console.error("Lỗi xử lý bạn bè:", error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại!");
        }
    };

    return (
        <div className={`col-12 col-sm-6 col-md-${col} mb-3`}>
            <div className={`${styles.card} shadow-sm border-light hoverShadow`}>
                <div className={`${styles.cardBody} text-center`}>
                    <img
                        src={friend?.userProfilePictureUrl}
                        alt="Friend Avatar"
                        className={`${styles.friendAvatar} mb-3`}
                    />
                    <p className="card-title mb-2">{friend?.userFirstName} {friend?.userLastName}</p>
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            onClick={() => handleAddFriend(friend.userId)}
                            className={`${styles.actionBtn} btn btn-primary btn-sm px-3`}
                        >
                            {friend.isFriend ? "Huỷ kết bạn" : "Kết bạn"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}