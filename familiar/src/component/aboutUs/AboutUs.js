import React from 'react';
import styles from './AboutUs.module.css';
import FooterComponent from "../footer/FooterComponent";

const AboutUs = () => {
    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}> VỀ CHÚNG TÔI </h1>
                </header>

                <section className={styles.section}>
                    <div className={styles.content}>
                        <h2 className={styles.subtitle}>Sứ Mệnh</h2>
                        <p className={styles.text}>
                            Chúng tôi tin rằng tình yêu có thể được tìm thấy ở mọi nơi. Sứ mệnh của chúng tôi là kết nối
                            mọi người,
                            tạo ra những mối quan hệ ý nghĩa và giúp bạn tìm thấy người đặc biệt của mình.
                        </p>
                    </div>
                    <img src="https://img.pikbest.com/origin/09/22/71/09NpIkbEsTzUE.png!w700wp"
                         alt="Sứ mệnh của chúng tôi" className={styles.image}/>
                </section>

                <section className={styles.section}>
                    <div className={styles.content}>
                        <h2 className={styles.subtitle}>Đội Ngũ</h2>
                        <p className={styles.text}>
                            Đội ngũ của chúng tôi gồm những chuyên gia đam mê về công nghệ và tâm lý học.
                            Chúng tôi làm việc không ngừng nghỉ để mang đến cho bạn trải nghiệm hẹn hò tốt nhất có thể.
                        </p>
                    </div>
                    <img
                        src="https://premium.elsaspeak.com/wp-content/uploads/2024/03/gioi-thieu-nhom-bang-tieng-anh.png"
                        alt="Đội ngũ của chúng tôi" className={styles.image}/>
                </section>

                <section className={styles.section}>
                    <div className={styles.content}>
                        <h2 className={styles.subtitle}>Công Nghệ </h2>
                        <p className={styles.text}>
                            Chúng tôi sử dụng các thuật toán tiên tiến và học máy để đảm bảo bạn được kết nối với những
                            người phù hợp nhất.
                            An toàn và bảo mật luôn là ưu tiên hàng đầu của chúng tôi.
                        </p>
                    </div>
                    <img
                        src="https://cdn.123job.vn/123job//uploads/images/c%C3%B4ng-ngh%E1%BB%87-th%C3%B4ng-tin-4_0.jpg"
                        alt="Công nghệ của chúng tôi" className={styles.image}/>
                </section>

                <section className={styles.section}>
                    <div className={styles.content}>
                        <h2 className={styles.subtitle}>Cộng Đồng </h2>
                        <p className={styles.text}>
                            Chúng tôi tự hào về cộng đồng đa dạng và hòa nhập của mình. Tại đây, mọi người đều được chào
                            đón
                            và tôn trọng,
                            bất kể xuất thân, định hướng tình dục hay niềm tin của họ.
                        </p>
                    </div>
                    <img src="https://subiz.com.vn/blog/wp-content/uploads/2020/12/cong-dong-truc-tuyen.png"
                         alt="Cộng đồng của chúng tôi" className={styles.image}/>
                </section>

                <section className={styles.section}>
                    <div className={styles.content}>
                        <h2 className={styles.subtitle}>Liên Hệ </h2>
                        <p className={styles.text}>
                            Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn. Nếu bạn có bất kỳ câu hỏi, đề xuất hoặc
                            phản
                            hồi nào,
                            đừng ngần ngại liên hệ với chúng tôi qua email: support@familiar.com hoặc số điện thoại:
                            0123-456-789.
                        </p>
                    </div>
                    <img src="https://img.lovepik.com/photo/45007/3159.jpg_wh860.jpg" alt="Liên hệ với chúng tôi"
                         className={styles.image}/>
                </section>
            </div>
            <FooterComponent/>
        </>
    );
};

export default AboutUs;