import React, { useState, useEffect } from "react";
import style from "./header.module.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Header = () => {
  const slides = [
    {
      title: "Order your favourite food here",
      desc: "Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.",
      bgClass: style.bg1,
      btnText: "View Menu",
    },
    {
      title: "Fast Delivery at Your Doorstep",
      desc: "Hot and fresh food delivered quickly to your home. Experience the convenience of our super-fast delivery service.",
      bgClass: style.bg2,
      btnText: "Order Now",
    },
    {
      title: "Delicious Meals Every Day",
      desc: "Discover new tastes and flavours with our daily specials. We bring the best cuisines right to your table.",
      bgClass: style.bg3,
      btnText: "Explore",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className={style.header}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${style.slide} ${index === current ? style.active : ""
            } ${slide.bgClass}`}
        >
          <div className={`${style.content} ${index === current ? style.contentActive : ""}`}>
            <h2>{slide.title}</h2>
            <p>{slide.desc}</p>
            <a href="#ExploreMenu">{slide.btnText}</a>
          </div>
        </div>
      ))}

      <button className={style.prevBtn} onClick={prevSlide}>
        <FaArrowLeft />
      </button>
      <button className={style.nextBtn} onClick={nextSlide}>
        <FaArrowRight />
      </button>

      <div className={style.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${style.dot} ${index === current ? style.activeDot : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Header;
