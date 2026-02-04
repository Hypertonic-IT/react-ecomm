import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides } from '../../../../data/fashionData';
import { FaArrowRight, FaArrowLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    // Variants for direction-aware slide animation
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    const textVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = useCallback((newDirection) => {
        setDirection(newDirection);
        setCurrent((prev) => {
            let nextIndex = prev + newDirection;
            if (nextIndex < 0) nextIndex = heroSlides.length - 1;
            if (nextIndex >= heroSlides.length) nextIndex = 0;
            return nextIndex;
        });
    }, []);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 8000);
        return () => clearInterval(timer);
    }, [paginate]);

    const slide = heroSlides[current];

    const formatNumber = (num) => `0${num}`.slice(-2);

    return (
        <div className="hero-container">
            <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 },
                        scale: { duration: 0.5 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="hero-slide-wrapper"
                >
                    <div className="hero-overlay" />
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="hero-image-bg"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80'; }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="hero-content-layer">
                <div className="hero-content-inner">
                    <motion.div
                        key={`text-${current}`}
                        initial="hidden"
                        animate="visible"
                        className="hero-text-block"
                    >
                        <motion.div variants={textVariants} className="hero-subtitle-wrapper">
                            <span className="hero-subtitle-line"></span>
                            <span className="hero-subtitle-text">{slide.subtitle}</span>
                        </motion.div>

                        <motion.h1
                            variants={textVariants}
                            transition={{ delay: 0.2 }}
                            className="hero-main-title"
                        >
                            {slide.title.split(' ').map((word, i) => (
                                <span key={i} className="title-word">{word} </span>
                            ))}
                        </motion.h1>

                        <motion.div
                            variants={textVariants}
                            transition={{ delay: 0.4 }}
                            className="hero-cta-wrapper"
                        >
                            {slide.link ? (
                                <Link to={slide.link} className="hero-cta-btn">
                                    <span className="btn-text">{slide.cta}</span>
                                    <span className="btn-icon"><FaLongArrowAltRight /></span>
                                </Link>
                            ) : (
                                <button className="hero-cta-btn">
                                    <span className="btn-text">{slide.cta}</span>
                                    <span className="btn-icon"><FaLongArrowAltRight /></span>
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="hero-controls">
                <div className="slide-counter">
                    <span className="current-num">{formatNumber(current + 1)}</span>
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 8, ease: "linear", repeat: 0 }}
                            key={current}
                        />
                    </div>
                    <span className="total-num">{formatNumber(heroSlides.length)}</span>
                </div>

                <div className="nav-arrows">
                    <button onClick={() => paginate(-1)} className="nav-btn prev" aria-label="Previous">
                        <FaArrowLeft />
                    </button>
                    <button onClick={() => paginate(1)} className="nav-btn next" aria-label="Next">
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
