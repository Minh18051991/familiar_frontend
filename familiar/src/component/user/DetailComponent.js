import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getUserById, updateUser} from "../../service/user/user";
import {toast} from "react-toastify";
import moment from 'moment';
import styles from './DetailComponent.module.css';

function DetailComponent() {
    const {id} = useParams();
    let userId = parseInt(id);
    const [user, setUser] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const userDetail = await getUserById(userId);
            setUser(userDetail);
        }
        fetchData();
    }, [userId]);

    if (!user) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    const handleEdit = (field, value) => {
        setEditingField(field);
        setEditValue(value || "");
    };

    const formatDateForDisplay = (isoDate) => {
        if (!isoDate) return "";
        return moment(isoDate).format('DD/MM/YYYY'); // Hiển thị dạng DD/MM/YYYY
    };

    const formatDateForBackend = (displayDate) => {
        return moment(displayDate, 'DD/MM/YYYY').format('YYYY-MM-DD'); // Chuyển đổi sang YYYY-MM-DD cho backend
    };

    const handleSave = async (field) => {
        let valueToUpdate = editValue;

        if (field === 'dateOfBirth') {
            // Chuyển đổi ngày từ định dạng hiển thị sang định dạng cho backend
            valueToUpdate = formatDateForBackend(editValue);
        }

        const updateUserData = {...user, [field]: valueToUpdate};


        const updatedUser = await updateUser(userId, updateUserData);
        setUser(updatedUser);
        setEditingField(null);
        toast.success("Cập nhật thành công!");

    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue("");
    };

    const renderGenderField = (label, field, value) => (
        <tr>
            <th>{label}</th>
            <td>
                {editingField === field ? (
                    <>
                        <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className={`form-select ${styles.formControl}`}
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                        <div className="mt-2">
                            <button onClick={() => handleSave(field)} className={`btn btn-sm btn-primary ${styles.saveButton}`}>
                                Lưu
                            </button>
                            <button onClick={handleCancel} className="btn btn-sm btn-secondary">
                                Hủy
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                    <span className={value ? '' : styles.noInfo}>
                        {value === 'male' ? 'Nam' : value === 'female' ? 'Nữ' : value === 'other' ? 'Khác' : 'Chưa có thông tin'}
                    </span>
                        <button onClick={() => handleEdit(field, value)}
                                className={`btn btn-sm btn-outline-primary ${styles.editButton}`}>
                            Chỉnh sửa
                        </button>
                    </>
                )}
            </td>
        </tr>
    );

    const renderField = (label, field, value) => (
        <tr>
            <th>{label}</th>
            <td>
                {editingField === field ? (
                    <>
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className={`form-control ${styles.formControl}`}
                        />
                        <div className="mt-2">
                            <button onClick={() => handleSave(field)} className={`btn btn-sm btn-primary ${styles.saveButton}`}>
                                Lưu
                            </button>
                            <button onClick={handleCancel} className="btn btn-sm btn-secondary">
                                Hủy
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                    <span className={value ? '' : styles.noInfo}>
                        {field === 'dateOfBirth' ? formatDateForDisplay(value) : (value || "Chưa có thông tin")}
                    </span>
                        <button onClick={() => handleEdit(field, field === 'dateOfBirth' ? formatDateForDisplay(value) : value)}
                                className={`btn btn-sm btn-outline-primary ${styles.editButton}`}>
                            Chỉnh sửa
                        </button>
                    </>
                )}
            </td>
        </tr>
    );



    const getDefaultProfilePicture = (gender) => {
        switch(gender) {
            case 'female':
                return "https://antimatter.vn/wp-content/uploads/2022/04/anh-avatar-trang-co-gai-toc-tem.jpg";
            case 'male':
                return "https://static2.yan.vn/YanNews/2167221/202003/dan-mang-du-trend-thiet-ke-avatar-du-kieu-day-mau-sac-tu-anh-mac-dinh-b0de2bad.jpg";
            default:
                return "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";
        }
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className="row">
                <div className="col-md-4">
                    <div className={`card ${styles.profileCard}`}>
                        <img
                            src={user.profilePictureUrl || getDefaultProfilePicture(user.gender)}
                            className={`card-img-top ${styles.profileImage}`}
                            alt="Profile Picture"
                        />
                        <div className="card-body">
                        <h5 className="card-title">{user.firstName} {user.lastName}</h5>
                            <button className={`btn btn-sm btn-outline-primary mt-2 ${styles.editProfileButton}`}>Chỉnh sửa ảnh đại diện</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className={`card ${styles.detailsCard}`}>
                        <div className="card-body">
                            <h5 className={`card-title ${styles.cardTitle}`}>Thông tin chi tiết</h5>
                            <table className={`table ${styles.table}`}>
                                <tbody>
                                {renderGenderField("Giới tính", "gender", user.gender)}
                                {renderField("Địa chỉ", "address", user.address)}
                                {renderField("Nghề nghiệp", "occupation", user.occupation)}
                                {renderField("Email", "email", user.email)}
                                {renderField("Ngày sinh", "dateOfBirth", user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : null)}
                                {renderField("Thời gian tạo", "createdAt", user.createdAt ? new Date(user.createdAt).toLocaleString() : null)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`card ${styles.bioCard}`}>
                        <div className="card-body">
                            <h5 className={`card-title ${styles.cardTitle}`}>Tiểu sử</h5>
                            {editingField === 'bio' ? (
                                <>
                                    <textarea
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className={`form-control ${styles.formControl}`}
                                    />
                                    <div className="mt-2">
                                        <button onClick={() => handleSave('bio')}
                                                className={`btn btn-sm btn-primary ${styles.saveButton}`}>
                                            Lưu
                                        </button>
                                        <button onClick={handleCancel} className="btn btn-sm btn-secondary">
                                            Hủy
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className={`card-text ${user.bio ? '' : styles.noInfo}`}>
                                        {user.bio || "Chưa có thông tin"}
                                    </p>
                                    <button onClick={() => handleEdit('bio', user.bio)}
                                            className={`btn btn-sm btn-outline-primary ${styles.editButton}`}>
                                        Chỉnh sửa tiểu sử
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailComponent;


