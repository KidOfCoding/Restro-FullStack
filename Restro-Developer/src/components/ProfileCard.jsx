import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaCode } from 'react-icons/fa';
import { SiJavascript, SiReact, SiNodedotjs, SiMongodb, SiTypescript, SiNextdotjs, SiTailwindcss } from 'react-icons/si';

const ProfileCard = () => {
    const [hovered, setHovered] = useState(false);

    // Placeholder image logic - Using a gradient avatar if no image is available
    const AvatarPlaceholder = () => (
        <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1c1c1c, #2a2a2a)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '3.5rem',
            fontWeight: '800',
            position: 'relative',
        }}>
            <span style={{
                background: 'linear-gradient(to bottom right, #ff4d4d, #f9cb28)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(255, 77, 77, 0.5))'
            }}>D</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(16px) saturate(180%)',
                borderRadius: '30px',
                padding: '3rem 2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                maxWidth: '420px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Gradient Border Animation logic could go here, but keeping it performant */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 77, 77, 0.5), transparent)',
                opacity: 0.8
            }} />

            {/* Profile Image Section */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        padding: '4px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                        boxShadow: '0 0 40px rgba(0,0,0,0.5)' // Dark shadow for depth
                    }}
                >
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.8)' }}>
                        <AvatarPlaceholder />
                    </div>
                </motion.div>
            </div>

            {/* Name & Title */}
            <div style={{ marginBottom: '2.5rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        marginBottom: '0.4rem',
                        color: '#ffffff',
                        letterSpacing: '-0.5px'
                    }}
                >
                    Debasish Dash
                </motion.h1>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#ff4d4d' }}>In</span>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#9ca3af', letterSpacing: '1px' }}>
                        FULL STACK DEVELOPER
                    </h2>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        color: '#888',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        margin: '0 auto',
                        maxWidth: '90%'
                    }}
                >
                    Building high-performance web applications with modern technologies. The Architect behind <span style={{ color: '#fff' }}>Restro77</span>.
                </motion.p>
            </div>

            {/* Tech Stack Mini Icons - Colored on Hover? No, clean look prefered, white/grey */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.2rem',
                marginBottom: '3rem',
                padding: '1rem 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <TechIcon Icon={SiReact} color="#61DAFB" />
                <TechIcon Icon={SiNodedotjs} color="#339933" />
                <TechIcon Icon={SiMongodb} color="#47A248" />
                <TechIcon Icon={SiTypescript} color="#3178C6" />
                <TechIcon Icon={SiTailwindcss} color="#06B6D4" />
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
                <SocialLink href="http://www.linkedin.com/in/debasish-dash-276638310" icon={<FaLinkedin />} label="LinkedIn" hoverColor="#0077b5" />
                <SocialLink href="https://github.com" icon={<FaGithub />} label="GitHub" hoverColor="#ffffff" />
                <SocialLink href="mailto:debasish@example.com" icon={<FaEnvelope />} label="Email" hoverColor="#ea4335" />
            </div>

            <div style={{ textAlign: 'center' }}>
                <a href="https://restro77.com" style={{ textDecoration: 'none' }}>
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255, 77, 77, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'linear-gradient(90deg, #ff4d4d, #ff6b6b)',
                            border: 'none',
                            color: '#fff',
                            padding: '14px 32px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            boxShadow: '0 10px 20px -5px rgba(255, 77, 77, 0.3)',
                            transition: 'all 0.3s ease',
                            width: '100%'
                        }}
                    >
                        Visit Portfolio
                    </motion.button>
                </a>
            </div>

        </motion.div>
    );
};

const TechIcon = ({ Icon, color }) => (
    <motion.div
        whileHover={{ y: -3, color: color }}
        style={{ color: '#666', transition: 'color 0.3s', cursor: 'pointer' }}
    >
        <Icon size={22} />
    </motion.div>
);

const SocialLink = ({ href, icon, label, hoverColor }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -5, color: hoverColor }}
        style={{
            color: '#a0a0a0',
            fontSize: '1.6rem',
            transition: 'color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        title={label}
    >
        {icon}
    </motion.a>
);

export default ProfileCard;
