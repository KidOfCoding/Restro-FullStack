import React, { useState, useEffect, useRef } from 'react';
import './SpecialOfferTag.css';

const SpecialOfferTag = ({ onClick }) => {
    // Initial position logic refinement:
    // User wants "here" (Corner of the banner content).
    // Banner is usually centered. On Desktop (>768), content is ~80% width centered.
    // So right edge is around 90%. We want to overlap the corner, so slightly inside ~82-85%.
    // On Mobile, just -90px from right edge works.

    const [position, setPosition] = useState({
        x: window.innerWidth > 768 ? window.innerWidth * 0.8 : window.innerWidth - 90,
        y: 110
    });

    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        const touch = e.touches[0];
        offset.current = {
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        };
        // Prevent scrolling while dragging
        document.body.style.overflow = 'hidden';
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y
            });
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - offset.current.x,
                y: touch.clientY - offset.current.y
            });
            e.preventDefault(); // Stop scrolling
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.overflow = 'auto'; // Restore scroll
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
            document.body.style.overflow = 'auto';
        };
    }, [isDragging]);

    // Handle Click vs Drag distinction
    const startPos = useRef({ x: 0, y: 0 });
    const onMouseDownCapture = (e) => {
        startPos.current = { x: e.clientX, y: e.clientY };
        handleMouseDown(e);
    };

    const handleMouseUpCheck = (e) => {
        const moveX = Math.abs(e.clientX - startPos.current.x);
        const moveY = Math.abs(e.clientY - startPos.current.y);
        if (moveX < 5 && moveY < 5) {
            onClick();
        }
    };

    return (
        <div
            className="special-offer-tag"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={onMouseDownCapture}
            onMouseUp={handleMouseUpCheck}
            onTouchStart={handleTouchStart}
            ref={dragRef}
        >
            <div className="tag-content">
                <div className="offer-text-main">
                    <span>SPECIAL</span>
                    <span>OFFER</span>
                </div>
            </div>
            <div className="blob"></div>
        </div>
    );
};

export default SpecialOfferTag;
