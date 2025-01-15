import React, {useState, useEffect} from 'react';
import {findUserById} from '../../service/user/userService';
import styles from './ListUserComponent.module.css';
import {getAllUsers} from "../../service/user/user";
import DeleteComponent from "./DeleteComponent";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";

function ListUserComponent() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers(page, pageSize, searchTerm);
    }, [page, pageSize]);

    const fetchUsers = async (page, size, search) => {
        setLoading(true);
        const response = await getAllUsers(page - 1, size, search);
        setUsers(response.content);
        setTotalPages(response.totalPages);
        setLoading(false);
    };

    const handleOpenModal = (user) => {
        setUserToDelete(user);
        setIsShowModal(true);
    };

    const handleCloseModal = () => {
        setIsShowModal(false);
        setUserToDelete(null);
    };

    const handleDeleteSuccess = () => {
        fetchUsers(page, pageSize, searchTerm);
        handleCloseModal();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearch = () => {
        setPage(1); // Reset về trang đầu tiên khi tìm kiếm
        fetchUsers(1, pageSize, searchTerm);
    };

    const handleUserNameClick = (userId) => {
        navigate(`/user/detail/${userId}`);
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;


    return (
        <div className={styles.userListContainer}>
            <h2 className={styles.title}>DANH SÁCH NGƯỜI DÙNG</h2>
            <div className={styles.searchContainer}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleSearch} edge="end">
                                    <SearchIcon/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    className={styles.searchInput}
                />
            </div>
            <table className={styles.userTable}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                             <span
                                 onClick={() => handleUserNameClick(user.id)}
                                 className={styles.userName}
                             >
                                 {user.firstName + " " + user.lastName}
                             </span>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => handleOpenModal(user)} className={styles.detailButton}>
                                Xóa
                            </button>
                            <button onClick={() => findUserById(user.id)}
                                    className={`${styles.detailButton} ${styles.grayButton}`}>
                                Khóa
                            </button>
                            <button onClick={() => findUserById(user.id)}
                                    className={`${styles.detailButton} ${styles.grayButton}`}>
                                Cảnh cáo
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Stack spacing={2} alignItems="center" marginTop={2}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Stack>
            <DeleteComponent
                userToDelete={userToDelete}
                isShowModal={isShowModal}
                handleIsShowModal={handleCloseModal}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </div>
    );
}

export default ListUserComponent;