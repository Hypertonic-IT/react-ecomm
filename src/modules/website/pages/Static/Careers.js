import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';

const Careers = () => {
    return (
        <div style={{ fontFamily: '"Helvetica Neue", sans-serif', color: '#333' }}>
            <TopBar />
            <Header />

            {/* Hero Section */}
            <div style={{
                height: '400px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                position: 'relative',
                textAlign: 'center'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
                    <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px' }}>Join Our Team</h1>
                    <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>
                        Help us redefine the future of fashion. We are looking for passionate individuals to join the Kayaroop family.
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '50px' }}>Open Positions</h2>

                <div style={{ display: 'grid', gap: '30px' }}>
                    {/* Job Card 1 */}
                    <div style={{
                        padding: '30px', border: '1px solid #eee', borderRadius: '12px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Senior UX/UI Designer</h3>
                            <p style={{ color: '#666', marginBottom: '0' }}>Remote • Full Time • Design Team</p>
                        </div>
                        <button style={{
                            padding: '12px 24px', backgroundColor: '#000', color: '#fff',
                            border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer',
                            fontWeight: '600'
                        }}>Apply Now</button>
                    </div>

                    {/* Job Card 2 */}
                    <div style={{
                        padding: '30px', border: '1px solid #eee', borderRadius: '12px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>E-commerce Marketing Manager</h3>
                            <p style={{ color: '#666', marginBottom: '0' }}>New York, NY • Full Time • Marketing</p>
                        </div>
                        <button style={{
                            padding: '12px 24px', backgroundColor: '#000', color: '#fff',
                            border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer',
                            fontWeight: '600'
                        }}>Apply Now</button>
                    </div>

                    {/* Job Card 3 */}
                    <div style={{
                        padding: '30px', border: '1px solid #eee', borderRadius: '12px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Fashion Supply Chain Analyst</h3>
                            <p style={{ color: '#666', marginBottom: '0' }}>London, UK • Full Time • Operations</p>
                        </div>
                        <button style={{
                            padding: '12px 24px', backgroundColor: '#000', color: '#fff',
                            border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer',
                            fontWeight: '600'
                        }}>Apply Now</button>
                    </div>
                </div>

                <div style={{ marginTop: '80px', textAlign: 'center' }}>
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80"
                        alt="Office Culture"
                        style={{ width: '100%', borderRadius: '12px', marginBottom: '40px' }}
                    />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>Don't see a perfect fit?</h3>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                        We are always looking for talent. Send your resume to <a href="mailto:careers@kayaroop.com" style={{ color: '#d4a373' }}>careers@kayaroop.com</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Careers;
