
import React, {useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../redux/login/AccountAction";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import styles from './LoginComponent.module.css';

function LoginComponent() {
    const usernameRef = useRef();
    const passwordRef = useRef();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogin = async () => {
        let username = usernameRef.current.value;
        let password = passwordRef.current.value;
        const loginInfo = {username:username, password:password};
        console.log(loginInfo)
        console.log("========begin account==========");
        // let isLoginSuccess = null
        let isLoginSuccess = await dispatch(login(loginInfo))
        if (isLoginSuccess) {
            toast.success("đăng nhập thành công!", {
                position: "top-right",
                autoClose: 3000, // Thời gian tự đóng (3 giây)
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            navigate('/list')

        }else {
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
        // <div className="container mt-5">
        //     <div className="row justify-content-center">
        //         <div className="col-md-6">
        //             <div className="card">
        //                 <div className="card-body">
        //                     <h3 className="card-title text-center mb-4">Đăng nhập</h3>
        //                     <form>
        //                         <div className="mb-3">
        //                             <label htmlFor="username" className="form-label">Username:</label>
        //                             <input
        //                                 ref={usernameRef}
        //                                 type="text"
        //                                 className="form-control"
        //                                 id="username"
        //                                 placeholder="Nhập username"
        //                             />
        //                         </div>
        //                         <div className="mb-3">
        //                             <label htmlFor="password" className="form-label">Password:</label>
        //                             <input
        //                                 ref={passwordRef}
        //                                 type="password"
        //                                 className="form-control"
        //                                 id="password"
        //                                 placeholder="Nhập password"
        //                             />
        //                         </div>
        //                         <div className="d-grid gap-2">
        //                             <button
        //                                 type="button"
        //                                 className="btn btn-primary"
        //                                 onClick={handleLogin}
        //                             >
        //                                 Đăng nhập
        //                             </button>
        //                         </div>
        //                     </form>
        //                     <div className="text-center mt-4">
        //                         <p className="mb-2">Chưa có tài khoản?</p>
        //                         <Link to="/register" className="btn btn-outline-primary btn-lg w-100">
        //                             Đăng ký ngay
        //                         </Link>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className={styles.loginPage}>
            <div className={styles.contentWrapper}>
                <div className={styles.imageSection}>
                    <h1 className={styles.websiteTitle}>Familiar</h1>
                    <img
                        src="https://media.istockphoto.com/id/1124728680/vi/anh/ng%C6%B0%E1%BB%9Di-%C4%91%C3%A0n-%C3%B4ng-v%C3%A0-ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-ng%E1%BB%93i-b%C3%AAn-b%E1%BB%9D-bi%E1%BB%83n-h%C3%B4n-nhau-l%C3%BAc-ho%C3%A0ng-h%C3%B4n-t%E1%BA%A1i-meloneras-%C4%91i-d%E1%BA%A1o-tr%C3%AAn.jpg?s=612x612&w=0&k=20&c=_qJBMTmGOfZ-W0N82Y59j_jvMPuZu6w22uL-1VaEjOM="
                        alt="Login" className={styles.loginImage}/>
                </div>
                <div className={styles.formSection}>
                    <h3 className={styles.formTitle}>Đăng nhập</h3>
                    <form>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Tên đăng nhập:</label>
                            <input
                                ref={usernameRef}
                                type="text"
                                id="username"
                                placeholder="Nhập username"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Mật khẩu:</label>
                            <input
                                ref={passwordRef}
                                type="password"
                                id="password"
                                placeholder="Nhập password"
                            />
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
                        <p>Chưa có tài khoản?</p>
                        <Link to="/register" className={styles.registerButton}>
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
            <footer className={styles.footer}>
                <p>&copy; 2023 Your Company Name. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default LoginComponent;