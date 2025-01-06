import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FooterComponent.module.css';

function FooterComponent() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3>Về Familiar</h3>
                    <p>Kết nối mọi người, xây dựng cộng đồng.</p>
                </div>
                <div className={styles.footerSection}>
                    <h3>Liên kết</h3>
                    <ul>
                        <li><Link to="/about">Về chúng tôi</Link></li>
                        <li><Link to="/privacy">Chính sách bảo mật</Link></li>
                        <li><Link to="/terms">Điều khoản sử dụng</Link></li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h3>Theo dõi chúng tôi</h3>
                    <div className={styles.socialIcons}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            {/*<div className={styles.footerBottom}>*/}
            {/*    <p>&copy; 2025 Familiar. All rights reserved.</p>*/}
            {/*</div>*/}
        </footer>
    );
}

export default FooterComponent;