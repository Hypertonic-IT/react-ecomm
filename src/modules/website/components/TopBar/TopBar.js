import React from 'react';
import { FaGlobe } from 'react-icons/fa';

const TopBar = () => {
    const styles = {
        bar: {
            backgroundColor: '#000', // Premium Black
            color: '#fff',
            fontSize: '11px', // Sleek small text
            padding: '10px 0',
            textAlign: 'center',
            position: 'relative',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1440px', // Wider implementation
            margin: '0 auto',
            padding: '0 40px'
        },
        centerText: {
            flex: 1,
            textAlign: 'center',
            fontWeight: '600'
        },
        rightSide: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            cursor: 'pointer'
        },
        link: {
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s',
            ':hover': { opacity: 1 }
        }
    };

    return (
        <div style={styles.bar}>
            <div style={styles.container}>
                <div style={styles.link}>7 Days Easy Return</div>
                <div style={styles.centerText}>Free Shipping on Orders Above $99</div>
                <div style={styles.rightSide}>
                    <div style={styles.link}><FaGlobe /> EN / USD</div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
