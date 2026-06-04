import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import { API_BASE_URL } from 'config';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                alert("Thank you for contacting us! We'll get back to you shortly.");
            } else {
                setStatus('error');
                alert(data.message || "Failed to send message. Please try again.");
            }
        } catch (error) {
            setStatus('error');
            alert("Network error. Please try again.");
        }
    };

    return (
        <div style={{ fontFamily: '"Helvetica Neue", sans-serif', color: '#333' }}>
            <TopBar />
            <Header />

            {/* Header */}
            <div style={{
                position: 'relative',
                height: '350px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact Us</h1>
                    <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto', fontWeight: '300' }}>We'd love to hear from you. Get in touch!</p>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', gap: '50px' }}>

                {/* Contact Information */}
                <div style={{ flex: '1 1 400px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' }}>Get In Touch</h2>
                    <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '40px' }}>
                        Have a question about your order, shipping, or just want to say hi?
                        Fill out the form or reach us directly using the information below.
                    </p>

                    <div style={{ display: 'grid', gap: '30px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '50%', background: '#f9f9f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4a373', fontSize: '20px'
                            }}>
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Our Location</h4>
                                <p style={{ color: '#666', fontSize: '14px' }}>1st Floor, Plot No: 3, Near Neelam Chowk Metro station, Azad Colony, sector 15A,<br/> Faridabad, Haryana, 121007</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '50%', background: '#f9f9f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4a373', fontSize: '20px'
                            }}>
                                <FaPhoneAlt />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Phone Number</h4>
                                <p style={{ color: '#666', fontSize: '14px' }}>+91 9216621756</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '50%', background: '#f9f9f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4a373', fontSize: '20px'
                            }}>
                                <FaEnvelope />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Email Address</h4>
                                <p style={{ color: '#666', fontSize: '14px' }}>support@kayaroop.com</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '50%', background: '#f9f9f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4a373', fontSize: '20px'
                            }}>
                                <FaClock />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Working Hours</h4>
                                <p style={{ color: '#666', fontSize: '14px' }}>Mon - Fri: 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div style={{ flex: '1 1 500px', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 5px 25px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' }}>Send a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
                                placeholder="John Doe"
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Your Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
                                placeholder="Order Inquiry"
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', resize: 'vertical' }}
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '100%', padding: '15px', background: '#000', color: '#fff',
                                border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                        >
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Map */}
            <div style={{ width: '100%', height: '450px', marginTop: '60px' }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3528.0107181708704!2d77.31311769999999!3d28.3971956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdd2e7679ce6b%3A0x36927f402b606532!2s%26work%20Co-working!5e1!3m2!1sen!2sin!4v1780053047867!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(100%)' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Our Location"
                ></iframe>
            </div>

            <Footer />
        </div>
    );
};

export default ContactUs;
