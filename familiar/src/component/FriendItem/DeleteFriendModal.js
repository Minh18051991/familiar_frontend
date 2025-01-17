import React from "react";
import { deleteFriendship } from "../../service/friendship/friendshipService";
import { useSelector } from "react-redux";
import styles from './DeleteFriendModal.module.css';

function DeleteFriendModal({ isShowModal, friendship, handleCloseModal, handleIsLoading, updateUsers }) {
    const userId = useSelector(state => state.user.account.userId);

    const handleUnFriend = async () => {
        const userId2 = friendship.userId;
        await deleteFriendship(userId, userId2);

        handleIsLoading();
        updateUsers(userId2);
        handleCloseModal();
    }

    if (!isShowModal) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.modalTitle}>Xoá</h5>
                </div>
                <div className={styles.modalBody}>
                    <p>Bạn có muốn xoá {friendship.userFirstName} {friendship.userLastName} không?</p>
                </div>
                <div className={styles.modalFooter}>
                    <button
                        onClick={handleCloseModal}
                        type="button"
                        className={`${styles.button} ${styles.closeButton}`}
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleUnFriend}
                        type="button"
                        className={`${styles.button} ${styles.confirmButton}`}
                    >
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteFriendModal;