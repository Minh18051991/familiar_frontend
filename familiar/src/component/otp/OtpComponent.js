import React, {useState} from 'react';
import styles from './OtpComponent.module.css';
import {useSelector} from "react-redux";
import {verifyOtp} from "../../service/otp/otp";
import {useNavigate} from "react-router-dom"; // Tạo file CSS module này nếu chưa có

function OtpComponent({isShowModal, handleIsShowModal}) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const info = useSelector(state => state.user);
    const account = info ? info.account : null;

    const navigate = useNavigate();

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        let usernameAccount;
        e.preventDefault();
        if (account) {
            usernameAccount = account.username;
        }else {
            usernameAccount = localStorage.getItem('usernameAccount');
        }
        const object = {username: usernameAccount, otp: otp};

        // Thực hiện gọi API verifyOtp để kiểm tra mã OTP
        const check = await verifyOtp(object);
        if (check) {
            handleIsShowModal(); // Đóng modal
            setError('');
        } else {
            setError('Mã OTP không đúng. Vui lòng thử lại.');
        }
    };

    const handleCloseModal = () => {
        handleIsShowModal();
        navigate(-1)
    };

    if (!isShowModal) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Nhập mã OTP</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Nhập mã OTP"
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.submitButton}>Xác nhận</button>
                        <button type="button" onClick={handleCloseModal} className={styles.closeButton}>Đóng</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OtpComponent;