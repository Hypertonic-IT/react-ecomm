import React, { useState, useRef, useEffect } from 'react';
import GoogleTranslate from '../GoogleTranslate/GoogleTranslate';

const TopBar = () => {
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('English');
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (lang) => {
        setCurrentLang(lang.name);
        setIsLangOpen(false);

        // Programmatically trigger Google Translate
        const googleCombo = document.querySelector('.goog-te-combo');
        if (googleCombo) {
            googleCombo.value = lang.code;
            googleCombo.dispatchEvent(new Event('change'));
        } else {
            // Fallback for cookie-based if combo not found immediately
            document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${window.location.hostname}`;
            window.location.reload();
        }
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const styles = {
        bar: {
            backgroundColor: '#000',
            color: '#fff',
            fontSize: isMobile ? '8px' : '11px',
            padding: isMobile ? '6px 0' : '8px 0',
            textAlign: 'center',
            position: 'relative',
            textTransform: 'uppercase',
            letterSpacing: isMobile ? '0.5px' : '1px',
            zIndex: 1001,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: isMobile ? '0 8px' : '0 40px',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
        },
        centerText: {
            flex: 1,
            textAlign: 'center',
            fontWeight: '600',
            fontSize: isMobile ? '8px' : 'inherit',
            order: isMobile ? 3 : 0,
            width: isMobile ? '100%' : 'auto',
            marginTop: isMobile ? '4px' : '0'
        },
        rightSide: {
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '20px',
        },
        dropdown: {
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: isMobile ? '2px 4px' : '4px 8px',
            borderRadius: '4px',
            transition: 'background 0.2s',
            userSelect: 'none',
            fontSize: isMobile ? '8px' : 'inherit'
        },
        menu: {
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            width: '140px',
            padding: '8px 0',
            display: isLangOpen ? 'block' : 'none',
            zIndex: 1002,
            border: '1px solid #eee'
        },
        menuItem: {
            padding: '10px 16px',
            fontSize: '12px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'background 0.2s',
            fontWeight: '500',
            textTransform: 'none',
            letterSpacing: 'normal'
        },
        leftSide: {
            display: 'flex',
            gap: isMobile ? '6px' : '20px',
            fontSize: isMobile ? '7px' : 'inherit'
        }
    };


    return (
        <div style={styles.bar}>
            <div style={styles.container}>
                <div style={styles.leftSide}>
                    <div style={{ opacity: 0.8 }}>7 Days Easy Return</div>
                    <div style={{ opacity: 0.8 }}>Quality Guarantee</div>
                </div>

                <div style={styles.centerText}>Free Shipping on Orders Above ₹8,299</div>

                <div style={styles.rightSide}>
                    {/* Hidden Google Component */}
                    <GoogleTranslate />

                    {/* Attractive Custom Selector */}
                    <div style={styles.dropdown} ref={dropdownRef} onClick={() => setIsLangOpen(!isLangOpen)}>
                        <span>{currentLang}</span>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: isLangOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <div style={styles.menu}>
                            {languages.map((lang) => (
                                <div
                                    key={lang.code}
                                    style={styles.menuItem}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLanguageChange(lang);
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    {lang.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

