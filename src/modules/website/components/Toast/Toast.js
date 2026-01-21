
import React, { useEffect } from 'react';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast-notification ${type} slide-in`}>
            <div className="toast-icon">
                {type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
            </div>
            <div className="toast-message">{message}</div>
        </div>
    );
};

export default Toast;
