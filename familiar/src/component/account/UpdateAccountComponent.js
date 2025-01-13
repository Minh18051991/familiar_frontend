import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import * as Yup from 'yup';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {toast} from "react-toastify";
import {updatePassword} from "../../service/account/account";
import styles from './UpdateAccountComponent.module.css';
import OtpComponent from "../otp/OtpComponent";
import {useDispatch, useSelector} from "react-redux";
import {getUserById} from "../../service/user/user";
import {logout} from "../../redux/login/AccountAction";

export default function UpdateAccountComponent() {
    const {username} = useParams();
    const navigate = useNavigate();
    const [isShowModal, setIsShowModal] = useState(true);
    const info = useSelector(state => state.user);
    const accountRedux = info ? info.account : null;
    const  dispatch = useDispatch();

    const initialValues = {
        newPassword: '',
        confirmPassword: ''
    };
    const handleShowModal = () => {
        setIsShowModal(prevState => !prevState);
    }

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
            .required('Mật khẩu mới là bắt buộc'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận phải trùng khớp')
            .required('Xác nhận mật khẩu là bắt buộc')
    });

    const handleSubmit = async (values, {setSubmitting}) => {
        const account = {password: values.newPassword, username};

        await updatePassword(account);
        toast.success("Cập nhật thành công!");
        setSubmitting(false);

        if (accountRedux) {
            const userData = await getUserById(accountRedux.userId);
            localStorage.setItem('loginInfo', JSON.stringify({
                username: username,
                name: userData.firstName + " " + userData.lastName,
                avatar: accountRedux.profilePictureUrl
            }));
        }


        // Đăng xuất
        dispatch(logout());

        // Chuyển hướng đến trang login
        navigate("/login");
    };

    return (
        <div className={styles.pageContainer}>
            <OtpComponent isShowModal={isShowModal} handleIsShowModal={handleShowModal}/>
            <div className={styles.container}>
                <h2 className={styles.title}>Thay đổi mật khẩu</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword"
                                       className={`form-label ${styles.formLabel} ${styles.requiredField}`}>Mật khẩu
                                    mới</label>
                                <Field type="password" name="newPassword" className={styles.input}/>
                                <ErrorMessage name="newPassword" component="div" className={styles.errorMessage}/>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword"
                                       className={`form-label ${styles.formLabel} ${styles.requiredField}`}>Xác nhận mật
                                    khẩu mới</label>
                                <Field type="password" name="confirmPassword" className={styles.input}/>
                                <ErrorMessage name="confirmPassword" component="div" className={styles.errorMessage}/>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
                            </button>
                            <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>Hủy
                            </button>
                        </Form>
                    )}
                </Formik>

            </div>
        </div>
    )
}