import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import profileImg from '../assets/profile.png';

const Hero = () => {
    return (
        <section style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            flexWrap: 'wrap',
            gap: 'clamp(1rem, 3vw, 3rem)',
            alignItems: 'center',
            justifyContent: 'center', // Keeps the main flex items focused towards center if extra space
            minHeight: '80vh',
            padding: '1rem 0 3rem 0'
        }}>

            {/* Right Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                    flex: '1 1 280px',
                    display: 'flex',
                    justifyContent: 'flex-start', // <--- CHANGED FROM 'center' TO 'flex-start'
                    position: 'relative',
                    marginBottom: '0.5rem'
                }}
            >
                {/* Background Circle - positioning adjusted to be relative to the image container better if needed, 
            but absolute centering on '50% 50%' of parent works if parent is image-sized.
            However, parent is flex-basis 280px.
            If we justify-start, the image sits on left. 
            The background circle is absolutely positioned to center of parent.
            If parent is wide (280px+) and image is small (130px), center of parent != center of image.
            
            Fix: Make the background circle relative to the inner image wrapper, OR 
            Change structure slightly so background is part of the image wrapper.
        */}

                {/* Moving Background Circle INSIDE the image wrapper for consistent alignment */}
                <div style={{
                    position: 'relative', // Wrapper acts as the anchor
                    width: 'clamp(130px, 25vw, 400px)',
                    height: 'clamp(130px, 25vw, 400px)',
                }}>
                    <div style={{
                        position: 'absolute',
                        width: '120%', // Slightly larger than image
                        height: '120%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
                        zIndex: -1,
                    }} />

                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid rgba(255, 255, 255, 0.05)',
                        background: '#111'
                    }}>
                        <img
                            src={profileImg}
                            alt="Debasish"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'grayscale(20%) contrast(1.1)'
                            }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Left Content (Text) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ flex: '1 1 500px' }}
            >
                <div style={{
                    width: '60px',
                    height: '4px',
                    background: '#ffffff',
                    marginBottom: '1rem'
                }} />

                <h1 style={{
                    fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                    lineHeight: '1.1',
                    fontWeight: '700',
                    marginBottom: '0.8rem',
                    color: '#ffffff'
                }}>
                    Nice to meet you,<br />
                    I'm <span style={{
                        background: 'linear-gradient(to right, #ff4d4d, #f9cb28)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Debasish Dash</span>
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#9ca3af',
                    lineHeight: '1.5',
                    maxWidth: '500px',
                    marginBottom: '1.5rem'
                }}>
                    Based in India, I'm a Full-stack developer passionate about building accessible, pixel-perfect web applications that deliver premium user experiences. The Architect behind Restro77.
                </p>

                {/* Stats Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff' }}>2+</h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Years of<br />experience</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff' }}>10+</h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Successful<br />projects</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
                    <a href="https://restro77.com" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'linear-gradient(90deg, #ff4d4d, #ff6b6b)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '0px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                borderBottom: '4px solid #cc0000'
                            }}
                        >
                            Visit Portfolio
                        </motion.button>
                    </a>

                    <div style={{ display: 'flex', gap: '1.2rem', fontSize: '1.3rem', color: '#ffffff' }}>
                        <a href="http://www.linkedin.com/in/debasish-dash-276638310" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FaLinkedin /></a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FaGithub /></a>
                        <a href="mailto:your.email@example.com" style={{ color: 'inherit' }}><FaEnvelope /></a>
                    </div>
                </div>

            </motion.div>

        </section>
    );
};

export default Hero;
