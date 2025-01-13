import React, {useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {initiatePasswordReset, sendOtpToEmail} from '../../service/otp/otp';
import {useNavigate} from "react-router-dom";
import styles from './ForgetPasswordModal.module.css';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
});

export default function ForgetPasswordModal() {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (values, {setSubmitting}) => {
        try {
            const initResult = await initiatePasswordReset(values.email);
            console.log(initResult);
            if (initResult) {
                await sendOtpToEmail(values.email, initResult.token);
                localStorage.setItem('usernameAccount', initResult.username);
                localStorage.setItem('resetPasswordToken', initResult.token);
                navigate(`/account/change-password/${initResult.username}`);
            } else {
                setError('Email không hợp lệ hoặc không tìm thấy tài khoản');
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <Formik
                initialValues={{email: ''}}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({isSubmitting}) => (
                    <Form className={styles.form}>
                        <h1 className={styles.title}>Nhập email nhận OTP</h1>
                        <Field type="email" name="email" placeholder="Nhập email của bạn" className={styles.input}/>
                        <ErrorMessage name="email" component="div" className={styles.error}/>
                        {error && <div className={styles.error}>{error}</div>}
                        <button type="submit" disabled={isSubmitting} className={styles.button}>
                            {isSubmitting ? 'Đang gửi...' : 'Xác nhận'}
                        </button>
                        <button type="button" onClick={() => navigate(-1)} className={styles.closeButton}>Đóng</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}