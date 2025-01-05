import React from 'react';
import {useNavigate, useParams} from "react-router-dom";

import * as Yup from 'yup';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {toast} from "react-toastify";
import {updatePassword} from "../../service/account/account";
import styles from './UpdateAccountComponent.module.css';

export default function UpdateAccountComponent() {
    const {username} = useParams();
    const navigate = useNavigate();

    const initialValues = {
        newPassword: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
            .required('Mật khẩu mới là bắt buộc'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận phải trùng khớp')
            .required('Xác nhận mật khẩu là bắt buộc')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        const account = {password:values.newPassword, username};
        // Gọi API để lấy thông tin người dùng

        await updatePassword( account); // Gọi API để cập nhật thông tin người dùng
        toast.success("Cập nhật thành công!");  // Hiển thị thông báo cập nhật thành công

        setSubmitting(false);
        navigate("/login")

    };



    return (
        <div className={styles.pageContainer}>
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
                                <label htmlFor="newPassword" className={styles.label}>Mật khẩu mới</label>
                                <Field type="password" name="newPassword" className={styles.input}/>
                                <ErrorMessage name="newPassword" component="div" className={styles.errorMessage}/>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>Xác nhận mật khẩu mới</label>
                                <Field type="password" name="confirmPassword" className={styles.input}/>
                                <ErrorMessage name="confirmPassword" component="div" className={styles.errorMessage}/>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}