import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                padding: '2rem 0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#ff4d4d' }}>&lt;DD/&gt;</span>
                <span>Developer DD</span>
            </div>

            <ul style={{
                display: 'flex',
                gap: 'clamp(1rem, 4vw, 2.5rem)',
                listStyle: 'none',
                fontSize: '0.95rem',
                color: '#9ca3af',
                fontWeight: '500',
                margin: 0,
                padding: 0
            }}>
                <li style={{ color: '#fff', cursor: 'pointer' }}>Home</li>
                <li style={{ cursor: 'pointer' }}>About</li>
                <li style={{ cursor: 'pointer' }}>Projects</li>
                <li style={{ cursor: 'pointer' }}>Contact</li>
            </ul>
        </motion.nav>
    );
};

export default Navbar;
