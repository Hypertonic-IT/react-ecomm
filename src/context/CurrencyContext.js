import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const rates = {
    'INR': 1,
    'USD': 0.012, // 1 INR ~= 0.012 USD
    'EUR': 0.011
};

const symbols = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€'
};

export const CurrencyProvider = ({ children }) => {
    const [selectedLocale, setSelectedLocale] = useState({ code: 'IN', currency: 'INR' });

    const formatPrice = (price) => {
        if (!price && price !== 0) return '₹0.00';
        const currency = selectedLocale.currency;
        const rate = rates[currency] || 1;
        const convertedPrice = price * rate;
        const symbol = symbols[currency] || '₹';

        return `${symbol}${convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const setLocale = (locale) => {
        setSelectedLocale(locale);
    };

    return (
        <CurrencyContext.Provider value={{ selectedLocale, setLocale, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};
