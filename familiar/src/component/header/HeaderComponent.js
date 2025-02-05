import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {logout} from "../../redux/login/AccountAction";
import {useDispatch, useSelector} from "react-redux";
import styles from './HeaderComponent.module.css';
import {sendOtp} from "../../service/otp/otp";
import SearchComponent from "../search/SearchComponent";
import LoadingSpinner from "../otp/LoadingSpinner";

function HeaderComponent() {
    const info = useSelector(state => state.user);
    const account = info ? info.account : null;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const avatarUrl = React.useMemo(() => {

        if (info && info.profilePictureUrl) {
            return info.profilePictureUrl;
        } else if (account && account.profilePictureUrl) {
            return account.profilePictureUrl;
        } else if (account && account.gender) {
            return account.gender === 'Nam'
                ? "https://static2.yan.vn/YanNews/2167221/202003/dan-mang-du-trend-thiet-ke-avatar-du-kieu-day-mau-sac-tu-anh-mac-dinh-b0de2bad.jpg"
                : account.gender === 'Nữ'
                    ? "https://antimatter.vn/wp-content/uploads/2022/04/anh-avatar-trang-co-gai-toc-tem.jpg"
                    : "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";
        }
        return null;
    }, [info, account]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }

    const isActive = (path) => location.pathname === path ? styles.active : '';

    const handleChangePassword = async () => {
        if (account && account.username) {
            const object = {username: account.username};
            setIsLoading(true);
            await sendOtp(object);
            setIsLoading(false);
            navigate(`/account/change-password/${account.username}`);
        }
    };
    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarContent}>
                    <Link to="/">
                        <img
                            src="https://png.pngtree.com/png-clipart/20240413/original/pngtree-initial-fa-letter-logo-with-creative-modern-business-typography-vector-png-image_14799238.png"
                            alt="Logo" className={styles.logo}/>
                    </Link>
                    <div className={styles.searchBar}>
                        <div className={styles.searchBar}>
                            <SearchComponent/>
                        </div>
                    </div>
                    <div className={styles.navIconContainer}>
                        <Link className={`${styles.navIcon} ${isActive('/')}`} to="/" title="Trang chủ">
                            <i className="fas fa-home"></i>
                        </Link>
                        <Link className={`${styles.navIcon} ${isActive('/friendships-list')}`} to="/friendships-list"
                              title="Bạn bè">
                            <i className="fas fa-user-friends"></i>
                        </Link>
                        {account && account.role && account.role.includes('ROLE_ADMIN') &&
                            <Link className={`${styles.navIcon} ${isActive('/admin/users')}`} to="/admin/users" title="Danh sách người dùng">
                                <i className="fas fa-users"></i>
                            </Link>
                         }
                    </div>
                    <div className={styles.rightSection}>
                        {!account && (
                            <Link className={styles.navLink} to="/login">Đăng nhập</Link>
                        )}
                        {account && (
                            <div className="nav-item dropdown">
                                <a className={`nav-link dropdown-toggle d-flex align-items-center ${styles.avatarLink}`}
                                   id="navbarDropdown"
                                   role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        className={styles.avatar}
                                    />
                                    <span>{account.name}</span>
                                </a>
                                <ul className={`dropdown-menu dropdown-menu-end ${styles.dropdownMenu}`}
                                    aria-labelledby="navbarDropdown">
                                    <li><Link className="dropdown-item" to={`/user/detail/${account.userId}`}>Xem thông
                                        tin cá nhân</Link></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleChangePassword}>Đổi mật khẩu
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="dropdown-item">Đăng xuất</button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <LoadingSpinner show={isLoading}/>
        </>
    );
}

export default HeaderComponent;