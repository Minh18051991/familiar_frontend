import React from 'react';
import styles from './LoadingSpinner.module.css';

function LoadingSpinner({ show }) {
    if (!show) {
        return null;
    }

    return (
        <div className={styles.spinnerOverlay}>
            <div className={styles.spinnerContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Loading...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;