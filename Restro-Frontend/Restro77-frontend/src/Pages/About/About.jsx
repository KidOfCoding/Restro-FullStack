import React, { useState, useEffect } from 'react';
import style from './about.module.css';
import { assets } from '../../assets/assets';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import img3132 from '../../assets/Restro_Images/IMG_3132.JPG';
import img3133 from '../../assets/Restro_Images/IMG_3133.JPG';
import img3134 from '../../assets/Restro_Images/IMG_3134.JPG';
import img3135 from '../../assets/Restro_Images/IMG_3135.JPG';
import img3136 from '../../assets/Restro_Images/IMG_3136.JPG';
import img3137 from '../../assets/Restro_Images/IMG_3137.JPG';
import img3138 from '../../assets/Restro_Images/IMG_3138.JPG';

const About = () => {
    // We'll use food_list images for the carousel or static placeholders
    // Since we might not have a dedicated "gallery", let's use some food images from assets if available
    // or just placeholder divs to demonstrate the style.
    // Assuming 'assets' has food images or we can use the menu list (would need context).
    // For simplicity, let's use a mix of known assets if possible, or just dynamic placeholders.
    // Actually, asking context for food_list might be better?
    // Let's import StoreContext to get some real food images!

    // To minimize complexity without Context here, I'll use placeholders + whatever is in assets object
    // or quickly grab from context if I import it.

    const [activeIndex, setActiveIndex] = useState(2);

    // Mock images (You can replace these with your actual gallery/restro images)
    const gallery = [
        img3132,
        img3133,
        img3134,
        img3135,
        img3136,
        img3137,
        img3138
    ].filter(Boolean); // Ensure no undefined

    // For better carousel, let's ensure we have at least 5 items by duplicating if needed
    const items = gallery.length < 5 ? [...gallery, ...gallery, ...gallery].slice(0, 5) : gallery.slice(0, 5);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    // Auto-play
    useEffect(() => {
        const interval = setInterval(handleNext, 3000);
        return () => clearInterval(interval);
    }, [items.length]);

    // Helper to determine class based on distance from active
    const getItemClass = (index) => {
        const diff = (index - activeIndex + items.length) % items.length;

        if (diff === 0) return style.activeItem;
        if (diff === 1) return style.rightItem;
        if (diff === 2) return style.rightHidden; // Or generic hidden
        if (diff === items.length - 1) return style.leftItem;
        if (diff === items.length - 2) return style.leftHidden;

        return style.rightHidden; // Default hide rest
    };

    return (
        <div className={style.aboutContainer}>
            {/* HERO / INTRO */}
            <section className={style.heroSection}>
                <h1 className={style.heroTitle}>About Us</h1>
                <div className={style.heroText}>
                    <p>
                        <span className={style.highlight}>Restro77</span> was established in 2022 with a clear vision to serve healthy, regional, and pocket-friendly food that delights our customers every day.
                    </p>
                    <br />
                    <p>
                        We believe that great food should be fresh, flavorful, hygienic, and affordable. Inspired by authentic regional cuisines, our dishes are prepared with care, quality ingredients, and a deep passion for taste and nutrition.
                    </p>
                    <br />
                    <p>
                        With the continuous support and trust of our customers, Restro77 expanded its journey beyond dine-in and takeaway services and proudly entered the catering segment, offering delicious food for events, celebrations, and special occasions.
                    </p>
                    <br />
                    <p>
                        As part of our commitment to growth and better service, we are now launching our website to provide a smooth and enhanced user experience, making it easier for customers to connect with us and enjoy our offerings.
                    </p>
                    <br />
                    <p style={{ fontSize: '1.3rem', fontStyle: 'italic', marginTop: '20px', color: '#ffcc00' }}>
                        "At Restro77, we don’t just serve meals – we serve health, happiness, and heartfelt hospitality."
                    </p>
                </div>
            </section>

            {/* FLIPSTER CAROUSEL */}
            <section className={style.carouselSection}>
                <h2 className={style.carouselTitle}>Our Gallery</h2>
                <div className={style.carouselContainer}>
                    {items.map((img, index) => (
                        <div
                            key={index}
                            className={`${style.carouselItem} ${getItemClass(index)}`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <img src={img} alt={`Gallery ${index}`} />
                        </div>
                    ))}
                </div>
                <div className={style.controls}>
                    <button className={style.controlBtn} onClick={handlePrev}><FiChevronLeft /></button>
                    <button className={style.controlBtn} onClick={handleNext}><FiChevronRight /></button>
                </div>
            </section>

            {/* CONTACT & LOCATION */}
            <section className={style.contactSection}>
                <h2 className={style.contactTitle}>Contact & Location</h2>
                <div className={style.contactDetails}>
                    <p><strong>Restro77</strong></p>
                    <p>In front of CGU Backgate</p>
                    <p>Mahura, Bhubaneswar – 752054</p>
                    <p>Odisha, India</p>
                    <div className={style.contactIcons}>
                        <p>📞 Mobile: 7008939551</p>
                        <p>📧 Email: restro77bbsr@gmail.com</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
