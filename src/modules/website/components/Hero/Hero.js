
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides } from '../../../../data/fashionData';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === heroSlides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? heroSlides.length - 1 : current - 1);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [current]);

    const slide = heroSlides[current];

    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/1920x1080?text=Hero+Image';
    };

    return (
        <div className="hero">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-slide"
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="hero-image"
                        onError={handleImageError}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="hero-content">
                <div key={`sub-${current}`} className="hero-subtitle">
                    {slide.subtitle}
                </div>
                <div key={`title-${current}`} className="hero-title">
                    {slide.title}
                </div>
                {/* Check if link exists, otherwise use button */}
                {slide.link ? (
                    <Link to={slide.link}>
                        <button key={`btn-${current}`} className="hero-btn">
                            {slide.cta}
                        </button>
                    </Link>
                ) : (
                    <button key={`btn-${current}`} className="hero-btn">
                        {slide.cta}
                    </button>
                )}
            </div>

            <div className="hero-arrows">
                <button onClick={prevSlide} className="arrow-btn" aria-label="Previous Slide"><FaArrowLeft /></button>
                <button onClick={nextSlide} className="arrow-btn" aria-label="Next Slide"><FaArrowRight /></button>
            </div>
        </div>
    );
};

export default Hero;
