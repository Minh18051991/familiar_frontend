import React from "react";
import {deleteFriendship} from "../../service/friendship/friendshipService";

function DeleteFriendModal({isShowModal, friendship, handleCloseModal, handleIsLoading}) {

    const handleUnFriend = async () => {
        const userId1 = 1;
        const userId2 = friendship.userId;
        await deleteFriendship(userId1, userId2);

        handleIsLoading();
        handleCloseModal();
    }

    return(
        <>
            <>
                {isShowModal && (
                    <div
                        className="modal show"
                        tabIndex="-1"
                        style={{
                            display: 'block',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1050,
                        }}
                    >
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content shadow-lg rounded-3">
                                <div className="modal-header" style={{fontSize: '1rem'}}>
                                    <h5 className="modal-title" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                                        Xoá
                                    </h5>
                                </div>
                                <div className="modal-body" style={{fontSize: '0.9rem'}}>
                                    <p>Bạn có muốn xoá {friendship.userFirstName} {friendship.userLastName} không?</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        onClick={handleCloseModal}
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        data-bs-dismiss="modal"
                                        style={{fontSize: '0.875rem', padding: '0.375rem 0.75rem'}}
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        onClick={handleUnFriend}
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        style={{fontSize: '0.875rem', padding: '0.375rem 0.75rem'}}
                                    >
                                        Đồng ý
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </>
    );
}
export default DeleteFriendModal;