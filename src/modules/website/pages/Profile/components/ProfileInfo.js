import React, { useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { authService } from '../../../../../services/authService';

const ProfileInfo = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        // Static mock data for now as these aren't in User model yet
        country: 'India',
        city: 'New Delhi',
        zip: '110001',
        address: '123 Main Street'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Only update name and mobile for now as per backend support
            const res = await authService.updateProfile({
                name: formData.name,
                mobile: formData.mobile
            });

            if (res.success) {
                updateProfile({
                    name: formData.name,
                    mobile: formData.mobile
                });
                setIsEditing(false);
                alert("Profile Updated Successfully!");
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Profile Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ background: '#ff9800', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Edit
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => {
                                setFormData({
                                    name: user?.name || '',
                                    email: user?.email || '',
                                    mobile: user?.mobile || '',
                                    country: 'India',
                                    city: 'New Delhi',
                                    zip: '110001',
                                    address: '123 Main Street'
                                });
                                setIsEditing(false);
                            }}
                            style={{ background: '#eee', color: '#333', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            <div style={{ maxWidth: '600px' }}>
                <InfoRow
                    label="Name"
                    name="name"
                    value={formData.name}
                    isEditing={isEditing}
                    onChange={handleChange}
                />
                <InfoRow
                    label="Email"
                    name="email"
                    value={formData.email}
                    editable={false}
                    isEditing={isEditing}
                />
                <InfoRow
                    label="Phone"
                    name="mobile"
                    value={formData.mobile}
                    isEditing={isEditing}
                    onChange={handleChange}
                />
                <InfoRow
                    label="Country"
                    name="country"
                    value={formData.country}
                    editable={false}
                    isEditing={isEditing}
                />
                <InfoRow
                    label="City"
                    name="city"
                    value={formData.city}
                    editable={false}
                    isEditing={isEditing}
                />
                <InfoRow
                    label="Zip"
                    name="zip"
                    value={formData.zip}
                    editable={false}
                    isEditing={isEditing}
                />
                <InfoRow
                    label="Address"
                    name="address"
                    value={formData.address}
                    editable={false}
                    isEditing={isEditing}
                />
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, name, editable = true, isEditing, onChange }) => (
    <div style={{ display: 'flex', marginBottom: '15px' }}>
        <div style={{ width: '150px', fontWeight: 'bold', color: '#555' }}>{label}:</div>
        <div style={{ flex: 1 }}>
            {isEditing && editable ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    style={{
                        width: '100%', padding: '5px 10px',
                        border: '1px solid #ddd', borderRadius: '4px'
                    }}
                />
            ) : (
                <span style={{ color: '#777' }}>{value || '-'}</span>
            )}
        </div>
    </div>
);

export default ProfileInfo;
