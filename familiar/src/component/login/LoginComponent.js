import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import {login} from "../../redux/login/AccountAction";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import styles from './LoginComponent.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import FooterComponent from "../footer/FooterComponent";


function LoginComponent() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        // Kiểm tra thông tin từ localStorage
        const loginInfo = localStorage.getItem('loginInfo');
        if (loginInfo) {
            const {username, name, avatar} = JSON.parse(loginInfo);
            setName(name);
            setAvatar(avatar);
            usernameRef.current.value = username;
            passwordRef.current.focus();

            // Xóa thông tin từ localStorage sau khi đã sử dụng
            localStorage.removeItem('loginInfo');
        } else if (location.state && location.state.username && location.state.name) {
            // Xử lý thông tin từ location.state như trước đây
            setName(location.state.name);
            if (location.state.avatar) {
                setAvatar(location.state.avatar);
            } else if (location.state.gender === 'Nam') {
                setAvatar("https://static2.yan.vn/YanNews/2167221/202003/dan-mang-du-trend-thiet-ke-avatar-du-kieu-day-mau-sac-tu-anh-mac-dinh-b0de2bad.jpg");
            } else {
                setAvatar("https://antimatter.vn/wp-content/uploads/2022/04/anh-avatar-trang-co-gai-toc-tem.jpg");
            }

            usernameRef.current.value = location.state.username;
            passwordRef.current.focus();
        }
    }, [location]);

    const handleLogin = async () => {
        let username = usernameRef.current.value;
        let password = passwordRef.current.value;
        const loginInfo = {username: username, password: password};
        console.log(loginInfo)
        console.log("========begin account==========");
        // let isLoginSuccess = null
        let isLoginSuccess = await dispatch(login(loginInfo))
        if (isLoginSuccess) {
            toast.success("đăng nhập thành công!", {
                position: "top-right",
                autoClose: 500, // Thời gian tự đóng (3 giây)
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            navigate('/')

        } else {
            toast.error("Sai tên đăng nhập hoặc mật khẩu!", {
                position: "top-right",
                autoClose: 3000, // Th��i gian tự đóng (3 giây)
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }


    }
    return (
        <>
            <div className={styles.loginPage}>
                <div className={styles.contentWrapper}>
                    <div className={styles.imageSection}>
                        <h1 className={styles.websiteTitle}>Familiar</h1>
                        <img
                            src="https://media.istockphoto.com/id/1124728680/vi/anh/ng%C6%B0%E1%BB%9Di-%C4%91%C3%A0n-%C3%B4ng-v%C3%A0-ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-ng%E1%BB%93i-b%C3%AAn-b%E1%BB%9D-bi%E1%BB%83n-h%C3%B4n-nhau-l%C3%BAc-ho%C3%A0ng-h%C3%B4n-t%E1%BA%A1i-meloneras-%C4%91i-d%E1%BA%A1o-tr%C3%AAn.jpg?s=612x612&w=0&k=20&c=_qJBMTmGOfZ-W0N82Y59j_jvMPuZu6w22uL-1VaEjOM="
                            alt="Login" className={styles.loginImage}/>
                    </div>
                    <div className={styles.formSection}>
                        {name == '' &&
                            (
                                <h3 className={styles.formTitle}>Đăng nhập</h3>
                            )
                        }

                        {
                            name != '' && (
                                <div className={styles.nameSection}>
                                    <img src={avatar} alt="Avatar" className={styles.avatar}/>
                                    <p>{name}</p>
                                </div>
                            )
                        }
                        <form>
                            <div className={`${styles.formGroup} ${name !== '' ? styles.hidden : ''}`}>
                                <label htmlFor="username">Tên đăng nhập:</label>
                                <input
                                    ref={usernameRef}
                                    type="text"
                                    id="username"
                                    placeholder="Nhập username"
                                    defaultValue={name !== '' ? name : ''}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Mật khẩu:</label>
                                <div className={styles.passwordInputWrapper}>
                                    <input
                                        ref={passwordRef}
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Nhập password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={togglePasswordVisibility}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.loginButton}
                                onClick={handleLogin}
                            >
                                Đăng nhập
                            </button>
                        </form>
                        <div className={styles.registerSection}>
                            <Link to="/forget-password" className={styles.forgotPasswordLink}>
                                Quên mật khẩu?
                            </Link>
                            <Link to="/register" className={styles.registerButton}>
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent/>
        </>

    )
}

export default LoginComponent;