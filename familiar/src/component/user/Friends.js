import React from "react";
import styles from "./userDetail.module.css";
import { cancelFriendship, sendFriendship } from "../../service/friendship/friendshipService";
import { Link } from "react-router-dom";

export default function Friends({ friend, col, userId, setFriendList }) {
    const handleAddFriend = async (userId2) => {
        try {
            const updatedFriendStatus = !friend.isFriend;

            if (updatedFriendStatus) {
                await sendFriendship(userId, userId2);
            } else {
                await cancelFriendship(userId, userId2);
            }

            setFriendList((prevList) =>
                prevList.map((f) =>
                    f.userId === userId2 ? { ...f, isFriend: updatedFriendStatus } : f
                )
            );
        } catch (error) {
            console.error("Lỗi xử lý bạn bè:", error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại!");
        }
    };

    function formatUserName(fullName) {
        const nameParts = fullName.trim().split(' ');
        
        let formattedName = '';
        let remainingLength = 14;

        for (let i = nameParts.length - 1; i >= 0; i--) {
            const part = nameParts[i];
            if (formattedName.length + part.length + (formattedName ? 1 : 0) <= remainingLength) {
                formattedName = part + (formattedName ? ' ' + formattedName : '');
            } else {
                break;
            }
        }

        return formattedName;
    }


    return (
        <div className={`col-12 col-sm-6 col-md-${col} mb-3`} key={friend.userId}>  {/* key ở đây */}
            <div className={`${styles.card} shadow-sm border-light hoverShadow`}>
                <div className={`${styles.cardBody} text-center`}>
                    <img
                        src={friend?.userProfilePictureUrl}
                        alt="Friend Avatar"
                        className={`${styles.friendAvatar} mb-3`}
                    />
                    <Link to={`/users/detail/${friend.userId}`} style={{textDecoration: 'none'}}>
                        <p className="mx-2" style={{color: 'black'}}>
                            {formatUserName(friend?.userFirstName + " " + friend?.userLastName)}
                        </p>
                    </Link>
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            onClick={() => handleAddFriend(friend.userId)}
                            className={`${friend.isFriend ? styles.actionDeleteBtn : 'btn btn-primary'} btn btn-sm px-3`}
                        >
                            {friend.isFriend ? "Huỷ kết bạn" : "Kết bạn"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
