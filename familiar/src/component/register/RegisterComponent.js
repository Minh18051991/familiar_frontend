import React, { useState } from 'react';
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {checkUsernameExists, createAccount} from "../../service/account/account";
import {checkEmailExists, createUser} from "../../service/user/user";
import {useNavigate} from "react-router-dom";
import moment from 'moment'; // Đảm bảo bạn đã import moment
import debounce from 'lodash/debounce';
import styles from "./RegisterComponent.module.css";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function RegisterComponent() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const [initialValues, setInitialValues] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phoneNumber: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        firstName: Yup.string().required("Tên không được để trống"),
        lastName: Yup.string().required("Họ không được để trống"),
        email: Yup.string()
            .required("Email không được để trống")
            .email("Email không hợp lệ")
            .test('unique-email', 'Email đã tồn tại', async function (value) {
                if (!value) return true; // Skip validation if empty
                const result = await debouncedEmailCheck(value, this.createError);
                return result;
            }),
        dateOfBirth: Yup.date()
            .nullable()
            .test(
                "is-over-16",
                "Bạn phải đủ 16 tuổi trở lên",
                function (value) {
                    if (!value) return true; // Cho phép giá trị null (không nhập)
                    return moment().diff(moment(value), 'years') >= 16;
                }
            ),
        gender: Yup.string().required("Giới tính không được để trống"),
        address: Yup.string(),
        phoneNumber: Yup.string().matches(/^[0-9]+$/, "Số điện thoại không hợp lệ"),
        username: Yup.string()
            .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
            .required("Tên đăng nhập không được để trống")
            .test('unique-username', 'Tên đăng nhập đã tồn tại', async function (value) {
                if (!value) return true; // Skip validation if empty
                const result = await debouncedUsernameCheck(value, this.createError);
                return result;
            }),
        password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận phải trùng khớp').required("Mật khẩu xác nhận không được để trống")
    });

    const debouncedEmailCheck = debounce(async (email, setFieldError) => {
        try {
            const object = {email: email};
            const exists = await checkEmailExists(object);
            if (exists) {
                setFieldError('email', 'Email đã tồn tại');
                return false;
            }
            setFieldError('email', null);
            return true;
        } catch (error) {
            console.error("Lỗi khi kiểm tra email:", error);
            setFieldError('email', 'Lỗi khi kiểm tra email');
            return false;
        }
    }, 500);


    const debouncedUsernameCheck = debounce(async (username, setFieldError) => {
        try {
            const object = {username: username};
            const exists = await checkUsernameExists(object);
            if (exists) {
                setFieldError('username', 'Tên đăng nhập đã tồn tại');
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error checking username:", error);
            return false;
        }
    }, 500);


    const handleOnSubmit = async (values, {resetForm}) => {
        // Tách dữ liệu user và account
        const userData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            dateOfBirth: values.dateOfBirth,
            gender: values.gender,
            address: values.address,
            phoneNumber: values.phoneNumber
        };

        console.log(userData)

        const accountData = {
            username: values.username,
            password: values.password,
            userId: ''
        };

        console.log(accountData)


        console.log("----dăng ký run------")

        // Gọi API để tạo user
        const createdUser = await createUser(userData);
        if (!createdUser) {
            console.log("Tạo account không thành công")
            setInitialValues(values)
            return;
        } else {
            accountData.userId = createdUser.id;
            console.log("----------")
            console.log(accountData)
            const check = await createAccount(accountData);
            if (check) {
                resetForm();
                navigate('/login', {
                    state: {
                        username: accountData.username,
                        name: userData.firstName + " " + userData.lastName,
                        gender: userData.gender
                    }
                });
                // navigate('/login',{state:{name: userData.firstName + " " + userData.lastName}});
            } else {
                console.log("Tạo account không thành công")
                setInitialValues(values)
                return;
            }

        }
    }

    return (

        <div className={`container ${styles.registerContainer}`}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className={`card ${styles.registerCard}`}>
                        <div className="card-body">
                            <h2 className={`card-title text-center ${styles.registerTitle}`}>ĐĂNG KÝ TÀI KHOẢN</h2>
                            <p className={styles.requiredFieldNote}>Các ô có dấu * là bắt buộc</p>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleOnSubmit}
                                validateOnChange={true}
                                validateOnBlur={true}
                            >
                                {({isSubmitting, setFieldError}) => (
                                    <Form className="row g-3">
                                        <div className={`col-md-6 ${styles.formGroup}`}>
                                            <label htmlFor="firstName"
                                                   className={`form-label ${styles.formLabel} ${styles.requiredField}`}>Tên</label>
                                            <Field className={`form-control ${styles.formControl}`} type="text"
                                                   name="firstName" id="firstName"/>
                                            <ErrorMessage name="firstName" component="div"
                                                          className={styles.errorMessage}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="lastName"
                                                   className={`form-label ${styles.requiredField}`}>Họ</label>
                                            <Field className="form-control" type="text" name="lastName" id="lastName"/>
                                            <ErrorMessage name="lastName" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="email"
                                                   className={`form-label ${styles.requiredField}`}>Email:</label>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="email"
                                                id="email"
                                                validate={(value) => {
                                                    debouncedEmailCheck(value, setFieldError);
                                                }}

                                            />
                                            <ErrorMessage name="email" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label>
                                            <Field className="form-control" type="date" name="dateOfBirth"
                                                   id="dateOfBirth"/>
                                            <ErrorMessage name="dateOfBirth" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="gender" className={`form-label ${styles.requiredField}`}>Giới
                                                tính</label>
                                            <Field as="select" className="form-select" name="gender" id="gender">
                                                <option value="">Chọn giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </Field>
                                            <ErrorMessage name="gender" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                                            <Field className="form-control" type="tel" name="phoneNumber"
                                                   id="phoneNumber"/>
                                            <ErrorMessage name="phoneNumber" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="address" className="form-label">Địa chỉ</label>
                                            <Field className="form-control" type="text" name="address" id="address"/>
                                            <ErrorMessage name="address" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="username" className={`form-label ${styles.requiredField}`}>Tên
                                                đăng nhập</label>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="username"
                                                id="username"
                                                validate={(value) => {
                                                    debouncedUsernameCheck(value, setFieldError);
                                                }}

                                            />
                                            <ErrorMessage name="username" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="password" className={`form-label ${styles.requiredField}`}>Mật
                                                khẩu</label>
                                            <div className={styles.passwordInputWrapper}>
                                                <Field
                                                    className="form-control"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    id="password"
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.passwordToggle}
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                                </button>
                                            </div>
                                            <ErrorMessage name="password" component="div" className="text-danger"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="confirmPassword"
                                                   className={`form-label ${styles.requiredField}`}>Xác nhận mật
                                                khẩu</label>
                                            <div className={styles.passwordInputWrapper}>
                                                <Field
                                                    className="form-control"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    id="confirmPassword"
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.passwordToggle}
                                                    onClick={toggleConfirmPasswordVisibility}
                                                >
                                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye}/>
                                                </button>
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="div"
                                                          className="text-danger"/>
                                        </div>

                                        <div className="col-12">
                                            <button type="submit" className={`btn ${styles.submitButton}`}
                                                    disabled={isSubmitting}>
                                                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                                            </button>
                                        </div>
                                        <button type="button" className={styles.cancelButton}
                                                onClick={() => navigate(-1)}>
                                            Hủy
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}

