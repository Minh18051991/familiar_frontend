import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {
    acceptFriendship,
    cancelFriendship,
    friendRequestList,
    mutualFriendList
} from "../../service/friendship/friendshipService";
import styles from "../user/userDetail.module.css";
import {Link} from "react-router-dom";
import UserItemHome from "./UserItemHome";

function FriendRequestHome() {
    const [listFriend, setListFriend] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const userId = useSelector(state => state.user.account.userId);

    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPages, totalElements} = await friendRequestList(userId, page, size);
            setListFriend(data);
            setTotalPages(totalPages);
            setTotalElements(totalElements)
        };
        fetchData();
    }, [userId, page, size]);

    useEffect(() => {
        if (page >= totalPages - 1) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }
    }, [page, totalPages]);


    return (
        <>
            <h5 className={`${styles.suggestedFriendsTitle} mb-3 text-primary`} style={{marginTop: "10px", marginLeft: "24px"}}>Lời mời kết bạn</h5>
            {listFriend && listFriend.length > 0 ? (
                <div>
                    {listFriend.map((user) => (
                        <UserItemHome user={user} setListFriend={setListFriend}/>
                    ))}
                    <div className="" style={{marginLeft: "125px", marginTop: "7px"}}>
                        <Link className="" to={'/friendships/request'} style={{textDecoration: 'none'}}>
                            Xem tất cả({totalElements})
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-5">
                    <h5>Không có lời mời kết bạn nào.</h5>
                    <p>Hãy kiểm tra lại sau nhé!</p>
                </div>
            )}
        </>
    );
}

export default FriendRequestHome;
