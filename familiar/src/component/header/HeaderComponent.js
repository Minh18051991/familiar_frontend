// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from 'react-router-dom';
// import { logout } from "../../redux/account/AccountAction";
// import React from 'react';
// import styles from './HeaderComponent.module.css';
//
// function HeaderComponent() {
//     const info = useSelector(state => state.user);
//     const account = info ? info.account : null;
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//
//     const handleLogout = () => {
//         dispatch(logout());
//         navigate('/');
//     }
//
//     return (
//         <>
//             <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbar}`}>
//                 <div className="container-fluid">
//                     <img
//                         src={"https://png.pngtree.com/png-clipart/20240413/original/pngtree-initial-fa-letter-logo-with-creative-modern-business-typography-vector-png-image_14799238.png"}
//                         className={styles.logo} alt="Logo"/>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
//                             data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
//                             aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                         {/*<ul className="navbar-nav me-auto mb-2 mb-lg-0">*/}
//                         {/*    <li className="nav-item">*/}
//                         {/*        <Link className="nav-link active" aria-current="page" to="/">Trang chủ</Link>*/}
//                         {/*    </li>*/}
//                         {/*</ul>*/}
//
//                         <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                             <li className="nav-item">
//                                 <Link className={`nav-link active ${styles.navIcon}`} aria-current="page" to="/"
//                                       title="Trang chủ">
//                                     <i className="fas fa-home"></i>
//                                 </Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className={`nav-link ${styles.navIcon}`} to="/friends" title="Bạn bè">
//                                     <i className="fas fa-user-friends"></i>
//                                 </Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className={`nav-link ${styles.navIcon}`} to="/messages" title="Tin nhắn">
//                                     <i className="fas fa-comment-alt"></i>
//                                 </Link>
//                             </li>
//                         </ul>
//
//
//                         <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//                             {!account && (
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/account">Đăng nhập</Link>
//                                 </li>
//                             )}
//                             {account && (
//                                 <>
//                                     {/*<li className="nav-item">*/}
//                                     {/*    <button onClick={handleLogout} className={styles.logoutButton}>Đăng xuất</button>*/}
//                                     {/*</li>*/}
//                                     <li className="nav-item dropdown">
//                                         <a className="nav-link dropdown-toggle d-flex align-items-center"
//                                            id="navbarDropdown" role="button" data-bs-toggle="dropdown"
//                                            aria-expanded="false">
//                                             <img src={account.profilePictureUrl} alt="Avatar"
//                                                  className={styles.avatar}/>
//                                             {account.name}
//                                         </a>
//                                         <ul className={`dropdown-menu dropdown-menu-end ${styles.dropdownMenu}`}
//                                             aria-labelledby="navbarDropdown">
//                                             <li><Link className="dropdown-item" to={`/user/detail/${account.userId}`}>Xem
//                                                 thông tin cá nhân</Link></li>
//                                             <li><Link className="dropdown-item" to="/change-password">Đổi mật
//                                                 khẩu</Link></li>
//                                             <li>
//                                                 <hr className="dropdown-divider"/>
//                                             </li>
//                                             <li>
//                                                 <button onClick={handleLogout} className="dropdown-item">Đăng xuất
//                                                 </button>
//                                             </li>
//                                         </ul>
//                                     </li>
//                                 </>
//                             )}
//                         </ul>
//                     </div>
//                 </div>
//             </nav>
//         </>
//     );
// }
//
// export default HeaderComponent;


import React from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {logout} from "../../redux/login/AccountAction";
import {useDispatch, useSelector} from "react-redux";
import styles from './HeaderComponent.module.css';


function HeaderComponent() {
    const info = useSelector(state => state.user);
    const account = info ? info.account : null;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }

    const isActive = (path) => location.pathname === path ? styles.active : '';


    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContent}>
                <Link to="/">
                    <img
                        src="https://png.pngtree.com/png-clipart/20240413/original/pngtree-initial-fa-letter-logo-with-creative-modern-business-typography-vector-png-image_14799238.png"
                        alt="Logo" className={styles.logo}/>
                </Link>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm trên hệ thống..."
                    />
                    <button className={styles.searchButton}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
                <div className={styles.navIconContainer}>
                    <Link className={`${styles.navIcon} ${isActive('/')}`} to="/" title="Trang chủ">
                        <i className="fas fa-home"></i>
                    </Link>


                    <Link className={`${styles.navIcon} ${isActive('/friends')}`} to="/friends" title="Bạn bè">
                        <i className="fas fa-user-friends"></i>
                    </Link>
                    <Link className={`${styles.navIcon} ${isActive('/messages')}`} to="/messages" title="Tin nhắn">
                        <i className="fas fa-comment-alt"></i>
                    </Link>
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
                                <img src={account.profilePictureUrl} alt="Avatar" className={styles.avatar}/>
                                <span>{account.name}</span>
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-end ${styles.dropdownMenu}`}
                                aria-labelledby="navbarDropdown">
                                <li><Link className="dropdown-item" to={`/user/detail/${account.userId}`}>Xem
                                    thông tin cá nhân</Link></li>
                                <li><Link className="dropdown-item" to="/change-password">Đổi mật
                                    khẩu</Link></li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item">Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>

                    )}
                </div>
            </div>
        </nav>
    );
}

export default HeaderComponent;