import React, { useState, useEffect, useRef } from 'react';
import './SpecialOfferTag.css';

const SpecialOfferTag = ({ onClick, show }) => {
    // If show is false (modal open), hide the tag
    if (!show) return null;

    // Initial position relative to the CONTAINER (Home div), not window.
    // The Header needs to be overlapped.
    // We want it on the right side, slightly overlapping the top right corner.
    // CSS absolute positioning is better here than JS calculations if it's not fixed.
    // But we still want "Draggable".

    // If we use position: absolute in CSS, and update top/left with JS, it works relative to the nearest relative parent.
    // In Home.jsx, the parent div should be relative.

    // Initial: Top 50px, Right 20px?
    // User wants "corner of hero card". Hero card has margin-top roughly.
    // We'll start with some default offset.

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });
    const isFirstRender = useRef(true);

    // Set initial position on mount (Top-Right of Header Card)
    useEffect(() => {
        if (isFirstRender.current) {
            // Header is 95% width, centered. Top margin 28px.
            // We want it to sit on the top-right corner like a notification badge.
            // Right edge of header = 97.5% of window width.
            // We'll place it slightly inward: 95% mark.
            // Top: Header starts at ~28px. We place tag at ~10px to overlap slightly.

            const headerRightEdge = window.innerWidth * 0.975;
            const tagWidth = 80;
            const startX = headerRightEdge - tagWidth + 10; // +10 to hang off slightly or -10 to be inside? 
            // User says "where I would place a cross symbol". That's usually inside.
            // Let's try placing it at 92% width approximately.

            const isMobile = window.innerWidth <= 768;
            const targetX = isMobile ? window.innerWidth - 80 : window.innerWidth * 0.92;
            const targetY = -5; // moved up further (was 5)

            setPosition({ x: targetX, y: targetY });
            isFirstRender.current = false;
        }
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        // Offset from the element's top-left
        const rect = dragRef.current.getBoundingClientRect();
        // We need to account for the offset within the element itself, 
        // BUT also we are working in "absolute" coordinates of the parent, not client (fixed).
        // Actually, if we use clientX/Y delta to update Position, it works fine.

        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        // Wait, if position is absolute relative to parent, and e.clientX is global... 
        // We need to subtract the parent's offset? default works if we track delta or if parent is at 0,0 (Home usually is flow).
        // Safer approach for draggable absolute: Track delta movement.

        // Let's stick to standard logic but be careful about scroll.
        // If we scroll, clientY changes for mouse, but absolute Top shouldn't change.
        // So we need to factor in scroll? 
        // Actually, if it's valid absolute drag, we usually map mouse pos to offsetParent.

        // Simpler: Just track box position = (Mouse - ClickOffset). 
        // But Mouse is global. If page is scrolled 100px, MouseY is small, but Element Top relative to Doc is large.
        // We need (e.pageX, e.pageY).
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        const touch = e.touches[0];
        // Use pageX/Y for absolute docs
        offset.current = {
            x: touch.pageX - position.x,
            y: touch.pageY - position.y
        };
        document.body.style.overflow = 'hidden';
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setPosition({
                x: e.pageX - offset.current.x,
                y: e.pageY - offset.current.y
            });
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            setPosition({
                x: touch.pageX - offset.current.x,
                y: touch.pageY - offset.current.y
            });
            e.preventDefault();
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.overflow = 'auto';
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

    // Click Detection
    const startPos = useRef({ x: 0, y: 0 });
    const onMouseDownCapture = (e) => {
        startPos.current = { x: e.clientX, y: e.clientY };
        // We need page coords for the drag start calculation above though. 
        // Re-implement simplified version inline for the handler?
        // No, let's just calc offset here correctly.

        setIsDragging(true);
        offset.current = {
            x: e.pageX - position.x,
            y: e.pageY - position.y
        };
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
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'absolute' // Changed from fixed
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
