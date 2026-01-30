import React from 'react';
import Select from 'react-select';

const customStyles = {
    control: (base, state) => ({
        ...base,
        background: '#ffffff',
        borderColor: state.isFocused ? 'var(--admin-primary)' : 'var(--admin-border)',
        borderRadius: '8px',
        borderWidth: '1px',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none',
        padding: '2px',
        fontSize: '0.85rem',
        minHeight: '38px',
        '&:hover': {
            borderColor: state.isFocused ? 'var(--admin-primary)' : '#cbd5e1'
        }
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '0.85rem',
        backgroundColor: state.isSelected
            ? 'var(--admin-primary)'
            : state.isFocused
                ? '#f1f5f9'
                : 'transparent',
        color: state.isSelected ? 'white' : 'var(--admin-text)',
        cursor: 'pointer',
        ':active': {
            backgroundColor: 'var(--admin-primary)',
        },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '8px',
        marginTop: '8px',
        border: '1px solid var(--admin-border)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 9999
    }),
    singleValue: (base) => ({
        ...base,
        color: 'var(--admin-text)',
        fontWeight: '500'
    }),
    placeholder: (base) => ({
        ...base,
        color: 'var(--admin-text-muted)',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: 'var(--admin-text-secondary)',
        padding: '4px 8px',
        '&:hover': {
            color: 'var(--admin-text)'
        }
    }),
    indicatorSeparator: () => ({
        display: 'none'
    })
};

const AdminSelect = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className,
    isMulti = false,
    isSearchable = true,
    isLoading = false,
    isDisabled = false,
    styles = {}
}) => {
    // Handle simple value passing (if value is just string/number, find the option)
    const getSelectedOption = () => {
        if (!value) return null;
        if (isMulti) {
            return options.filter(opt => value.includes(opt.value));
        }
        return options.find(opt => opt.value === value) || (value.label ? value : null);
    };

    return (
        <Select
            className={`admin-react-select ${className || ''}`}
            options={options}
            value={getSelectedOption()}
            onChange={(selected) => {
                if (isMulti) {
                    onChange(selected ? selected.map(opt => opt.value) : []);
                } else {
                    onChange(selected ? selected.value : null);
                }
            }}
            placeholder={placeholder}
            styles={{ ...customStyles, ...styles }}
            isMulti={isMulti}
            isSearchable={isSearchable}
            isLoading={isLoading}
            isDisabled={isDisabled}
        />
    );
};

export default AdminSelect;
