import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const rates = {
    'USD': 1,
    'INR': 83.50,
    'EUR': 0.92
};

const symbols = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€'
};

export const CurrencyProvider = ({ children }) => {
    const [selectedLocale, setSelectedLocale] = useState({ code: 'EN', currency: 'USD' });

    const formatPrice = (priceInUSD) => {
        const currency = selectedLocale.currency;
        const rate = rates[currency] || 1;
        const convertedPrice = priceInUSD * rate;
        const symbol = symbols[currency] || '$';

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
