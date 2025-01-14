import React, { useState } from 'react';
import styles from './TermsOfService.module.css';
import { FaUserFriends, FaComments, FaEnvelope, FaExclamationTriangle, FaShieldAlt, FaBalanceScale } from 'react-icons/fa';
import FooterComponent from "../footer/FooterComponent";

const TermsOfService = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };



    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>ĐIỀU KHOẢN SỬ DỤNG</h1>
                </header>

                <p className={styles.intro}>
                    Chào mừng bạn đến với dịch vụ hẹn hò của chúng tôi. Bằng cách sử dụng dịch vụ này, bạn đồng ý tuân thủ các điều khoản sau đây.
                </p>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(1)}>
                        <FaUserFriends className={styles.icon} /> 1. Đăng ký và Tài khoản
                    </h2>
                    {expandedSection === 1 && (
                        <div className={styles.text}>
                            <p>- Bạn phải ít nhất 16 tuổi để sử dụng dịch vụ của chúng tôi.</p>
                            <p>- Bạn đồng ý cung cấp thông tin chính xác và cập nhật trong hồ sơ của mình.</p>
                            <p>- Mỗi người chỉ được tạo một tài khoản và không được chia sẻ tài khoản với người khác.</p>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(2)}>
                        <FaComments className={styles.icon} /> 2. Đăng bài và Bình luận
                    </h2>
                    {expandedSection === 2 && (
                        <div className={styles.text}>
                            <p>- Bạn chịu trách nhiệm về nội dung bạn đăng trên nền tảng của chúng tôi.</p>
                            <p>- Không đăng nội dung xúc phạm, phân biệt đối xử, hoặc bất hợp pháp.</p>
                            <p>- Chúng tôi có quyền xóa bất kỳ nội dung nào vi phạm điều khoản sử dụng.</p>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(3)}>
                        <FaEnvelope className={styles.icon} /> 3. Nhắn tin
                    </h2>
                    {expandedSection === 3 && (
                        <div className={styles.text}>
                            <p>- Không gửi tin nhắn spam hoặc quấy rối người khác.</p>
                            <p>- Tôn trọng quyền riêng tư của người khác và không chia sẻ thông tin cá nhân mà không được phép.</p>
                            <p>- Báo cáo bất kỳ hành vi đáng ngờ nào cho đội ngũ hỗ trợ của chúng tôi.</p>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(4)}>
                        <FaExclamationTriangle className={styles.icon} /> 4. Hành vi bị cấm
                    </h2>
                    {expandedSection === 4 && (
                        <div className={styles.text}>
                            <p>- Lừa đảo hoặc gian lận dưới mọi hình thức.</p>
                            <p>- Quấy rối, đe dọa hoặc bắt nạt người dùng khác.</p>
                            <p>- Sử dụng dịch vụ cho mục đích thương mại mà không có sự đồng ý của chúng tôi.</p>
                            <p>- Cố gắng phá hoại hoặc can thiệp vào hoạt động của hệ thống.</p>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(5)}>
                        <FaShieldAlt className={styles.icon} /> 5. Bảo mật và Quyền riêng tư
                    </h2>
                    {expandedSection === 5 && (
                        <div className={styles.text}>
                            <p>- Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính sách Bảo mật của chúng tôi.</p>
                            <p>- Bạn đồng ý không chia sẻ thông tin đăng nhập của mình với bất kỳ ai.</p>
                            <p>- Báo cáo ngay lập tức nếu bạn nghi ngờ tài khoản của mình bị xâm phạm.</p>
                        </div>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle} onClick={() => toggleSection(6)}>
                        <FaBalanceScale className={styles.icon} /> 6. Thay đổi điều khoản và Chấm dứt dịch vụ
                    </h2>
                    {expandedSection === 6 && (
                        <div className={styles.text}>
                            <p>- Chúng tôi có quyền thay đổi điều khoản sử dụng và sẽ thông báo cho bạn về những thay đổi quan trọng.</p>
                            <p>- Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu vi phạm điều khoản sử dụng.</p>
                            <p>- Bạn có thể chấm dứt tài khoản của mình bất cứ lúc nào bằng cách liên hệ với chúng tôi.</p>
                        </div>
                    )}
                </section>

                <p className={styles.conclusion}>
                    Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>

            </div>
            <FooterComponent />
        </>
    );
};

export default TermsOfService;