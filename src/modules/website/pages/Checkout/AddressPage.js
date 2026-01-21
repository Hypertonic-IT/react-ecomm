
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../../../context/AuthContext';
import { addressService } from '../../../../services/addressService';
import { FaPlus, FaTrash, FaEdit, FaCheckCircle, FaMapMarkerAlt, FaCreditCard, FaShoppingCart, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import './AddressPage.css';

const AddressPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modes: 'list' (default), 'form' (add/edit)
    const [viewMode, setViewMode] = useState('list');

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        type: 'Home'
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        const res = await addressService.getAllAddresses();
        if (res.success) {
            setAddresses(res.addresses);

            // Auto-select if a previous selection exists in local storage
            const savedId = localStorage.getItem('selectedAddress');
            if (savedId) {
                const matched = res.addresses.find(a => a.id === savedId);
                if (matched) setSelectedAddress(matched);
            }

            // If no addresses, ensure we are in list mode but maybe trigger a special empty state in render
            if (res.addresses.length === 0) {
                setSelectedAddress(null);
            }
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let res;
        if (editingId) {
            res = await addressService.updateAddress(editingId, formData);
        } else {
            res = await addressService.addAddress(formData);
        }

        if (res.success) {
            // Fix: Close form immediately on success
            setEditingId(null);
            setFormData({ name: '', mobile: '', street: '', city: '', state: '', zip: '', type: 'Home' });
            setViewMode('list');

            // Refresh list
            const newId = res.address ? (res.address.id || res.address._id) : null;
            if (newId) {
                localStorage.setItem('selectedAddress', newId);
            }
            fetchAddresses();
        } else {
            alert('Failed to save address: ' + (res.message || 'Please try again.'));
        }
    };

    const handleEdit = (addr) => {
        setFormData(addr);
        setEditingId(addr.id);
        setViewMode('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            await addressService.deleteAddress(id);
            // Refresh
            const res = await addressService.getAllAddresses();
            if (res.success) {
                setAddresses(res.addresses);
                if (selectedAddress && selectedAddress.id === id) {
                    setSelectedAddress(null); // Deselect if deleted
                }
            }
        }
    };

    const handleSelectAddress = (addr) => {
        setSelectedAddress(addr);
    };

    const handleProceed = () => {
        if (!selectedAddress) {
            alert('Please select an address to deliver to.');
            return;
        }
        localStorage.setItem('selectedAddress', selectedAddress.id);
        navigate('/checkout/payment');
    };

    // RENDER HELPERS
    const renderList = () => {
        const hasAddresses = addresses.length > 0;

        return (
            <div className="list-view fade-in">
                {/* Warning / Instruction Banner */}
                <div className={`instruction-banner ${selectedAddress ? 'success' : 'warning'}`}>
                    {hasAddresses ? (
                        selectedAddress ? (
                            <>
                                <FaCheckCircle /> <span>Address selected. You can proceed to payment.</span>
                            </>
                        ) : (
                            <>
                                <FaExclamationTriangle /> <span>Please choose a delivery address first.</span>
                            </>
                        )
                    ) : (
                        <>
                            <FaExclamationTriangle /> <span>Please add a delivery address first.</span>
                        </>
                    )}
                </div>

                <div className="address-grid">
                    {addresses.map(addr => (
                        <div
                            key={addr.id}
                            className={`address-card ${selectedAddress?.id === addr.id ? 'active-card' : ''}`}
                            onClick={() => handleSelectAddress(addr)}
                        >
                            <div className="address-header">
                                <span className="address-type">{addr.type}</span>
                                <div className="address-actions">
                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(addr); }} title="Edit"><FaEdit /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }} title="Delete"><FaTrash /></button>
                                </div>
                            </div>
                            <div className="address-details">
                                <strong>{addr.name}</strong>
                                <p>{addr.street}</p>
                                <p>{addr.city}, {addr.state} - {addr.zip}</p>
                                <p>Phone: {addr.mobile}</p>
                            </div>
                            {selectedAddress?.id === addr.id && <div className="check-icon"><FaCheckCircle /></div>}
                        </div>
                    ))}

                    <button className="add-address-btn" onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', mobile: '', street: '', city: '', state: '', zip: '', type: 'Home' });
                        setViewMode('form');
                    }}>
                        <FaPlus /> {hasAddresses ? 'Add New Address' : 'Add First Address'}
                    </button>
                </div>

                {hasAddresses && (
                    <div className="proceed-section">
                        <button
                            className={`proceed-btn ${!selectedAddress ? 'disabled' : ''}`}
                            onClick={handleProceed}
                            disabled={!selectedAddress}
                        >
                            Deliver Here
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderForm = () => (
        <div className="form-view fade-in">
            <div className="list-header">
                <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                <button className="back-btn" onClick={() => setViewMode('list')}>
                    <FaArrowLeft /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="address-form-inline">
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
                <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} required />
                <input name="street" placeholder="Street / House No." value={formData.street} onChange={handleInputChange} required />
                <div className="form-row">
                    <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
                    <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required />
                </div>
                <div className="form-row">
                    <input name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleInputChange} required />
                    <select name="type" value={formData.type} onChange={handleInputChange}>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => setViewMode('list')} className="cancel-btn">Cancel</button>
                    <button type="submit" className="save-btn">Save Address</button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="address-page">
            <TopBar />
            <Header />

            <div className="checkout-container">
                <div className="cart-header">
                    <div className="cart-title">Select Delivery Address</div>
                    {/* Stepper */}
                    <div className="cart-stepper">
                        <div className="step visited">
                            <div className="step-icon"><FaShoppingCart /></div>
                            <span>Cart</span>
                        </div>
                        <div className="step active">
                            <div className="step-icon"><FaMapMarkerAlt /></div>
                            <span>Address</span>
                        </div>
                        <div className="step">
                            <div className="step-icon"><FaCreditCard /></div>
                            <span>Payment</span>
                        </div>
                        <div className="step">
                            <div className="step-icon"><FaCheckCircle /></div>
                            <span>Done</span>
                        </div>
                    </div>
                </div>

                <div className="address-content-wrapper">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <>
                            {viewMode === 'list' && renderList()}
                            {viewMode === 'form' && renderForm()}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AddressPage;
