import React from 'react';

const AdminPlaceholder = ({ title }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ fontSize: '2rem', color: '#94a3b8' }}>{title}</h2>
            <p style={{ color: '#64748b' }}>Module coming soon.</p>
        </div>
    );
};

export default AdminPlaceholder;
