import React from'react';
import styles from './ImageModal.module.css';

const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Enlarged profile" className={styles.enlargedImage} />
                <button className={styles.closeButton} onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default ImageModal;