import React, {useEffect, useState} from "react";
import styles from "../friendship/ListFriendShip.module.css";
import {FriendItem} from "../FriendItem";
import {getFriendShips, searchNameFriendship} from "../../service/friendship/friendshipService";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {login} from "../../redux/login/AccountAction";

function ListFriendShipComponent() {
    const [searchValue, setSearchValue] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(useSelector(state => state.user.account.userId));

    useEffect(() => {
        
        getFriendShips(userId)
            .then((res) => {
                setUsers(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isLoading]);

    const handleIsLoading = () => {
        setIsLoading(prevState => !prevState);
    }

    const handleSearchName = async () => {
        const searchList = await searchNameFriendship(userId, searchValue);
        setUsers(searchList);

    };

    const updateUsers = (userId) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className={`${styles.customTitle} title mb-0`}>Danh sách bạn bè</h3>
                    <Link to={`/friendships/request`} className="btn btn-primary">
                        Lời mời kết bạn
                    </Link>
                </div>

                <form className={styles.searchContainer}>
                    <input
                        className={styles.searchInput}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={"Nhập tên cần tìm"}
                    />
                    <button
                        className={styles.searchBtn}
                        type={"button"}
                        onClick={handleSearchName}
                    >
                        Tìm
                    </button>
                </form>

                <div className={styles.cardBody}>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <FriendItem
                                key={index}
                                userData={user}
                                handleIsLoading={handleIsLoading}
                                updateUsers={updateUsers}
                            />
                        ))
                    ) : (
                        <div className="alert alert-warning text-center" role="alert">
                            Không tìm thấy trong danh sách bạn bè của bạn.
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}

export default ListFriendShipComponent;
