import React from 'react';
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {checkUsernameExists, createAccount} from "../../service/account/account";
import {createUser} from "../../service/user/user";
import {useNavigate} from "react-router-dom";
import moment from 'moment'; // Đảm bảo bạn đã import moment
import debounce from 'lodash/debounce';

export default function RegisterComponent() {

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        firstName: Yup.string().required("Tên không được để trống"),
        lastName: Yup.string().required("Họ không được để trống"),
        email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
        dateOfBirth: Yup.date()
            .required("Ngày sinh không được để trống")
            .max(moment().subtract(16, 'years'), "Bạn phải đủ 16 tuổi trở lên")
            .test(
                "is-over-16",
                "Bạn phải đủ 16 tuổi trở lên",
                function(value) {
                    return moment().diff(moment(value), 'years') >= 16;
                }
            ),
        gender: Yup.string().required("Giới tính không được để trống"),
        address: Yup.string().required("Địa chỉ không được để trống"),
        phoneNumber: Yup.string().matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").required("Số điện thoại không được để trống"),
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

    const initialValues = {
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
    }

    const debouncedUsernameCheck = debounce(async (username, setFieldError) => {
        try {
            const object = { username: username  };
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
            password: values.password // Lưu ý: Không nên gửi mật khẩu dưới dạng plain text
        };

        console.log(accountData)


console.log("----dăng ký run------")

        // Gọi API để tạo user
        const createdUser = await createUser(userData);

        // Nếu tạo user thành công, tạo account
        if (createdUser && createdUser.id) {
            accountData.userId = createdUser.id;
             const check =  await createAccount(accountData);
             if (check) {
                 resetForm();
                 navigate('/login');
             }else {
                 console.log("Tạo account không thành công")
                 resetForm();
                 return;
             }

        }




        resetForm();
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Đăng ký tài khoản</h2>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleOnSubmit}
                                validateOnChange={true}
                                validateOnBlur={true}
                            >
                                {({ isSubmitting, setFieldError }) => (
                                    <Form className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="firstName" className="form-label">Tên</label>
                                            <Field className="form-control" type="text" name="firstName" id="firstName" />
                                            <ErrorMessage name="firstName" component="div" className="text-danger" />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="lastName" className="form-label">Họ</label>
                                            <Field className="form-control" type="text" name="lastName" id="lastName" />
                                            <ErrorMessage name="lastName" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <Field className="form-control" type="email" name="email" id="email" />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label>
                                            <Field className="form-control" type="date" name="dateOfBirth" id="dateOfBirth" />
                                            <ErrorMessage name="dateOfBirth" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="gender" className="form-label">Giới tính</label>
                                            <Field as="select" className="form-select" name="gender" id="gender">
                                                <option value="">Chọn giới tính</option>
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </Field>
                                            <ErrorMessage name="gender" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                                            <Field className="form-control" type="tel" name="phoneNumber" id="phoneNumber" />
                                            <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="address" className="form-label">Địa chỉ</label>
                                            <Field className="form-control" type="text" name="address" id="address" />
                                            <ErrorMessage name="address" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="username"
                                                id="username"
                                                validate={(value) => {
                                                    debouncedUsernameCheck(value, setFieldError);
                                                }}

                                            />
                                            <ErrorMessage name="username" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                                            <Field className="form-control" type="password" name="password" id="password" />
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                                            <Field className="form-control" type="password" name="confirmPassword" id="confirmPassword" />
                                            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                        </div>

                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}