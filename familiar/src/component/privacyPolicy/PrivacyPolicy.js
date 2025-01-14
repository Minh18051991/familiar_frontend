import React, { useState } from 'react';
import styles from './PrivacyPolicy.module.css';
import {FaShieldAlt, FaInfoCircle, FaLock, FaUserShield, FaFileAlt, FaQuestionCircle} from 'react-icons/fa';
import FooterComponent from "../footer/FooterComponent";

const PrivacyPolicy = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };


    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>CHÍNH SÁCH BẢO MẬT</h1>
                </header>

                <p className={styles.intro}>
                    Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi
                    thu
                    thập, sử dụng, và bảo vệ thông tin cá nhân của bạn.
                </p>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(1)}>
                        <FaInfoCircle className={styles.icon}/> 1. Thông Tin Chúng Tôi Thu Thập
                    </h2>
                    {expandedSection === 1 && (
                        <p className={styles.text}>
                            Chúng tôi có thể thu thập các thông tin cá nhân như tên, địa chỉ email, số điện thoại, và
                            các
                            thông tin khác khi bạn sử dụng dịch vụ của chúng tôi.
                        </p>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(2)}>
                        <FaShieldAlt className={styles.icon}/> 2. Cách Chúng Tôi Sử Dụng Thông Tin
                    </h2>
                    {expandedSection === 2 && (
                        <p className={styles.text}>
                            Thông tin của bạn sẽ được sử dụng để cung cấp và cải thiện dịch vụ, liên hệ với bạn, và tuân
                            thủ
                            các yêu cầu pháp lý.
                        </p>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(3)}>
                        <FaLock className={styles.icon}/> 3. Bảo Mật Thông Tin
                    </h2>
                    {expandedSection === 3 && (
                        <p className={styles.text}>
                            Chúng tôi thực hiện các biện pháp bảo mật cần thiết để bảo vệ thông tin cá nhân của bạn khỏi
                            truy cập trái phép, tiết lộ, hoặc phá hủy.
                        </p>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(4)}>
                        <FaUserShield className={styles.icon}/> 4. Quyền Của Bạn
                    </h2>
                    {expandedSection === 4 && (
                        <p className={styles.text}>
                            Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ với
                            chúng
                            tôi nếu bạn có bất kỳ câu hỏi nào về chính sách này.
                        </p>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(5)}>
                        <FaFileAlt className={styles.icon}/> 5. Tài Liệu Liên Quan
                    </h2>
                    {expandedSection === 5 && (
                        <div className={styles.text}>
                            <p>Để hiểu rõ hơn về chính sách bảo mật của chúng tôi, vui lòng tham khảo các tài liệu
                                sau:</p>
                            <ul>
                                <li><a href="/documents/terms-of-service.pdf" target="_blank" rel="noopener noreferrer">Điều
                                    khoản dịch vụ</a></li>
                                <li><a href="/documents/data-protection-guide.pdf" target="_blank"
                                       rel="noopener noreferrer">Hướng dẫn bảo vệ dữ liệu</a></li>
                                <li><a href="/documents/cookie-policy.pdf" target="_blank" rel="noopener noreferrer">Chính
                                    sách Cookie</a></li>
                            </ul>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(6)}>
                        <FaQuestionCircle className={styles.icon}/> 6. Câu Hỏi Thường Gặp
                    </h2>
                    {expandedSection === 6 && (
                        <div className={styles.text}>
                            <h3>Làm thế nào để yêu cầu xóa dữ liệu của tôi?</h3>
                            <p>Bạn có thể gửi yêu cầu xóa dữ liệu bằng cách liên hệ với bộ phận hỗ trợ khách hàng của
                                chúng
                                tôi.</p>
                            <h3>Dữ liệu của tôi được lưu trữ ở đâu?</h3>
                            <p>Dữ liệu của bạn được lưu trữ an toàn trên các máy chủ được bảo mật của chúng tôi tại các
                                trung tâm dữ liệu được chứng nhận.</p>
                        </div>
                    )}
                </section>

                <p className={styles.conclusion}>
                    Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Chúng tôi luôn sẵn sàng giải đáp mọi thắc
                    mắc
                    của bạn về chính sách bảo mật này.
                </p>

            </div>
            <FooterComponent/>
        </>

    );
};

export default PrivacyPolicy;