import React, { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useCurrency } from '../../../../context/CurrencyContext';

const TopBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { selectedLocale, setLocale } = useCurrency();
    const menuRef = useRef(null);

    const locales = [
        { code: 'EN', currency: 'USD', label: 'English / USD' },
        { code: 'IN', currency: 'INR', label: 'Hindi / INR' },
        { code: 'FR', currency: 'EUR', label: 'French / EUR' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocaleSelect = (locale) => {
        setLocale(locale);
        setIsMenuOpen(false);
    };

    const styles = {
        bar: {
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '11px',
            padding: '10px 0',
            textAlign: 'center',
            position: 'relative',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            zIndex: 1001 // Ensure it sits above other headers
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1440px',
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
            position: 'relative' // For dropdown positioning
        },
        link: {
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        },
        dropdown: {
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#fff',
            color: '#000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            padding: '5px 0',
            minWidth: '120px',
            zIndex: 1002,
            marginTop: '5px'
        },
        dropdownItem: {
            padding: '10px 15px',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '11px',
            fontWeight: '500',
            transition: 'background 0.2s',
            display: 'flex',
            justifyContent: 'space-between'
        }
    };

    return (
        <div style={styles.bar}>
            <div style={styles.container}>
                <div style={styles.link}>7 Days Easy Return</div>
                <div style={styles.centerText}>Free Shipping on Orders Above $99</div>

                <div style={styles.rightSide} ref={menuRef}>
                    <div
                        style={styles.link}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <FaGlobe /> {selectedLocale.code} / {selectedLocale.currency} <FaChevronDown size={8} />
                    </div>

                    {isMenuOpen && (
                        <div style={styles.dropdown}>
                            {locales.map((locale) => (
                                <div
                                    key={locale.code}
                                    style={{
                                        ...styles.dropdownItem,
                                        backgroundColor: selectedLocale.code === locale.code ? '#f5f5f5' : '#fff'
                                    }}
                                    onClick={() => handleLocaleSelect(locale)}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => {
                                        if (selectedLocale.code !== locale.code) e.target.style.backgroundColor = '#fff'
                                    }}
                                >
                                    {locale.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
